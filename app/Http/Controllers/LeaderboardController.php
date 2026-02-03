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
                    'badges' => $this->getUserBadges($user),
                    'score_breakdown' => $this->getScoreBreakdown($user),
                    'documents_count' => $user->ownedDocuments()->where('status', 'published')->count(),
                    'followers_count' => $user->followers()->count(),
                    'level' => $this->calculateLevel($user->total_score),
                    'next_level_score' => $this->getNextLevelScore($user->total_score),
                    'progress_to_next_level' => $this->getProgressToNextLevel($user->total_score),
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

    /**
     * Get user badges based on achievements.
     */
    private function getUserBadges(User $user): array
    {
        $badges = [];
        $documentsCount = $user->ownedDocuments()->where('status', 'published')->count();
        $followersCount = $user->followers()->count();

        // Score-based badges
        if ($user->total_score >= 1000) {
            $badges[] = ['name' => 'Legend', 'icon' => '👑', 'color' => 'gold'];
        } elseif ($user->total_score >= 750) {
            $badges[] = ['name' => 'Expert', 'icon' => '⭐', 'color' => 'blue'];
        } elseif ($user->total_score >= 500) {
            $badges[] = ['name' => 'Advanced', 'icon' => '🌟', 'color' => 'purple'];
        }

        // Document-based badges
        if ($documentsCount >= 50) {
            $badges[] = ['name' => 'Prolific Writer', 'icon' => '📚', 'color' => 'green'];
        } elseif ($documentsCount >= 20) {
            $badges[] = ['name' => 'Author', 'icon' => '✍️', 'color' => 'blue'];
        } elseif ($documentsCount >= 5) {
            $badges[] = ['name' => 'Writer', 'icon' => '📝', 'color' => 'gray'];
        }

        // Social badges
        if ($followersCount >= 100) {
            $badges[] = ['name' => 'Influencer', 'icon' => '🎯', 'color' => 'pink'];
        } elseif ($followersCount >= 50) {
            $badges[] = ['name' => 'Popular', 'icon' => '💫', 'color' => 'purple'];
        }

        // Early adopter
        if ($user->created_at && $user->created_at->lessThan(now()->subMonths(6))) {
            $badges[] = ['name' => 'Early Adopter', 'icon' => '🚀', 'color' => 'orange'];
        }

        return $badges;
    }

    /**
     * Get detailed score breakdown.
     */
    private function getScoreBreakdown(User $user): array
    {
        $userScore = $user->userScore;

        return [
            'documents_created' => [
                'value' => $userScore->documents_created ?? 0,
                'points' => ($userScore->documents_created ?? 0) * 10,
                'label' => 'Documents Created',
            ],
            'documents_reviewed' => [
                'value' => $userScore->documents_reviewed ?? 0,
                'points' => ($userScore->documents_reviewed ?? 0) * 5,
                'label' => 'Documents Reviewed',
            ],
            'helpful_votes' => [
                'value' => $userScore->helpful_votes ?? 0,
                'points' => ($userScore->helpful_votes ?? 0) * 2,
                'label' => 'Helpful Votes Received',
            ],
            'comments_made' => [
                'value' => $userScore->comments_made ?? 0,
                'points' => ($userScore->comments_made ?? 0) * 1,
                'label' => 'Comments Made',
            ],
        ];
    }

    /**
     * Calculate user level based on score.
     */
    private function calculateLevel(int $score): int
    {
        return (int) floor($score / 100) + 1;
    }

    /**
     * Get score needed for next level.
     */
    private function getNextLevelScore(int $score): int
    {
        $currentLevel = $this->calculateLevel($score);

        return $currentLevel * 100;
    }

    /**
     * Get progress percentage to next level.
     */
    private function getProgressToNextLevel(int $score): int
    {
        $currentLevel = $this->calculateLevel($score);
        $previousLevelScore = ($currentLevel - 1) * 100;
        $nextLevelScore = $currentLevel * 100;
        $scoreInCurrentLevel = $score - $previousLevelScore;
        $scoreNeededForLevel = $nextLevelScore - $previousLevelScore;

        if ($scoreNeededForLevel === 0) {
            return 100;
        }

        return (int) (($scoreInCurrentLevel / $scoreNeededForLevel) * 100);
    }
}
