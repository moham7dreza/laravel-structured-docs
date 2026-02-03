<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Show the settings page.
     */
    public function index(): Response
    {
        $user = auth()->user();

        return Inertia::render('settings/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'location' => $user->location,
                'website' => $user->website,
                'twitter' => $user->twitter,
                'github' => $user->github,
                'created_at' => $user->created_at->toISOString(),
            ],
            'preferences' => [
                'email_notifications' => $user->email_notifications ?? true,
                'email_comments' => $user->email_comments ?? true,
                'email_mentions' => $user->email_mentions ?? true,
                'email_followers' => $user->email_followers ?? true,
                'email_newsletter' => $user->email_newsletter ?? true,
                'theme' => $user->theme ?? 'system',
                'language' => $user->language ?? 'en',
            ],
            'privacy' => [
                'profile_visible' => $user->profile_visible ?? true,
                'show_email' => $user->show_email ?? false,
                'show_activity' => $user->show_activity ?? true,
            ],
        ]);
    }

    /**
     * Update profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:500'],
            'location' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'twitter' => ['nullable', 'string', 'max:255'],
            'github' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = auth()->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    /**
     * Update email preferences.
     */
    public function updateEmailPreferences(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => ['boolean'],
            'email_comments' => ['boolean'],
            'email_mentions' => ['boolean'],
            'email_followers' => ['boolean'],
            'email_newsletter' => ['boolean'],
        ]);

        auth()->user()->update($validated);

        return back()->with('success', 'Email preferences updated successfully.');
    }

    /**
     * Update notification preferences.
     */
    public function updateNotificationPreferences(Request $request)
    {
        $validated = $request->validate([
            'theme' => ['required', 'in:light,dark,system'],
            'language' => ['required', 'string', 'max:10'],
        ]);

        auth()->user()->update($validated);

        return back()->with('success', 'Preferences updated successfully.');
    }

    /**
     * Update privacy settings.
     */
    public function updatePrivacy(Request $request)
    {
        $validated = $request->validate([
            'profile_visible' => ['boolean'],
            'show_email' => ['boolean'],
            'show_activity' => ['boolean'],
        ]);

        auth()->user()->update($validated);

        return back()->with('success', 'Privacy settings updated successfully.');
    }

    /**
     * Upload avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'], // 2MB max
        ]);

        $user = auth()->user();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => '/storage/'.$path]);
        }

        return back()->with('success', 'Avatar updated successfully.');
    }

    /**
     * Delete account.
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = auth()->user();

        // Logout
        auth()->logout();

        // Soft delete user
        $user->delete();

        return redirect()->route('home')->with('success', 'Your account has been deleted.');
    }
}
