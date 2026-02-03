<?php

use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

// New comprehensive settings page (replaces old settings routes)
Route::middleware(['auth', 'verified'])->group(function () {
    // Main settings page with all tabs
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');

    // Settings update routes
    Route::put('settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile');
    Route::put('settings/password', [SettingsController::class, 'updatePassword'])
        ->middleware('throttle:6,1')
        ->name('settings.password');
    Route::put('settings/email-preferences', [SettingsController::class, 'updateEmailPreferences'])->name('settings.email');
    Route::put('settings/preferences', [SettingsController::class, 'updateNotificationPreferences'])->name('settings.preferences');
    Route::put('settings/privacy', [SettingsController::class, 'updatePrivacy'])->name('settings.privacy');
    Route::post('settings/avatar', [SettingsController::class, 'uploadAvatar'])->name('settings.avatar');
    Route::delete('settings/account', [SettingsController::class, 'deleteAccount'])->name('settings.delete');

    // Keep old routes for backward compatibility (redirect to new settings)
    Route::redirect('settings/profile', '/settings');
    Route::redirect('settings/appearance', '/settings');

    // 2FA route (if needed separately)
    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
