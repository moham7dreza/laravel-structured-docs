<?php

namespace App\Filament\Admin\Resources\Documents\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class DocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Document Details')
                    ->tabs([
                        Tabs\Tab::make('Basic Information')
                            ->schema([
                                Section::make()
                                    ->schema([
                                        TextInput::make('title')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                                        TextInput::make('slug')
                                            ->required()
                                            ->maxLength(255)
                                            ->unique(ignoreRecord: true)
                                            ->rules(['alpha_dash']),
                                        Textarea::make('description')
                                            ->rows(4)
                                            ->columnSpanFull(),
                                        FileUpload::make('image')
                                            ->image()
                                            ->directory('documents')
                                            ->imageEditor()
                                            ->columnSpanFull(),
                                    ])
                                    ->columns(2),
                            ]),

                        Tabs\Tab::make('Structure & Category')
                            ->schema([
                                Section::make('Category and Structure Selection')
                                    ->schema([
                                        Select::make('category_id')
                                            ->relationship('category', 'name')
                                            ->required()
                                            ->searchable()
                                            ->preload()
                                            ->live()
                                            ->afterStateUpdated(fn (callable $set) => $set('structure_id', null))
                                            ->helperText('Select a category first to see available structures'),
                                        Select::make('structure_id')
                                            ->relationship(
                                                'structure',
                                                'title',
                                                fn ($query, callable $get) => $query
                                                    ->when(
                                                        $get('category_id'),
                                                        fn ($q, $categoryId) => $q->where('category_id', $categoryId)
                                                            ->where('is_active', true)
                                                    )
                                                    ->orderBy('is_default', 'desc')
                                                    ->orderBy('title')
                                            )
                                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->is_default
                                                ? "{$record->title} (Default - v{$record->version})"
                                                : "{$record->title} (v{$record->version})")
                                            ->required()
                                            ->searchable()
                                            ->preload()
                                            ->disabled(fn (callable $get) => ! $get('category_id'))
                                            ->helperText('Select a structure first to see available structures. Default structure is recommended.')
                                            ->live(),
                                        Select::make('owner_id')
                                            ->relationship('owner', 'name')
                                            ->required()
                                            ->searchable()
                                            ->preload()
                                            ->default(fn () => auth()->id()),
                                    ])
                                    ->columns(3)
                                    ->collapsible(),

                                Section::make('Document Content')
                                    ->description('Fill in the content based on the selected structure')
                                    ->schema([
                                        Placeholder::make('select_structure_first')
                                            ->label('')
                                            ->content('👆 Please select a Structure above to see content fields here.')
                                            ->columnSpanFull()
                                            ->visible(fn (callable $get) => ! $get('structure_id')),

                                        static::getContentFields(),
                                    ])
                                    ->visible(fn (callable $get) => (bool) $get('structure_id'))
                                    ->collapsible()
                                    ->collapsed(false),
                            ]),

                        Tabs\Tab::make('Branch & Integration')
                            ->schema([
                                Section::make('Git Branch Information')
                                    ->description('Link this document to a Git branch and Jira task')
                                    ->schema([
                                        Repeater::make('branches')
                                            ->relationship('branches')
                                            ->schema([
                                                TextInput::make('task_id')
                                                    ->label('Jira Task ID')
                                                    ->required()
                                                    ->maxLength(100)
                                                    ->placeholder('e.g., PROJ-123')
                                                    ->helperText('The Jira task identifier'),
                                                TextInput::make('task_title')
                                                    ->label('Task Title')
                                                    ->maxLength(500)
                                                    ->placeholder('e.g., Add user authentication feature')
                                                    ->columnSpanFull(),
                                                TextInput::make('branch_name')
                                                    ->label('Branch Name')
                                                    ->required()
                                                    ->maxLength(255)
                                                    ->placeholder('e.g., feature/PROJ-123-add-authentication')
                                                    ->helperText('The Git branch name'),
                                                TextInput::make('repository_url')
                                                    ->label('Repository URL')
                                                    ->url()
                                                    ->maxLength(500)
                                                    ->placeholder('e.g., https://github.com/company/project')
                                                    ->columnSpanFull(),
                                                DateTimePicker::make('merged_at')
                                                    ->label('Merged At')
                                                    ->helperText('When this branch was merged (leave empty if not merged yet)'),
                                            ])
                                            ->columns(2)
                                            ->collapsible()
                                            ->itemLabel(fn (array $state): ?string => $state['task_id'] ?? 'New Branch')
                                            ->defaultItems(0)
                                            ->addActionLabel('Add Branch')
                                            ->reorderableWithButtons(),
                                    ])
                                    ->collapsible(),
                            ]),

                        Tabs\Tab::make('Settings')
                            ->schema([
                                Section::make('Visibility & Status')
                                    ->schema([
                                        Select::make('visibility')
                                            ->options([
                                                'public' => 'Public',
                                                'private' => 'Private',
                                                'team' => 'Team',
                                            ])
                                            ->default('private')
                                            ->required()
                                            ->native(false),
                                        Select::make('status')
                                            ->options([
                                                'draft' => 'Draft',
                                                'pending_review' => 'Pending Review',
                                                'published' => 'Published',
                                                'completed' => 'Completed',
                                                'stale' => 'Stale',
                                                'archived' => 'Archived',
                                            ])
                                            ->default('draft')
                                            ->required()
                                            ->native(false),
                                        Select::make('approval_status')
                                            ->options([
                                                'not_submitted' => 'Not Submitted',
                                                'pending' => 'Pending',
                                                'approved' => 'Approved',
                                                'rejected' => 'Rejected',
                                            ])
                                            ->default('not_submitted')
                                            ->required()
                                            ->native(false),
                                    ])
                                    ->columns(3),
                            ]),

                        Tabs\Tab::make('Statistics')
                            ->schema([
                                Section::make('Document Metrics')
                                    ->schema([
                                        TextInput::make('total_score')
                                            ->numeric()
                                            ->default(0)
                                            ->disabled()
                                            ->helperText('Auto-calculated'),
                                        TextInput::make('completeness_percentage')
                                            ->numeric()
                                            ->default(0.0)
                                            ->suffix('%')
                                            ->disabled()
                                            ->helperText('Auto-calculated'),
                                        TextInput::make('view_count')
                                            ->numeric()
                                            ->default(0)
                                            ->disabled(),
                                        TextInput::make('comment_count')
                                            ->numeric()
                                            ->default(0)
                                            ->disabled(),
                                        TextInput::make('reaction_count')
                                            ->numeric()
                                            ->default(0)
                                            ->disabled(),
                                    ])
                                    ->columns(5),

                                Section::make('Important Dates')
                                    ->schema([
                                        DateTimePicker::make('published_at')
                                            ->label('Published At'),
                                        DateTimePicker::make('first_published_at')
                                            ->label('First Published At')
                                            ->disabled(),
                                        DateTimePicker::make('completed_at')
                                            ->label('Completed At'),
                                        DateTimePicker::make('stale_detected_at')
                                            ->label('Stale Detected At')
                                            ->disabled(),
                                        DateTimePicker::make('last_activity_at')
                                            ->label('Last Activity At')
                                            ->disabled(),
                                    ])
                                    ->columns(3),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    protected static function getContentFields()
    {
        return Section::make()
            ->schema(function (callable $get) {
                $structureId = $get('structure_id');

                if (! $structureId) {
                    return [];
                }

                // Load the structure with its sections and items
                $structure = \App\Models\Structure::with(['sections' => function ($query) {
                    $query->orderBy('position');
                }, 'sections.items' => function ($query) {
                    $query->orderBy('position');
                }])->find($structureId);

                if (! $structure || $structure->sections->isEmpty()) {
                    return [
                        Placeholder::make('no_sections')
                            ->label('')
                            ->content('This structure has no sections defined yet.')
                            ->columnSpanFull(),
                    ];
                }

                $fields = [];

                foreach ($structure->sections as $section) {
                    $itemFields = [];

                    foreach ($section->items as $item) {
                        $itemFields[] = RichEditor::make("content_data.section_{$section->id}_item_{$item->id}")
                            ->label($item->label)
                            ->helperText($item->description)
                            ->placeholder($item->placeholder)
                            ->required($item->is_required)
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'link',
                                'bulletList',
                                'orderedList',
                                'h2',
                                'h3',
                                'blockquote',
                                'codeBlock',
                            ]);
                    }

                    if (! empty($itemFields)) {
                        $fields[] = Section::make($section->title)
                            ->description($section->description)
                            ->schema($itemFields)
                            ->collapsible()
                            ->columnSpanFull();
                    }
                }

                return $fields;
            })
            ->columnSpanFull();
    }
}
