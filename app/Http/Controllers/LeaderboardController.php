<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    /**
     * Display the leaderboard page.
     */
    public function index(Request $request): Response
    {
        $timeframe = $request->input('timeframe', 'all'); // all, week, month, year
        $limit = $request->input('limit', 100);

        // Build base query
        $query = User::query()
            ->with(['userScore'])
            ->where('total_score', '>', 0);

        // Apply timeframe filter if needed
        if ($timeframe !== 'all') {
            $date = match ($timeframe) {
                'week' => now()->subWeek(),
                'month' => now()->subMonth(),
                'year' => now()->subYear(),
                default => null,
            };

            if ($date) {
                $query->where('updated_at', '>=', $date);
            }
        }

        // Get top users ordered by score
        $users = $query
            ->orderBy('total_score', 'desc')
            ->orderBy('current_rank', 'asc')
            ->limit($limit)
            ->get()
            ->map(function ($user, $index) {
                return [
                    'position' => $index + 1,
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'total_score' => $user->total_score,
                    'current_rank' => $user->current_rank,
                    'grade' => $this->calculateGrade($user->total_score),
                    'score_breakdown' => [
                        'documents_created' => $user->userScore->documents_created ?? 0,
                        'documents_reviewed' => $user->userScore->documents_reviewed ?? 0,
                        'helpful_votes' => $user->userScore->helpful_votes ?? 0,
                        'comments_made' => $user->userScore->comments_made ?? 0,
                    ],
                    'documents_count' => $user->ownedDocuments()->where('status', 'published')->count(),
                ];
            });

        // Get statistics
        $stats = [
            'total_users' => User::where('total_score', '>', 0)->count(),
            'total_score' => User::sum('total_score'),
            'average_score' => User::where('total_score', '>', 0)->avg('total_score'),
            'highest_score' => User::max('total_score'),
        ];

        // Get current user's position if authenticated
        $currentUserPosition = null;
        $currentUserData = null;

        if ($request->user()) {
            $currentUserPosition = User::where('total_score', '>', $request->user()->total_score)
                ->orWhere(function ($query) use ($request) {
                    $query->where('total_score', '=', $request->user()->total_score)
                        ->where('id', '<', $request->user()->id);
                })
                ->count() + 1;

            $currentUserData = [
                'position' => $currentUserPosition,
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'avatar' => $request->user()->avatar,
                'total_score' => $request->user()->total_score,
                'current_rank' => $request->user()->current_rank,
                'grade' => $this->calculateGrade($request->user()->total_score),
            ];
        }

        return Inertia::render('leaderboard/index', [
            'users' => $users,
            'stats' => $stats,
            'timeframe' => $timeframe,
            'currentUser' => $currentUserData,
        ]);
    }

    /**
     * Calculate grade based on score.
     */
    private function calculateGrade(int $score): string
    {
        return match (true) {
            $score >= 1000 => 'S',
            $score >= 750 => 'A',
            $score >= 500 => 'B',
            $score >= 250 => 'C',
            $score >= 100 => 'D',
            default => 'F',
        };
    }
}
