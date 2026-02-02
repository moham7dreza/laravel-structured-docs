<?php

use App\Http\Controllers\ActivityFeedController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Documents
Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
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

// Dashboard (authenticated)
Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

require __DIR__.'/settings.php';
