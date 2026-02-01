<?php

namespace App\Filament\Admin\Resources\Documents\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
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
                                Section::make()
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
                                            ->helperText('Select a category first to see available structures. Default structure is recommended.')
                                            ->live(),
                                        Select::make('owner_id')
                                            ->relationship('owner', 'name')
                                            ->required()
                                            ->searchable()
                                            ->preload()
                                            ->default(fn () => auth()->id()),
                                    ])
                                    ->columns(3),
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
}
