<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentEditController extends Controller
{
    /**
     * Show the document edit form.
     */
    public function edit(string $slug)
    {
        $document = Document::with([
            'category',
            'structure.sections.items',
            'tags',
            'branches',
            'editors.user',
            'editors.sections',
            'reviewers.user',
            'references',
            'links',
            'watchers',
            'sections.items.structureSectionItem',
        ])
            ->where('slug', $slug)
            ->firstOrFail();

        // Check authorization
        if ($document->owner_id !== auth()->id()) {
            abort(403, 'You are not authorized to edit this document.');
        }

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

        // Format content data from sections
        $contentData = [];
        foreach ($document->sections as $section) {
            foreach ($section->items as $item) {
                $key = "section_{$section->structure_section_id}_item_{$item->structure_section_item_id}";
                $contentData[$key] = $item->content;
            }
        }

        // Format branches
        $branches = $document->branches->map(fn ($branch) => [
            'task_id' => $branch->task_id,
            'task_title' => $branch->task_title,
            'branch_name' => $branch->branch_name,
            'repository_url' => $branch->repository_url,
            'merged_at' => $branch->merged_at?->format('Y-m-d'),
        ])->toArray();

        // Format editors
        $editors = $document->editors->map(fn ($editor) => [
            'user_id' => $editor->user_id,
            'access_type' => $editor->access_type,
            'can_manage_editors' => $editor->can_manage_editors,
            'sections' => $editor->sections->pluck('id')->toArray(),
        ])->toArray();

        // Format reviewers
        $reviewers = $document->reviewers->map(fn ($reviewer) => [
            'user_id' => $reviewer->user_id,
            'status' => $reviewer->status,
        ])->toArray();

        // Format references (pivot table relationship)
        $references = $document->references->map(fn ($ref) => [
            'target_document_id' => $ref->id,
            'context' => $ref->pivot->context ?? '',
        ])->toArray();

        // Format links
        $links = $document->links->map(fn ($link) => [
            'title' => $link->title,
            'url' => $link->url,
            'description' => $link->description,
        ])->toArray();

        return Inertia::render('documents/edit', [
            'document' => [
                'id' => $document->id,
                'title' => $document->title,
                'slug' => $document->slug,
                'description' => $document->description,
                'image' => $document->image,
                'category_id' => $document->category_id,
                'structure_id' => $document->structure_id,
                'tags' => $document->tags->pluck('id')->toArray(),
                'visibility' => $document->visibility,
                'status' => $document->status,
                'approval_status' => $document->approval_status,
                'watchers' => $document->watchers->pluck('id')->toArray(),
                'content_data' => $contentData,
                'branches' => $branches,
                'editors' => $editors,
                'reviewers' => $reviewers,
                'references' => $references,
                'links' => $links,
            ],
            'categories' => $categories,
            'tags' => $tags,
            'users' => $users,
        ]);
    }

    /**
     * Update the document.
     */
    public function update(Request $request, string $slug)
    {
        $document = Document::where('slug', $slug)->firstOrFail();

        // Check authorization
        if ($document->owner_id !== auth()->id()) {
            abort(403, 'You are not authorized to edit this document.');
        }

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

        // Update the document
        $document->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'category_id' => $validated['category_id'],
            'structure_id' => $validated['structure_id'],
            'visibility' => $validated['visibility'] ?? 'private',
            'status' => $validated['status'] ?? 'draft',
            'approval_status' => $validated['approval_status'] ?? 'not_submitted',
        ]);

        // Sync tags
        $document->tags()->sync($validated['tags'] ?? []);

        // Update branches - delete old and create new
        $document->branches()->delete();
        if (isset($validated['branches'])) {
            foreach ($validated['branches'] as $branchData) {
                $document->branches()->create($branchData);
            }
        }

        // Update editors - delete old and create new
        $document->editors()->delete();
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

        // Update reviewers - delete old and create new
        $document->reviewers()->delete();
        if (isset($validated['reviewers'])) {
            foreach ($validated['reviewers'] as $reviewerData) {
                $document->reviewers()->create([
                    'user_id' => $reviewerData['user_id'],
                    'status' => $reviewerData['status'] ?? 'pending',
                    'notified_at' => now(),
                ]);
            }
        }

        // Update references - detach old and attach new
        $document->references()->detach();
        if (isset($validated['references'])) {
            foreach ($validated['references'] as $refData) {
                $document->references()->attach($refData['target_document_id'], [
                    'context' => $refData['context'] ?? null,
                ]);
            }
        }

        // Update links - delete old and create new
        $document->links()->delete();
        if (isset($validated['links'])) {
            foreach ($validated['links'] as $linkData) {
                $document->links()->create($linkData);
            }
        }

        // Sync watchers
        $document->watchers()->sync($validated['watchers'] ?? []);

        // Update content in existing sections
        if (isset($validated['content_data'])) {
            foreach ($document->sections as $section) {
                foreach ($section->items as $item) {
                    $contentKey = "section_{$section->structure_section_id}_item_{$item->structure_section_item_id}";
                    if (isset($validated['content_data'][$contentKey])) {
                        $item->update([
                            'content' => $validated['content_data'][$contentKey],
                            'last_edited_by' => auth()->id(),
                            'last_edited_at' => now(),
                        ]);
                    }
                }
            }
        }

        return redirect()->route('documents.show', $document->slug)
            ->with('success', 'Document updated successfully!');
    }
}
