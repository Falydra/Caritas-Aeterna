<?php


use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Donation\DonationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\SuperAdmin\DashboardController;

use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    $user = auth()->user();
    // $roleModel = $user? $user->roles()->withPivot('id')->first() : null;
    // $role = $roleModel? [
    //     'id' => $roleModel->pivot->id,
    //     'name' => $user,
    //     'role' => $user->role(),
    // ] : null;
    $role = $user ? $user->roleName() : "";
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => $user,
            'roles' => $role,
        ],
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

Route::get('/dashboard/admin', [AdminDashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');

Route::get('/dashboard/super-admin', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('super-admin.dashboard');

Route::fallback(function () {
    return Inertia::render('404');
})->name('fallback');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
// Route::get('/donations/{donation}', [DonationController::class, 'show'])->name('donation.show');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/donations/create', [DonationController::class, 'create'])->name('donations.create');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
});

require __DIR__ . '/auth.php';
