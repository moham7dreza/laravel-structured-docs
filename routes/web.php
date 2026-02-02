<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Documents
Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
Route::get('/documents/{slug}', [DocumentController::class, 'show'])->name('documents.show');

// User Profiles
Route::get('/users/{user}', [UserProfileController::class, 'show'])->name('users.show');
Route::post('/users/{user}/follow', [UserProfileController::class, 'follow'])
    ->middleware('auth')
    ->name('users.follow');
Route::delete('/users/{user}/follow', [UserProfileController::class, 'unfollow'])
    ->middleware('auth')
    ->name('users.unfollow');

// Dashboard (authenticated)
Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
