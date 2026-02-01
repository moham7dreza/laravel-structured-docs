<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use Filament\Actions;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class ViewDocument extends ViewRecord
{
    protected static string $resource = DocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Document Information')
                    ->schema([
                        TextInput::make('title')
                            ->disabled(),
                        TextInput::make('slug')
                            ->disabled(),
                        TextInput::make('description')
                            ->disabled()
                            ->columnSpanFull(),
                        TextInput::make('category.name')
                            ->label('Category')
                            ->disabled(),
                        TextInput::make('structure.title')
                            ->label('Structure')
                            ->disabled(),
                        TextInput::make('owner.name')
                            ->label('Owner')
                            ->disabled(),
                    ])
                    ->columns(3)
                    ->collapsible(),

                Section::make('Status & Settings')
                    ->schema([
                        TextInput::make('status')
                            ->disabled(),
                        TextInput::make('visibility')
                            ->disabled(),
                        TextInput::make('approval_status')
                            ->label('Approval Status')
                            ->disabled(),
                    ])
                    ->columns(3)
                    ->collapsible(),

                Section::make('Statistics')
                    ->schema([
                        TextInput::make('completeness_percentage')
                            ->label('Completeness')
                            ->suffix('%')
                            ->disabled(),
                        TextInput::make('total_score')
                            ->label('Score')
                            ->disabled(),
                        TextInput::make('view_count')
                            ->label('Views')
                            ->disabled(),
                        TextInput::make('comment_count')
                            ->label('Comments')
                            ->disabled(),
                        TextInput::make('reaction_count')
                            ->label('Reactions')
                            ->disabled(),
                    ])
                    ->columns(5)
                    ->collapsible(),

                Section::make('Important Dates')
                    ->schema([
                        TextInput::make('published_at')
                            ->label('Published')
                            ->disabled(),
                        TextInput::make('first_published_at')
                            ->label('First Published')
                            ->disabled(),
                        TextInput::make('completed_at')
                            ->label('Completed')
                            ->disabled(),
                        TextInput::make('last_activity_at')
                            ->label('Last Activity')
                            ->disabled(),
                        TextInput::make('created_at')
                            ->label('Created')
                            ->disabled(),
                        TextInput::make('updated_at')
                            ->label('Updated')
                            ->disabled(),
                    ])
                    ->columns(3)
                    ->collapsible()
                    ->collapsed(),

                Section::make('Document Content')
                    ->description('Content based on the selected structure')
                    ->schema([
                        Placeholder::make('sections_content')
                            ->label('')
                            ->content(function ($record) {
                                if (! $record->structure_id) {
                                    return new HtmlString('<p class="text-sm text-gray-500">No structure selected for this document.</p>');
                                }

                                if (! $record->sections || $record->sections->isEmpty()) {
                                    return new HtmlString('<p class="text-sm text-gray-500">No content sections available.</p>');
                                }

                                $html = '';

                                foreach ($record->sections as $section) {
                                    $sectionTitle = $section->structureSection->title ?? 'Untitled Section';
                                    $isComplete = $section->is_complete ? '✓' : '○';
                                    $completeClass = $section->is_complete ? 'text-green-600' : 'text-gray-400';

                                    $html .= '<div class="mb-6 border-l-4 border-blue-500 pl-4 bg-white rounded-r-lg p-4">';
                                    $html .= '<h3 class="text-lg font-semibold mb-3 flex items-center gap-2">';
                                    $html .= '<span class="'.$completeClass.'">'.$isComplete.'</span>';
                                    $html .= htmlspecialchars($sectionTitle);
                                    $html .= '</h3>';

                                    if ($section->items && $section->items->isNotEmpty()) {
                                        foreach ($section->items as $item) {
                                            $label = $item->structureSectionItem->label ?? 'Untitled Item';
                                            $content = $item->content ?? '<em class="text-gray-400">No content</em>';

                                            $html .= '<div class="mb-4">';
                                            $html .= '<div class="text-sm font-semibold text-gray-700 mb-2">'.htmlspecialchars($label).'</div>';
                                            $html .= '<div class="prose prose-sm max-w-none bg-gray-50 rounded-lg p-3 border border-gray-200">'.$content.'</div>';

                                            if ($item->last_edited_at) {
                                                $html .= '<div class="text-xs text-gray-500 mt-1">';
                                                $html .= 'Last edited '.$item->last_edited_at->diffForHumans();
                                                if ($item->lastEditor) {
                                                    $html .= ' by '.htmlspecialchars($item->lastEditor->name);
                                                }
                                                $html .= '</div>';
                                            }

                                            $html .= '</div>';
                                        }
                                    } else {
                                        $html .= '<p class="text-sm text-gray-500 italic">No items in this section.</p>';
                                    }

                                    $html .= '</div>';
                                }

                                return new HtmlString($html);
                            })
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
            ]);
    }

    public function mount(int|string $record): void
    {
        parent::mount($record);

        // Eager load all relationships for better performance
        $this->record->load([
            'category',
            'structure',
            'owner',
            'sections.structureSection',
            'sections.items.structureSectionItem',
            'sections.items.lastEditor',
        ]);
    }
}
