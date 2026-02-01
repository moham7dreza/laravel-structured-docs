<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use App\Models\DocumentSection;
use App\Models\DocumentSectionItem;
use Filament\Actions;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Model;

class EditDocumentContent extends EditRecord
{
    protected static string $resource = DocumentResource::class;

    protected static ?string $title = 'Edit Document Content';

    protected static ?string $navigationLabel = 'Edit Content';

    public function mount(int|string $record): void
    {
        parent::mount($record);

        // Eager load all necessary relationships to avoid N+1 queries and null errors
        $this->record->load([
            'structure',
            'sections.structureSection',
            'sections.items.structureSectionItem',
        ]);

        // Initialize document sections if they don't exist
        $this->initializeDocumentSections();
    }

    protected function initializeDocumentSections(): void
    {
        $document = $this->record;

        if (! $document->structure_id) {
            return;
        }

        // Get all structure sections
        $structureSections = $document->structure->sections()->with('items')->get();

        foreach ($structureSections as $structureSection) {
            // Check if document section already exists
            $documentSection = DocumentSection::firstOrCreate(
                [
                    'document_id' => $document->id,
                    'structure_section_id' => $structureSection->id,
                    'instance_number' => 1,
                ],
                [
                    'is_complete' => false,
                    'position' => $structureSection->position,
                ]
            );

            // Create document section items for each structure section item
            foreach ($structureSection->items as $structureSectionItem) {
                DocumentSectionItem::firstOrCreate(
                    [
                        'document_section_id' => $documentSection->id,
                        'structure_section_item_id' => $structureSectionItem->id,
                    ],
                    [
                        'content' => $structureSectionItem->default_value,
                        'is_valid' => true,
                        'last_edited_by' => auth()->id(),
                        'last_edited_at' => now(),
                    ]
                );
            }
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('back')
                ->label('Back to Document')
                ->url(fn () => static::getResource()::getUrl('edit', ['record' => $this->record]))
                ->icon('heroicon-o-arrow-left'),
            Actions\DeleteAction::make(),
        ];
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Document Information')
                    ->description('Basic document information')
                    ->schema([
                        TextInput::make('title')
                            ->disabled(),
                        TextInput::make('structure.title')
                            ->label('Structure')
                            ->disabled(),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Section::make('Document Content')
                    ->description('Edit the content for each section based on the selected structure')
                    ->schema([
                        Repeater::make('sections')
                            ->relationship('sections')
                            ->schema([
                                TextInput::make('structure_section_title')
                                    ->label('Section Title')
                                    ->disabled()
                                    ->columnSpanFull()
                                    ->formatStateUsing(function ($record) {
                                        return $record?->structureSection?->title ?? 'Unknown Section';
                                    }),

                                Toggle::make('is_complete')
                                    ->label('Mark as Complete')
                                    ->helperText('Check this when section is finished'),

                                Repeater::make('items')
                                    ->relationship('items')
                                    ->schema([
                                        TextInput::make('structure_item_label')
                                            ->label('Field Label')
                                            ->disabled()
                                            ->columnSpanFull()
                                            ->formatStateUsing(function ($record) {
                                                return $record?->structureSectionItem?->label ?? 'Field';
                                            }),

                                        RichEditor::make('content')
                                            ->label(fn ($record) => $record?->structureSectionItem?->label ?? 'Content')
                                            ->helperText(fn ($record) => $record?->structureSectionItem?->description)
                                            ->placeholder(fn ($record) => $record?->structureSectionItem?->placeholder)
                                            ->required(fn ($record) => $record?->structureSectionItem?->is_required ?? false)
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
                                            ]),

                                        TextInput::make('last_edited_at')
                                            ->label('Last Edited')
                                            ->disabled()
                                            ->formatStateUsing(function ($state, $record) {
                                                if (! $record || ! $record->last_edited_at) {
                                                    return 'Never';
                                                }

                                                return $record->last_edited_at->diffForHumans();
                                            }),
                                    ])
                                    ->columns(2)
                                    ->collapsible()
                                    ->defaultItems(0)
                                    ->addable(false)
                                    ->deletable(false)
                                    ->reorderable(false),
                            ])
                            ->columns(1)
                            ->collapsible()
                            ->itemLabel(fn (?Model $record): ?string => $record?->structureSection?->title ?? 'Section')
                            ->defaultItems(0)
                            ->addable(false)
                            ->deletable(false)
                            ->reorderable(false),
                    ]),
            ]);
    }

    protected function getFieldComponent($structureSectionItem): TextInput|Textarea|RichEditor|Select
    {
        // Safety check - if null, return a basic text input
        if (! $structureSectionItem) {
            return TextInput::make('content')
                ->label('Content')
                ->columnSpanFull();
        }

        $baseField = match ($structureSectionItem->type) {
            'rich_text' => RichEditor::make('content')
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
                ]),
            'textarea' => Textarea::make('content')
                ->rows(5),
            'text' => TextInput::make('content'),
            'number' => TextInput::make('content')
                ->numeric(),
            'date' => TextInput::make('content')
                ->type('date'),
            'select' => Select::make('content')
                ->options(function () {
                    // Parse options from validation_rules or default_value
                    return ['option1' => 'Option 1', 'option2' => 'Option 2'];
                }),
            default => TextInput::make('content'),
        };

        return $baseField
            ->label($structureSectionItem->label)
            ->helperText($structureSectionItem->description)
            ->placeholder($structureSectionItem->placeholder)
            ->required($structureSectionItem->is_required)
            ->columnSpanFull();
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Update last_edited_at for all modified items
        if (isset($data['sections'])) {
            foreach ($data['sections'] as &$section) {
                if (isset($section['items'])) {
                    foreach ($section['items'] as &$item) {
                        $item['last_edited_by'] = auth()->id();
                        $item['last_edited_at'] = now();
                    }
                }
            }
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('edit-content', ['record' => $this->record]);
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Document content saved')
            ->body('The document content has been updated successfully.');
    }
}
