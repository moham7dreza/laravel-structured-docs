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
                        TextInput::make('tags_display')
                            ->label('Tags')
                            ->disabled()
                            ->formatStateUsing(function ($record) {
                                if (! $record->tags || $record->tags->isEmpty()) {
                                    return 'No tags';
                                }

                                return $record->tags->pluck('name')->join(', ');
                            })
                            ->columnSpanFull(),
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

                Section::make('Branch & Integration')
                    ->description('Git branches and Jira tasks linked to this document')
                    ->schema([
                        Placeholder::make('branches_info')
                            ->label('')
                            ->content(function ($record) {
                                if (! $record->branches || $record->branches->isEmpty()) {
                                    return new HtmlString('<p class="text-sm text-gray-500">No branches linked to this document.</p>');
                                }

                                $html = '';

                                foreach ($record->branches as $branch) {
                                    $isMerged = $branch->merged_at ? true : false;
                                    $statusBadge = $isMerged
                                        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Merged</span>'
                                        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Active</span>';

                                    $html .= '<div class="mb-4 border border-gray-200 rounded-lg p-4 bg-white">';

                                    // Header with task ID and status
                                    $html .= '<div class="flex items-center justify-between mb-3">';
                                    $html .= '<h4 class="text-base font-semibold text-gray-900">';
                                    $html .= '<span class="text-blue-600">'.htmlspecialchars($branch->task_id).'</span>';
                                    $html .= '</h4>';
                                    $html .= $statusBadge;
                                    $html .= '</div>';

                                    // Task title
                                    if ($branch->task_title) {
                                        $html .= '<div class="mb-3">';
                                        $html .= '<div class="text-xs font-medium text-gray-500 mb-1">Task Title</div>';
                                        $html .= '<div class="text-sm text-gray-900">'.htmlspecialchars($branch->task_title).'</div>';
                                        $html .= '</div>';
                                    }

                                    // Branch name
                                    $html .= '<div class="mb-3">';
                                    $html .= '<div class="text-xs font-medium text-gray-500 mb-1">Branch Name</div>';
                                    $html .= '<div class="text-sm font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">';
                                    $html .= htmlspecialchars($branch->branch_name);
                                    $html .= '</div>';
                                    $html .= '</div>';

                                    // Repository URL
                                    if ($branch->repository_url) {
                                        $html .= '<div class="mb-3">';
                                        $html .= '<div class="text-xs font-medium text-gray-500 mb-1">Repository</div>';
                                        $html .= '<div class="text-sm">';
                                        $html .= '<a href="'.htmlspecialchars($branch->repository_url).'" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline">';
                                        $html .= htmlspecialchars($branch->repository_url);
                                        $html .= ' <svg class="inline w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
                                        $html .= '</a>';
                                        $html .= '</div>';
                                        $html .= '</div>';
                                    }

                                    // Merged date
                                    if ($branch->merged_at) {
                                        $html .= '<div class="mb-3">';
                                        $html .= '<div class="text-xs font-medium text-gray-500 mb-1">Merged At</div>';
                                        $html .= '<div class="text-sm text-gray-700">';
                                        $html .= $branch->merged_at->format('M d, Y g:i A');
                                        $html .= ' <span class="text-gray-500">('.$branch->merged_at->diffForHumans().')</span>';
                                        $html .= '</div>';
                                        $html .= '</div>';
                                    }

                                    // Created date
                                    $html .= '<div class="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">';
                                    $html .= 'Added '.$branch->created_at->diffForHumans();
                                    $html .= '</div>';

                                    $html .= '</div>';
                                }

                                return new HtmlString($html);
                            })
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->visible(fn ($record) => $record->branches && $record->branches->isNotEmpty()),

                Section::make('Permissions')
                    ->description('Document editors and reviewers')
                    ->schema([
                        Placeholder::make('editors_info')
                            ->label('Document Editors')
                            ->content(function ($record) {
                                if (! $record->editors || $record->editors->isEmpty()) {
                                    return new HtmlString('<p class="text-sm text-gray-500">No editors assigned.</p>');
                                }

                                $html = '<div class="space-y-3">';

                                foreach ($record->editors as $editor) {
                                    $accessBadge = $editor->access_type === 'full'
                                        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Full Access</span>'
                                        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Limited Access</span>';

                                    $html .= '<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">';
                                    $html .= '<div class="flex-1">';
                                    $html .= '<div class="font-medium text-gray-900">'.htmlspecialchars($editor->user->name).'</div>';

                                    if ($editor->access_type === 'limited' && $editor->sections && $editor->sections->isNotEmpty()) {
                                        $html .= '<div class="text-xs text-gray-600 mt-1">';
                                        $html .= 'Sections: '.htmlspecialchars($editor->sections->pluck('title')->join(', '));
                                        $html .= '</div>';
                                    }

                                    if ($editor->can_manage_editors) {
                                        $html .= '<div class="text-xs text-green-600 mt-1">✓ Can manage editors</div>';
                                    }

                                    $html .= '</div>';
                                    $html .= '<div class="ml-3">'.$accessBadge.'</div>';
                                    $html .= '</div>';
                                }

                                $html .= '</div>';

                                return new HtmlString($html);
                            })
                            ->columnSpanFull(),

                        Placeholder::make('reviewers_info')
                            ->label('Document Reviewers')
                            ->content(function ($record) {
                                if (! $record->reviewers || $record->reviewers->isEmpty()) {
                                    return new HtmlString('<p class="text-sm text-gray-500">No reviewers assigned.</p>');
                                }

                                $html = '<div class="space-y-3 mt-4">';

                                foreach ($record->reviewers as $reviewer) {
                                    $statusColor = match ($reviewer->status) {
                                        'approved' => 'green',
                                        'rejected' => 'red',
                                        'in_progress' => 'yellow',
                                        default => 'gray',
                                    };

                                    $statusBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-'.$statusColor.'-100 text-'.$statusColor.'-800">'.ucfirst(str_replace('_', ' ', $reviewer->status)).'</span>';

                                    $html .= '<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">';
                                    $html .= '<div class="flex-1">';
                                    $html .= '<div class="font-medium text-gray-900">'.htmlspecialchars($reviewer->user->name).'</div>';

                                    if ($reviewer->responded_at) {
                                        $html .= '<div class="text-xs text-gray-600 mt-1">';
                                        $html .= 'Responded: '.$reviewer->responded_at->diffForHumans();
                                        $html .= '</div>';
                                    } elseif ($reviewer->notified_at) {
                                        $html .= '<div class="text-xs text-gray-600 mt-1">';
                                        $html .= 'Notified: '.$reviewer->notified_at->diffForHumans();
                                        $html .= '</div>';
                                    }

                                    $html .= '</div>';
                                    $html .= '<div class="ml-3">'.$statusBadge.'</div>';
                                    $html .= '</div>';
                                }

                                $html .= '</div>';

                                return new HtmlString($html);
                            })
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->visible(fn ($record) => ($record->editors && $record->editors->isNotEmpty()) || ($record->reviewers && $record->reviewers->isNotEmpty())),

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
            'tags',
            'branches',
            'editors.user',
            'editors.sections',
            'reviewers.user',
            'sections.structureSection',
            'sections.items.structureSectionItem',
            'sections.items.lastEditor',
        ]);
    }
}
