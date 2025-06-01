<?php
use App\Http\Controllers\DonationDetailController;
use App\Http\Controllers\Donee\InitController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\ManageUserController;
use App\Http\Controllers\SuperAdmin\SuperProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ManageDonationsController;
use App\Http\Controllers\Admin\ManageUsersController;
use App\Http\Controllers\Donation\DonationController;
use App\Http\Controllers\Donation\FundraiserController;
use App\Http\Controllers\Donation\ProductDonationController;
use App\Http\Controllers\Donee\DoneeDashboardController;
use App\Http\Controllers\Donee\DoneeApplicationController;
use App\Http\Controllers\Donor\DonorController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\GeneralNewsController;
use App\Models\Donation;
use App\Http\Controllers\Admin\AdminController;

use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/super-admin', [DashboardController::class, 'index'])->name('super-admin.dashboard');

    // menej admin thingy
    Route::get('/dashboard/super-admin/manage-users', [ManageUserController::class, 'index'])->name('super-admin.manage-users');
    Route::get('/dashboard/super-admin/manage-users/create', [ManageUserController::class, 'createPage'])->name('super-admin.manage-users.create');
    Route::post('/dashboard/super-admin/manage-users/create', [AdminController::class, 'create'])->name('admin.create');
    Route::get('/dashboard/super-admin/manage-users/edit', [ManageUserController::class, 'edit'])->name('super-admin.manage-users.edit');
    Route::put('/dashboard/super-admin/manage-users/edit', [AdminController::class, 'put'])->name('admin.password.update');
    Route::delete('/dashboard/super-admin/manage-users/{id}', [AdminController::class, 'destroy'])->name('super-admin.manage-users.destroy');

    // Super Admin Profile Routes
    Route::get('/dashboard/super-admin/profile', [SuperProfileController::class, 'index'])->name('super-admin.profile');
    Route::patch('/dashboard/super-admin/profile', [SuperProfileController::class, 'update'])->name('super-admin.profile.update');
});
