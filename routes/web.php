<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CartController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/dashboard/cart', function () {
    return Inertia::render('Dashboard/Cart'); 
})->middleware(['auth', 'verified'])->name('cart');

Route::get('/dashboard/payment', function () {
    return Inertia::render('Dashboard/Payment');
})->middleware(['auth', 'verified'])->name('payment');

Route::get('/dashboard/donors', function () {
    return Inertia::render('Dashboard/Donors');
})->middleware(['auth', 'verified'])->name('donors');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
