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
        // TODO: Implement show method
        return Inertia::render('documents/show');
    }
}
