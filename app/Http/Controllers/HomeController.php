<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Get featured documents (high score, published)
        $featuredDocuments = Document::query()
            ->with(['category', 'owner'])
            ->where('status', 'published')
            ->where('total_score', '>=', 70)
            ->latest('updated_at')
            ->take(6)
            ->get()
            ->map(fn ($doc) => [
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

        // Get recent documents
        $recentDocuments = Document::query()
            ->with(['category', 'owner'])
            ->where('status', 'published')
            ->latest('updated_at')
            ->take(8)
            ->get()
            ->map(fn ($doc) => [
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

        // Get popular categories
        $popularCategories = Category::query()
            ->withCount('documents')
            ->orderBy('documents_count', 'desc')
            ->take(6)
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'icon' => $cat->icon,
                'color' => $cat->color,
                'documents_count' => $cat->documents_count,
            ]);

        // Calculate stats
        $stats = [
            'totalDocuments' => Document::count(),
            'totalUsers' => User::count(),
            'totalViews' => Document::sum('view_count'),
        ];

        return Inertia::render('home', [
            'featuredDocuments' => $featuredDocuments,
            'recentDocuments' => $recentDocuments,
            'popularCategories' => $popularCategories,
            'stats' => $stats,
        ]);
    }
}
