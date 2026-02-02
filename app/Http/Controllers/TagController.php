<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    /**
     * Display all tags.
     */
    public function index(): Response
    {
        $tags = Tag::query()
            ->withCount(['documents' => function ($query) {
                $query->where('status', 'published');
            }])
            ->orderBy('documents_count', 'desc')
            ->get()
            ->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'documents_count' => $tag->documents_count,
            ])
            ->values()
            ->toArray();

        return Inertia::render('tags/index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Display a specific tag with its documents.
     */
    public function show(Request $request, string $slug): Response
    {
        $tag = Tag::query()
            ->where('slug', $slug)
            ->firstOrFail();

        $query = Document::query()
            ->with(['category', 'owner', 'tags'])
            ->whereHas('tags', function ($q) use ($tag) {
                $q->where('tags.id', $tag->id);
            })
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

        // Sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'oldest' => $query->oldest(),
            'title' => $query->orderBy('title'),
            'popular' => $query->orderBy('views_count', 'desc'),
            default => $query->latest(),
        };

        $documents = $query->paginate(12);

        $documentsData = $documents->map(function ($doc) {
            return [
                'id' => $doc->id,
                'title' => $doc->title,
                'slug' => $doc->slug,
                'description' => $doc->description,
                'status' => $doc->status,
                'thumbnail' => $doc->thumbnail,
                'views_count' => $doc->views_count,
                'created_at' => $doc->created_at?->toISOString(),
                'updated_at' => $doc->updated_at?->toISOString(),
                'category' => $doc->category ? [
                    'id' => $doc->category->id,
                    'name' => $doc->category->name,
                    'slug' => $doc->category->slug,
                    'icon' => $doc->category->icon,
                    'color' => $doc->category->color,
                ] : null,
                'owner' => [
                    'id' => $doc->owner->id,
                    'name' => $doc->owner->name,
                    'avatar' => $doc->owner->avatar,
                ],
                'tags' => $doc->tags->map(fn ($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ])->values()->toArray(),
            ];
        })->values()->toArray();

        // Get categories for this tag
        $categories = Category::query()
            ->where('is_active', true)
            ->whereHas('documents.tags', function ($q) use ($tag) {
                $q->where('tags.id', $tag->id);
            })
            ->withCount(['documents' => function ($q) use ($tag) {
                $q->whereHas('tags', function ($q) use ($tag) {
                    $q->where('tags.id', $tag->id);
                })
                    ->where('status', 'published');
            }])
            ->orderBy('name')
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'icon' => $cat->icon,
                'color' => $cat->color,
                'documents_count' => $cat->documents_count,
            ])
            ->values()
            ->toArray();

        return Inertia::render('tags/show', [
            'tag' => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ],
            'documents' => [
                'data' => $documentsData,
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ],
            'categories' => $categories,
            'filters' => [
                'search' => $request->get('search'),
                'category' => $request->get('category'),
                'sort' => $request->get('sort', 'latest'),
            ],
        ]);
    }
}
