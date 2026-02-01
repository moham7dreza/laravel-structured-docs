<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Documents
Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
Route::get('/documents/{slug}', [DocumentController::class, 'show'])->name('documents.show');

// Dashboard (authenticated)
Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
