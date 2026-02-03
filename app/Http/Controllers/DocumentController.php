<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Document::query()
            ->with(['category', 'owner'])
            ->where('status', 'published');

        // Search
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($categorySlug = $request->get('category')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Filter by tag
        if ($tagSlug = $request->get('tag')) {
            $query->whereHas('tags', function ($q) use ($tagSlug) {
                $q->where('slug', $tagSlug);
            });
        }

        // Filter by status
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'oldest' => $query->oldest('created_at'),
            'title' => $query->orderBy('title'),
            'popular' => $query->orderBy('view_count', 'desc'),
            'score' => $query->orderBy('total_score', 'desc'),
            default => $query->latest('updated_at'),
        };

        // Paginate
        $documents = $query->paginate(12)->withQueryString();

        // Format documents
        $documentsData = $documents->getCollection()->map(fn ($doc) => [
            'id' => $doc->id,
            'title' => $doc->title,
            'slug' => $doc->slug,
            'description' => $doc->description,
            'thumbnail' => $doc->image,
            'status' => $doc->status,
            'score' => $doc->total_score,
            'views_count' => $doc->view_count ?? 0,
            'comments_count' => $doc->comment_count ?? 0,
            'updated_at' => $doc->updated_at->toISOString(),
            'category' => $doc->category ? [
                'name' => $doc->category->name,
                'slug' => $doc->category->slug,
                'color' => $doc->category->color,
            ] : null,
            'owner' => $doc->owner ? [
                'id' => $doc->owner->id,
                'name' => $doc->owner->name,
                'avatar' => $doc->owner->avatar,
            ] : null,
        ]);

        // Get categories and tags for filters
        $categories = Category::query()
            ->withCount('documents')
            ->orderBy('name')
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'icon' => $cat->icon,
                'color' => $cat->color,
            ]);

        $tags = Tag::query()
            ->withCount('documents')
            ->orderBy('documents_count', 'desc')
            ->take(20)
            ->get()
            ->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ]);

        return Inertia::render('documents/index', [
            'documents' => [
                'data' => $documentsData,
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ],
            'categories' => $categories,
            'tags' => $tags,
            'filters' => [
                'search' => $request->get('search'),
                'category' => $request->get('category'),
                'tag' => $request->get('tag'),
                'status' => $request->get('status'),
                'sort' => $request->get('sort', 'latest'),
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $document = Document::query()
            ->with(['category', 'owner', 'tags', 'branches', 'sections.items'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $document->increment('view_count');

        // Get document sections with items (for inline comments)
        $sections = $document->sections->map(fn ($section) => [
            'id' => $section->id,
            'title' => $section->structureSection->title ?? 'Section',
            'order' => $section->position,
            'items' => $section->items->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->structureSectionItem->title ?? 'Item',
                'content' => $item->content,
                'order' => $item->order,
            ])->toArray(),
        ])->toArray();

        // Get comments (threaded)
        $comments = $document->comments()
            ->whereNull('parent_id')
            ->whereNull('section_item_id')
            ->with(['user', 'replies.user', 'mentions'])
            ->latest()
            ->get()
            ->map(fn ($comment) => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->toISOString(),
                'updated_at' => $comment->updated_at->toISOString(),
                'is_resolved' => $comment->is_resolved,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->avatar,
                ],
                'replies' => $comment->replies->map(fn ($reply) => [
                    'id' => $reply->id,
                    'content' => $reply->content,
                    'created_at' => $reply->created_at->toISOString(),
                    'user' => [
                        'id' => $reply->user->id,
                        'name' => $reply->user->name,
                        'avatar' => $reply->user->avatar,
                    ],
                ])->toArray(),
                'mentions' => $comment->mentions->pluck('name')->toArray(),
            ])->toArray();

        // Get inline comments grouped by section item
        $inlineComments = $document->comments()
            ->whereNotNull('section_item_id')
            ->with(['user', 'replies.user', 'sectionItem'])
            ->latest()
            ->get()
            ->groupBy('section_item_id')
            ->map(fn ($comments) => $comments->map(fn ($comment) => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->toISOString(),
                'is_resolved' => $comment->is_resolved,
                'resolved_at' => $comment->resolved_at?->toISOString(),
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->avatar,
                ],
                'replies' => $comment->replies->map(fn ($reply) => [
                    'id' => $reply->id,
                    'content' => $reply->content,
                    'created_at' => $reply->created_at->toISOString(),
                    'user' => [
                        'id' => $reply->user->id,
                        'name' => $reply->user->name,
                        'avatar' => $reply->user->avatar,
                    ],
                ])->toArray(),
            ])->toArray())
            ->toArray();

        // Get related documents (same category, limit 5)
        $relatedDocuments = Document::query()
            ->where('category_id', $document->category_id)
            ->where('id', '!=', $document->id)
            ->where('status', 'published')
            ->limit(5)
            ->get()
            ->map(fn ($doc) => [
                'id' => $doc->id,
                'title' => $doc->title,
                'slug' => $doc->slug,
                'category' => $doc->category ? [
                    'name' => $doc->category->name,
                ] : null,
            ]);

        // Generate simple HTML content (placeholder - will be dynamic later)
        $content = $this->generateDocumentContent($document);

        return Inertia::render('documents/show', [
            'document' => [
                'id' => $document->id,
                'title' => $document->title,
                'slug' => $document->slug,
                'description' => $document->description,
                'content' => $content,
                'status' => $document->status,
                'score' => $document->total_score,
                'views_count' => $document->view_count,
                'comments_count' => $document->comment_count,
                'created_at' => $document->created_at->toISOString(),
                'updated_at' => $document->updated_at->toISOString(),
                'published_at' => $document->published_at?->toISOString(),
                'category' => $document->category ? [
                    'id' => $document->category->id,
                    'name' => $document->category->name,
                    'slug' => $document->category->slug,
                    'icon' => $document->category->icon,
                    'color' => $document->category->color,
                ] : null,
                'owner' => [
                    'id' => $document->owner->id,
                    'name' => $document->owner->name,
                    'avatar' => $document->owner->avatar,
                ],
                'tags' => $document->tags->map(fn ($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ])->toArray(),
                'branches' => $document->branches->map(fn ($branch) => [
                    'id' => $branch->id,
                    'name' => $branch->branch_name,
                    'repository' => $branch->repository_url,
                ])->toArray(),
            ],
            'sections' => $sections,
            'comments' => $comments,
            'inlineComments' => $inlineComments,
            'relatedDocuments' => $relatedDocuments,
        ]);
    }

    /**
     * Delete a document (soft delete).
     */
    public function destroy(string $slug)
    {
        $document = Document::where('slug', $slug)->firstOrFail();

        // Check authorization - only owner can delete
        if ($document->owner_id !== auth()->id()) {
            abort(403, 'You are not authorized to delete this document.');
        }

        // Soft delete the document
        $document->delete();

        return redirect()->route('documents.index')
            ->with('success', 'Document deleted successfully.');
    }

    private function generateDocumentContent(Document $document): string
    {
        // Simple placeholder content generation
        // In production, this would render the actual document sections
        $html = '<div class="space-y-6">';

        $html .= '<section>';
        $html .= '<h2 class="text-2xl font-bold mb-4">Overview</h2>';
        $html .= '<p class="text-base leading-relaxed">'.($document->description ?? 'This document provides comprehensive information about '.$document->title.'.').'</p>';
        $html .= '</section>';

        $html .= '<section>';
        $html .= '<h2 class="text-2xl font-bold mb-4">Introduction</h2>';
        $html .= '<p class="text-base leading-relaxed">Welcome to the '.$document->title.' documentation. This guide will help you understand the key concepts and implementation details.</p>';
        $html .= '</section>';

        $html .= '<section>';
        $html .= '<h2 class="text-2xl font-bold mb-4">Key Features</h2>';
        $html .= '<ul class="list-disc list-inside space-y-2">';
        $html .= '<li>Comprehensive coverage of all topics</li>';
        $html .= '<li>Step-by-step instructions</li>';
        $html .= '<li>Best practices and examples</li>';
        $html .= '<li>Troubleshooting guide</li>';
        $html .= '</ul>';
        $html .= '</section>';

        $html .= '<section>';
        $html .= '<h2 class="text-2xl font-bold mb-4">Getting Started</h2>';
        $html .= '<p class="text-base leading-relaxed mb-4">Follow these steps to get started:</p>';
        $html .= '<ol class="list-decimal list-inside space-y-2">';
        $html .= '<li>Review the prerequisites</li>';
        $html .= '<li>Install required dependencies</li>';
        $html .= '<li>Configure your environment</li>';
        $html .= '<li>Run the setup process</li>';
        $html .= '</ol>';
        $html .= '</section>';

        $html .= '<section>';
        $html .= '<h2 class="text-2xl font-bold mb-4">Example Usage</h2>';
        $html .= '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>';
        $html .= '// Example code snippet\n';
        $html .= 'const example = () => {\n';
        $html .= '  console.log("Hello, World!");\n';
        $html .= '};\n';
        $html .= '</code></pre>';
        $html .= '</section>';

        $html .= '</div>';

        return $html;
    }
}
