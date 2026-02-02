<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display all categories.
     */
    public function index(): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['documents' => function ($query) {
                $query->where('status', 'published');
            }])
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'color' => $category->color,
                'documents_count' => $category->documents_count,
            ])
            ->values()
            ->toArray();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display a specific category with its documents.
     */
    public function show(Request $request, string $slug): Response
    {
        $category = Category::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $query = Document::query()
            ->with(['category', 'owner', 'tags'])
            ->where('category_id', $category->id)
            ->where('status', 'published');

        // Search
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by tag
        if ($tagSlug = $request->get('tag')) {
            $query->whereHas('tags', function ($q) use ($tagSlug) {
                $q->where('slug', $tagSlug);
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

        // Get popular tags for this category
        $tags = \App\Models\Tag::query()
            ->whereHas('documents', function ($q) use ($category) {
                $q->where('category_id', $category->id)
                    ->where('status', 'published');
            })
            ->withCount(['documents' => function ($q) use ($category) {
                $q->where('category_id', $category->id)
                    ->where('status', 'published');
            }])
            ->orderBy('documents_count', 'desc')
            ->take(20)
            ->get()
            ->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'documents_count' => $tag->documents_count,
            ])
            ->values()
            ->toArray();

        return Inertia::render('categories/show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'icon' => $category->icon,
                'color' => $category->color,
            ],
            'documents' => [
                'data' => $documentsData,
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ],
            'tags' => $tags,
            'filters' => [
                'search' => $request->get('search'),
                'tag' => $request->get('tag'),
                'sort' => $request->get('sort', 'latest'),
            ],
        ]);
    }
}
