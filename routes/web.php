<?php

use App\Http\Controllers\ActivityFeedController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentCreateController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

// Home page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Search
Route::get('/search', [SearchController::class, 'index'])->name('search.index');
Route::get('/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

// Documents
Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
// Document creation must come before {slug} route to avoid collision
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/documents/create', [DocumentCreateController::class, 'create'])->name('documents.create');
    Route::post('/documents', [DocumentCreateController::class, 'store'])->name('documents.store');
});
Route::get('/documents/{slug}', [DocumentController::class, 'show'])->name('documents.show');

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('categories.show');

// Tags
Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
Route::get('/tags/{slug}', [TagController::class, 'show'])->name('tags.show');

// Leaderboard
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');

// Activity Feed
Route::get('/activity', [ActivityFeedController::class, 'index'])->name('activity.index');

// User Profiles
Route::get('/users/{user}', [UserProfileController::class, 'show'])->name('users.show');
Route::post('/users/{user}/follow', [UserProfileController::class, 'follow'])
    ->middleware('auth')
    ->name('users.follow');
Route::delete('/users/{user}/follow', [UserProfileController::class, 'unfollow'])
    ->middleware('auth')
    ->name('users.unfollow');

// Notifications (authenticated)
Route::middleware(['auth', 'verified'])->group(function () {
    // API endpoint for structures
    Route::get('/api/structures/by-category', [DocumentCreateController::class, 'getStructures'])->name('structures.by-category');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unreadCount');
    Route::get('/api/notifications/recent', [NotificationController::class, 'recent'])->name('notifications.recent');
});

// Dashboard (authenticated)
Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

require __DIR__.'/settings.php';
