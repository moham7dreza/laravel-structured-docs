<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\DocumentSection;
use App\Models\DocumentSectionItem;
use App\Models\Structure;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentCreateController extends Controller
{
    /**
     * Show the document creation form.
     */
    public function create()
    {
        $categories = Category::select('id', 'name', 'slug', 'icon', 'color')
            ->withCount('documents')
            ->orderBy('name')
            ->get();

        $tags = Tag::select('id', 'name', 'slug')
            ->withCount('documents')
            ->orderBy('name')
            ->get();

        $users = User::select('id', 'name', 'email', 'avatar')
            ->orderBy('name')
            ->get();

        return Inertia::render('documents/create', [
            'categories' => $categories,
            'tags' => $tags,
            'users' => $users,
        ]);
    }

    /**
     * Get structures for a specific category.
     */
    public function getStructures(Request $request)
    {
        $categoryId = $request->get('category_id');

        $structures = Structure::where('category_id', $categoryId)
            ->where('is_active', true)
            ->with(['sections' => function ($query) {
                $query->orderBy('position');
            }, 'sections.items' => function ($query) {
                $query->orderBy('position');
            }])
            ->orderBy('is_default', 'desc')
            ->orderBy('title')
            ->get()
            ->map(function ($structure) {
                return [
                    'id' => $structure->id,
                    'title' => $structure->title,
                    'description' => $structure->description,
                    'version' => $structure->version,
                    'is_default' => $structure->is_default,
                    'sections' => $structure->sections->map(function ($section) {
                        return [
                            'id' => $section->id,
                            'title' => $section->title,
                            'description' => $section->description,
                            'position' => $section->position,
                            'items' => $section->items->map(function ($item) {
                                return [
                                    'id' => $item->id,
                                    'type' => $item->type,
                                    'label' => $item->label,
                                    'description' => $item->description,
                                    'placeholder' => $item->placeholder,
                                    'is_required' => $item->is_required,
                                    'default_value' => $item->default_value,
                                    'position' => $item->position,
                                ];
                            }),
                        ];
                    }),
                ];
            });

        return response()->json($structures);
    }

    /**
     * Store a new document.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Basic Information
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|url|max:500',

            // Structure & Category
            'category_id' => 'required|exists:categories,id',
            'structure_id' => 'required|exists:structures,id',

            // Tags
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',

            // Branch Information
            'branches' => 'nullable|array',
            'branches.*.task_id' => 'required|string|max:100',
            'branches.*.task_title' => 'nullable|string|max:500',
            'branches.*.branch_name' => 'required|string|max:255',
            'branches.*.repository_url' => 'nullable|url|max:500',
            'branches.*.merged_at' => 'nullable|date',

            // Editors
            'editors' => 'nullable|array',
            'editors.*.user_id' => 'required|exists:users,id',
            'editors.*.access_type' => 'required|in:full,limited',
            'editors.*.can_manage_editors' => 'nullable|boolean',
            'editors.*.sections' => 'nullable|array',

            // Reviewers
            'reviewers' => 'nullable|array',
            'reviewers.*.user_id' => 'required|exists:users,id',
            'reviewers.*.status' => 'required|in:pending,in_progress,approved,rejected',

            // References
            'references' => 'nullable|array',
            'references.*.target_document_id' => 'required|exists:documents,id',
            'references.*.context' => 'nullable|string',

            // Links
            'links' => 'nullable|array',
            'links.*.title' => 'required|string|max:255',
            'links.*.url' => 'required|url|max:500',
            'links.*.description' => 'nullable|string',

            // Watchers
            'watchers' => 'nullable|array',
            'watchers.*' => 'exists:users,id',

            // Settings
            'visibility' => 'nullable|in:public,private,team',
            'status' => 'nullable|in:draft,pending_review,published,completed,stale,archived',
            'approval_status' => 'nullable|in:not_submitted,pending,approved,rejected',

            // Content Data
            'content_data' => 'nullable|array',
        ]);

        // Create the document
        $document = Document::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'category_id' => $validated['category_id'],
            'structure_id' => $validated['structure_id'],
            'owner_id' => auth()->id(),
            'visibility' => $validated['visibility'] ?? 'private',
            'status' => $validated['status'] ?? 'draft',
            'approval_status' => $validated['approval_status'] ?? 'not_submitted',
            'view_count' => 0,
            'comment_count' => 0,
            'reaction_count' => 0,
            'total_score' => 0,
            'completeness_percentage' => 0.0,
        ]);

        // Attach tags
        if (isset($validated['tags'])) {
            $document->tags()->attach($validated['tags']);
        }

        // Create branches
        if (isset($validated['branches'])) {
            foreach ($validated['branches'] as $branchData) {
                $document->branches()->create($branchData);
            }
        }

        // Create editors
        if (isset($validated['editors'])) {
            foreach ($validated['editors'] as $editorData) {
                $editor = $document->editors()->create([
                    'user_id' => $editorData['user_id'],
                    'access_type' => $editorData['access_type'] ?? 'full',
                    'can_manage_editors' => $editorData['can_manage_editors'] ?? false,
                ]);

                // Attach sections if limited access
                if (($editorData['access_type'] ?? 'full') === 'limited' && isset($editorData['sections'])) {
                    $editor->sections()->attach($editorData['sections']);
                }
            }
        }

        // Create reviewers
        if (isset($validated['reviewers'])) {
            foreach ($validated['reviewers'] as $reviewerData) {
                $document->reviewers()->create([
                    'user_id' => $reviewerData['user_id'],
                    'status' => $reviewerData['status'] ?? 'pending',
                    'notified_at' => now(),
                ]);
            }
        }

        // Create references
        if (isset($validated['references'])) {
            foreach ($validated['references'] as $refData) {
                $document->references()->create([
                    'target_document_id' => $refData['target_document_id'],
                    'context' => $refData['context'] ?? null,
                ]);
            }
        }

        // Create links
        if (isset($validated['links'])) {
            foreach ($validated['links'] as $linkData) {
                $document->links()->create($linkData);
            }
        }

        // Attach watchers
        if (isset($validated['watchers'])) {
            $document->watchers()->attach($validated['watchers']);
        }

        // Initialize document sections and items
        $this->initializeDocumentSections($document, $validated['content_data'] ?? []);

        return redirect()->route('documents.show', $document->slug)
            ->with('success', 'Document created successfully!');
    }

    /**
     * Initialize document sections and items from structure.
     */
    protected function initializeDocumentSections(Document $document, array $contentData): void
    {
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
                $content = $contentData[$contentKey] ?? $structureSectionItem->default_value;

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
    }
}
