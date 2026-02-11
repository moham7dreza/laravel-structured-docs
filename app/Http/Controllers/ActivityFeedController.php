<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityFeedController extends Controller
{
    /**
     * Display the global activity feed.
     */
    public function index(Request $request): Response
    {
        $filter = $request->input('filter', 'all'); // all, following, my

        // Build base query
        $query = Activity::query()->with(['user', 'subject']);

        // Apply filters
        if ($filter === 'following' && $request->user()) {
            // Show activities from users the current user follows
            $followingIds = $request->user()->following()->pluck('users.id');
            $query->whereIn('user_id', $followingIds);
        } elseif ($filter === 'my' && $request->user()) {
            // Show only current user's activities
            $query->where('user_id', $request->user()->id);
        }

        // Get activities with pagination
        $activities = $query
            ->latest('created_at')
            ->paginate(20)
            ->through(function ($activity) {
                return [
                    'id' => $activity->id,
                    'action' => $activity->action,
                    'description' => $activity->description,
                    'created_at' => $activity->created_at->diffForHumans(),
                    'created_at_full' => $activity->created_at->format('M d, Y H:i'),
                    'user' => [
                        'id' => $activity->user->id,
                        'name' => $activity->user->name,
                        'avatar' => $activity->user->avatar,
                    ],
                    'subject' => $this->formatSubject($activity),
                ];
            });

        // Get statistics
        $stats = [
            'total_activities' => Activity::count(),
            'today' => Activity::whereDate('created_at', today())->count(),
            'this_week' => Activity::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        return Inertia::render('activity/index', [
            'activities' => $activities,
            'stats' => $stats,
            'filter' => $filter,
        ]);
    }

    /**
     * Format the subject based on its type.
     */
    private function formatSubject(Activity $activity): ?array
    {
        if (! $activity->subject) {
            return null;
        }

        $subject = $activity->subject;

        // Document subject
        if ($activity->subject_type === 'App\\Models\\Document') {
            return [
                'type' => 'document',
                'id' => $subject->id,
                'title' => $subject->title,
                'slug' => $subject->slug,
                'url' => "/documents/{$subject->slug}",
            ];
        }

        // Comment subject
        if ($activity->subject_type === 'App\\Models\\Comment') {
            return [
                'type' => 'comment',
                'id' => $subject->id,
                'content' => substr($subject->content, 0, 100),
                'document_id' => $subject->document_id,
            ];
        }

        // Default
        return [
            'type' => 'unknown',
            'id' => $subject->id,
        ];
    }
}
