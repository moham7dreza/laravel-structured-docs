<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    /**
     * Display the specified user's profile.
     */
    public function show(Request $request, User $user): Response
    {
        // Load user relationships
        $user->load([
            'followers',
            'following',
            'userScore',
            'leaderboardEntry',
        ]);

        // Get user's public documents
        $documents = $user->ownedDocuments()
            ->where('status', 'published')
            ->with(['category', 'tags'])
            ->latest()
            ->paginate(12);

        // Get user's recent activities
        $activities = $user->activities()
            ->with(['subject'])
            ->latest()
            ->limit(10)
            ->get();

        // Check if the authenticated user is following this profile user
        $isFollowing = $request->user()
            ? $request->user()->following()->where('following_id', $user->id)->exists()
            : false;

        // Check if this is the authenticated user's own profile
        $isOwnProfile = $request->user()?->id === $user->id;

        return Inertia::render('users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $isOwnProfile ? $user->email : null,
                'avatar' => $user->avatar,
                'total_score' => $user->total_score,
                'current_rank' => $user->current_rank,
                'created_at' => $user->created_at,
                'followers_count' => $user->followers()->count(),
                'following_count' => $user->following()->count(),
                'documents_count' => $user->ownedDocuments()->where('status', 'published')->count(),
                'score_breakdown' => $user->userScore,
                'leaderboard_position' => $user->leaderboardEntry?->position,
            ],
            'documents' => $documents,
            'activities' => $activities,
            'isFollowing' => $isFollowing,
            'isOwnProfile' => $isOwnProfile,
        ]);
    }

    /**
     * Follow a user.
     */
    public function follow(Request $request, User $user)
    {
        $currentUser = $request->user();

        if ($currentUser->id === $user->id) {
            return back()->with('error', 'You cannot follow yourself.');
        }

        if (!$currentUser->following()->where('following_id', $user->id)->exists()) {
            $currentUser->following()->attach($user->id);
        }

        return back()->with('success', "You are now following {$user->name}.");
    }

    /**
     * Unfollow a user.
     */
    public function unfollow(Request $request, User $user)
    {
        $request->user()->following()->detach($user->id);

        return back()->with('success', "You have unfollowed {$user->name}.");
    }
}
