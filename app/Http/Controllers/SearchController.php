<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    /**
     * Display the global search page.
     */
    public function index(Request $request): Response
    {
        $query = $request->input('q', '');
        $type = $request->input('type', 'all'); // all, documents, users, categories, tags
        $category = $request->input('category');
        $tag = $request->input('tag');
        $status = $request->input('status');
        $sortBy = $request->input('sort', 'relevance'); // relevance, latest, popular, score

        $results = [];
        $stats = [
            'total' => 0,
            'documents' => 0,
            'users' => 0,
            'categories' => 0,
            'tags' => 0,
        ];

        if (! empty($query)) {
            // Search Documents
            if (in_array($type, ['all', 'documents'])) {
                $documentsQuery = Document::query()
                    ->with(['category', 'owner', 'tags'])
                    ->where('status', 'published')
                    ->where(function ($q) use ($query) {
                        $q->where('title', 'like', "%{$query}%")
                            ->orWhere('description', 'like', "%{$query}%")
                            ->orWhere('content', 'like', "%{$query}%");
                    });

                // Apply filters
                if ($category) {
                    $documentsQuery->whereHas('category', function ($q) use ($category) {
                        $q->where('slug', $category);
                    });
                }

                if ($tag) {
                    $documentsQuery->whereHas('tags', function ($q) use ($tag) {
                        $q->where('slug', $tag);
                    });
                }

                if ($status) {
                    $documentsQuery->where('status', $status);
                }

                // Apply sorting
                switch ($sortBy) {
                    case 'latest':
                        $documentsQuery->latest('published_at');
                        break;
                    case 'popular':
                        $documentsQuery->orderBy('view_count', 'desc');
                        break;
                    case 'score':
                        $documentsQuery->orderBy('total_score', 'desc');
                        break;
                    default: // relevance
                        $documentsQuery->orderByRaw('
                            CASE
                                WHEN title LIKE ? THEN 1
                                WHEN description LIKE ? THEN 2
                                ELSE 3
                            END
                        ', ["%{$query}%", "%{$query}%"]);
                }

                $documents = $documentsQuery
                    ->limit($type === 'all' ? 10 : 20)
                    ->get()
                    ->map(fn ($doc) => [
                        'type' => 'document',
                        'id' => $doc->id,
                        'title' => $doc->title,
                        'slug' => $doc->slug,
                        'description' => $doc->description,
                        'thumbnail' => $doc->image,
                        'status' => $doc->status,
                        'score' => $doc->total_score,
                        'views_count' => $doc->view_count ?? 0,
                        'comments_count' => $doc->comment_count ?? 0,
                        'created_at' => $doc->created_at->toISOString(),
                        'updated_at' => $doc->updated_at->toISOString(),
                        'published_at' => $doc->published_at?->toISOString(),
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
                        ])->toArray(),
                    ]);

                $results = array_merge($results, $documents->toArray());
                $stats['documents'] = $documents->count();
            }

            // Search Users
            if (in_array($type, ['all', 'users'])) {
                $usersQuery = User::query()
                    ->where(function ($q) use ($query) {
                        $q->where('name', 'like', "%{$query}%")
                            ->orWhere('email', 'like', "%{$query}%")
                            ->orWhere('bio', 'like', "%{$query}%");
                    });

                $users = $usersQuery
                    ->limit($type === 'all' ? 5 : 20)
                    ->get()
                    ->map(fn ($user) => [
                        'type' => 'user',
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                        'bio' => $user->bio,
                        'role' => $user->role,
                        'total_score' => $user->total_score,
                        'current_rank' => $user->current_rank,
                        'documents_count' => $user->ownedDocuments()->where('status', 'published')->count(),
                    ]);

                $results = array_merge($results, $users->toArray());
                $stats['users'] = $users->count();
            }

            // Search Categories
            if (in_array($type, ['all', 'categories'])) {
                $categoriesQuery = Category::query()
                    ->withCount('documents')
                    ->where(function ($q) use ($query) {
                        $q->where('name', 'like', "%{$query}%")
                            ->orWhere('description', 'like', "%{$query}%");
                    });

                $categories = $categoriesQuery
                    ->limit($type === 'all' ? 5 : 20)
                    ->get()
                    ->map(fn ($cat) => [
                        'type' => 'category',
                        'id' => $cat->id,
                        'name' => $cat->name,
                        'slug' => $cat->slug,
                        'description' => $cat->description,
                        'icon' => $cat->icon,
                        'color' => $cat->color,
                        'documents_count' => $cat->documents_count,
                    ]);

                $results = array_merge($results, $categories->toArray());
                $stats['categories'] = $categories->count();
            }

            // Search Tags
            if (in_array($type, ['all', 'tags'])) {
                $tagsQuery = Tag::query()
                    ->withCount('documents')
                    ->where('name', 'like', "%{$query}%");

                $tags = $tagsQuery
                    ->limit($type === 'all' ? 5 : 20)
                    ->get()
                    ->map(fn ($tag) => [
                        'type' => 'tag',
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'slug' => $tag->slug,
                        'documents_count' => $tag->documents_count,
                    ]);

                $results = array_merge($results, $tags->toArray());
                $stats['tags'] = $tags->count();
            }

            $stats['total'] = count($results);
        }

        // Get filter options
        $categories = Category::orderBy('name')->get(['id', 'name', 'slug']);
        $tags = Tag::orderBy('name')->limit(50)->get(['id', 'name', 'slug']);

        return Inertia::render('search/index', [
            'query' => $query,
            'type' => $type,
            'results' => $results,
            'stats' => $stats,
            'filters' => [
                'category' => $category,
                'tag' => $tag,
                'status' => $status,
                'sort' => $sortBy,
            ],
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Get search suggestions for autocomplete.
     */
    public function suggestions(Request $request)
    {
        $query = $request->input('q', '');

        if (empty($query) || strlen($query) < 2) {
            return response()->json([]);
        }

        $suggestions = [];

        // Document titles
        $documents = Document::query()
            ->where('status', 'published')
            ->where('title', 'like', "%{$query}%")
            ->limit(5)
            ->get(['id', 'title', 'slug']);

        foreach ($documents as $doc) {
            $suggestions[] = [
                'type' => 'document',
                'label' => $doc->title,
                'value' => $doc->title,
                'url' => "/documents/{$doc->slug}",
            ];
        }

        // User names
        $users = User::query()
            ->where('name', 'like', "%{$query}%")
            ->limit(3)
            ->get(['id', 'name']);

        foreach ($users as $user) {
            $suggestions[] = [
                'type' => 'user',
                'label' => $user->name,
                'value' => $user->name,
                'url' => "/users/{$user->id}",
            ];
        }

        // Tags
        $tags = Tag::query()
            ->where('name', 'like', "%{$query}%")
            ->limit(3)
            ->get(['id', 'name', 'slug']);

        foreach ($tags as $tag) {
            $suggestions[] = [
                'type' => 'tag',
                'label' => "#{$tag->name}",
                'value' => $tag->name,
                'url' => "/tags/{$tag->slug}",
            ];
        }

        return response()->json($suggestions);
    }
}
