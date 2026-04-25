<?php

use App\Http\Controllers\ExportController;
use App\Http\Controllers\GenerateController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesPageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => ['user' => auth()->user()],
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    $recentPages = $user->salesPages()
        ->latest()
        ->take(5)
        ->get(['id', 'product_name', 'template', 'status', 'created_at', 'generated_content']);
    return Inertia::render('Dashboard', [
        'stats' => [
            'total'     => $user->salesPages()->count(),
            'generated' => $user->salesPages()->where('status', 'generated')->count(),
            'draft'     => $user->salesPages()->where('status', 'draft')->count(),
        ],
        'recentPages' => $recentPages,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('sales-pages', SalesPageController::class);
    Route::post('sales-pages/{salesPage}/generate', [GenerateController::class, 'generate'])
        ->name('sales-pages.generate');
    Route::post('sales-pages/{salesPage}/regenerate-section', [GenerateController::class, 'regenerateSection'])
        ->name('sales-pages.regenerate-section');
    Route::get('sales-pages/{salesPage}/export-html', [ExportController::class, 'exportHtml'])
        ->name('sales-pages.export-html');
    Route::patch('sales-pages/{salesPage}/update-settings', [SalesPageController::class, 'updateSettings'])
        ->name('sales-pages.update-settings');
    Route::post('sales-pages/{salesPage}/duplicate', [SalesPageController::class, 'duplicate'])
        ->name('sales-pages.duplicate');
});

require __DIR__.'/auth.php';
