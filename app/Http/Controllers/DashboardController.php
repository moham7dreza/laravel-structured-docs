<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Quick Stats
        $stats = [
            'documents_read' => $user->documentViews()->distinct('document_id')->count('document_id'),
            'bookmarks' => $user->documentWatchers()->count(),
            'contributions' => Document::where('owner_id', $user->id)->count(),
            'comments' => $user->comments()->count(),
        ];

        // Recent documents (last viewed)
        $recentDocuments = $user->documentViews()
            ->with(['document' => function ($query) {
                $query->with(['category', 'owner']);
            }])
            ->latest()
            ->take(6)
            ->get()
            ->unique('document_id')
            ->map(function ($view) {
                $doc = $view->document;
                if (! $doc) {
                    return null;
                }

                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'slug' => $doc->slug,
                    'description' => $doc->description,
                    'thumbnail' => $doc->image,
                    'score' => $doc->total_score,
                    'views_count' => $doc->view_count ?? 0,
                    'updated_at' => $doc->updated_at->toISOString(),
                    'category' => $doc->category ? [
                        'name' => $doc->category->name,
                        'slug' => $doc->category->slug,
                        'icon' => $doc->category->icon,
                        'color' => $doc->category->color,
                    ] : null,
                    'owner' => $doc->owner ? [
                        'id' => $doc->owner->id,
                        'name' => $doc->owner->name,
                        'avatar' => $doc->owner->avatar,
                    ] : null,
                ];
            })
            ->filter()
            ->values()
            ->take(6);

        // Bookmarked documents
        $bookmarks = $user->documentWatchers()
            ->with(['document' => function ($query) {
                $query->with(['category', 'owner']);
            }])
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($watcher) {
                $doc = $watcher->document;
                if (! $doc) {
                    return null;
                }

                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'slug' => $doc->slug,
                    'description' => $doc->description,
                    'score' => $doc->total_score,
                    'category' => $doc->category ? [
                        'name' => $doc->category->name,
                        'slug' => $doc->category->slug,
                        'icon' => $doc->category->icon,
                        'color' => $doc->category->color,
                    ] : null,
                ];
            })
            ->filter()
            ->values();

        // Recent activity feed (last 10 activities)
        $activities = Activity::query()
            ->with(['user', 'subject'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'action' => $activity->action,
                    'description' => $activity->description,
                    'created_at' => $activity->created_at->diffForHumans(),
                    'user' => [
                        'id' => $activity->user->id,
                        'name' => $activity->user->name,
                        'avatar' => $activity->user->avatar,
                    ],
                    'subject' => $this->formatSubject($activity),
                ];
            });

        // Recommended documents (high score, not viewed by user)
        $viewedDocumentIds = $user->documentViews()->pluck('document_id')->toArray();
        $recommended = Document::query()
            ->with(['category', 'owner'])
            ->where('status', 'published')
            ->where('total_score', '>=', 70)
            ->whereNotIn('id', $viewedDocumentIds)
            ->inRandomOrder()
            ->take(6)
            ->get()
            ->map(fn ($doc) => [
                'id' => $doc->id,
                'title' => $doc->title,
                'slug' => $doc->slug,
                'description' => $doc->description,
                'thumbnail' => $doc->image,
                'score' => $doc->total_score,
                'views_count' => $doc->view_count ?? 0,
                'category' => $doc->category ? [
                    'name' => $doc->category->name,
                    'slug' => $doc->category->slug,
                    'icon' => $doc->category->icon,
                    'color' => $doc->category->color,
                ] : null,
                'owner' => $doc->owner ? [
                    'id' => $doc->owner->id,
                    'name' => $doc->owner->name,
                    'avatar' => $doc->owner->avatar,
                ] : null,
            ]);

        // User's documents
        $myDocuments = Document::query()
            ->where('owner_id', $user->id)
            ->with(['category'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($doc) => [
                'id' => $doc->id,
                'title' => $doc->title,
                'slug' => $doc->slug,
                'status' => $doc->status,
                'score' => $doc->total_score,
                'views_count' => $doc->view_count ?? 0,
                'updated_at' => $doc->updated_at->diffForHumans(),
                'category' => $doc->category ? [
                    'name' => $doc->category->name,
                    'slug' => $doc->category->slug,
                ] : null,
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentDocuments' => $recentDocuments,
            'bookmarks' => $bookmarks,
            'activities' => $activities,
            'recommended' => $recommended,
            'myDocuments' => $myDocuments,
        ]);
    }

    private function formatSubject($activity): ?array
    {
        if (! $activity->subject) {
            return null;
        }

        $subject = $activity->subject;

        if ($subject instanceof Document) {
            return [
                'type' => 'document',
                'id' => $subject->id,
                'title' => $subject->title,
                'slug' => $subject->slug,
            ];
        }

        return null;
    }
}
