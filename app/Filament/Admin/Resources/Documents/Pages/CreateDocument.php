<?php

namespace App\Filament\Admin\Resources\Documents\Pages;

use App\Filament\Admin\Resources\Documents\DocumentResource;
use App\Models\DocumentSection;
use App\Models\DocumentSectionItem;
use Filament\Resources\Pages\CreateRecord;

class CreateDocument extends CreateRecord
{
    protected static string $resource = DocumentResource::class;

    protected array $contentData = [];

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Store content data temporarily, we'll process it after document creation
        $this->contentData = $data['content_data'] ?? [];

        // Remove content_data from document data as it's not a database column
        unset($data['content_data']);

        // Set default values if not provided
        $data['view_count'] = $data['view_count'] ?? 0;
        $data['comment_count'] = $data['comment_count'] ?? 0;
        $data['reaction_count'] = $data['reaction_count'] ?? 0;
        $data['total_score'] = $data['total_score'] ?? 0;
        $data['completeness_percentage'] = $data['completeness_percentage'] ?? 0.0;

        return $data;
    }

    protected function afterCreate(): void
    {
        // Initialize document sections and items if structure is selected
        if ($this->record->structure_id) {
            $this->initializeDocumentSections();
        }
    }

    protected function initializeDocumentSections(): void
    {
        $document = $this->record;

        // Get all structure sections with their items
        $structureSections = $document->structure->sections()->with('items')->orderBy('position')->get();

        foreach ($structureSections as $structureSection) {
            // Create document section
            $documentSection = DocumentSection::create([
                'document_id' => $document->id,
                'structure_section_id' => $structureSection->id,
                'instance_number' => 1,
                'is_complete' => false,
                'position' => $structureSection->position,
            ]);

            // Create document section items for each structure section item
            foreach ($structureSection->items()->orderBy('position')->get() as $structureSectionItem) {
                // Get content from the form data if it exists
                $contentKey = "section_{$structureSection->id}_item_{$structureSectionItem->id}";
                $content = $this->contentData[$contentKey] ?? $structureSectionItem->default_value;

                DocumentSectionItem::create([
                    'document_section_id' => $documentSection->id,
                    'structure_section_item_id' => $structureSectionItem->id,
                    'content' => $content,
                    'is_valid' => true,
                    'last_edited_by' => auth()->id(),
                    'last_edited_at' => now(),
                ]);
            }
        }

        // Reload the record with relationships
        $this->record->load([
            'sections.structureSection',
            'sections.items.structureSectionItem',
        ]);
    }
}
