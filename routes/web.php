<?php



use Inertia\Inertia;
use App\Models\Donation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\BookController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Donee\InitController;
use App\Http\Controllers\Donor\DonorController;
use App\Http\Controllers\GeneralNewsController;
use App\Http\Controllers\DonationDetailController;
use App\Http\Controllers\Admin\ManageUsersController;
use App\Http\Controllers\Donation\DonationController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Donor\DonorProfileController;
use App\Http\Controllers\Donation\FundraiserController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Donee\DoneeDashboardController;
use App\Http\Controllers\Donee\DoneeProfileController;
use App\Http\Controllers\Donor\DonorDashboardController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\Admin\ManageDonationsController;


use App\Http\Controllers\SuperAdmin\ManageUserController;
use App\Http\Controllers\Donee\DoneeApplicationController;
use App\Http\Controllers\SuperAdmin\SuperProfileController;
use App\Http\Controllers\Donation\ProductDonationController;
use App\Http\Controllers\DonationHistoryController;

Route::get('/', function () {
    $user = auth()->user();
    $role = $user ? $user->roleName() : "";

    $donation = Donation::with('initiator:id,username')->get();
    $bookDonation = Donation::where('type', 'App\\Models\\ProductDonation')->get();
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => $user,
            'roles' => $role,
        ],
        'bookDonation' => $bookDonation,
        'donation' => $donation,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/news', [GeneralNewsController::class, 'index'])->name('news');

Route::get('/donation', function () {
    $donations = Donation::with('initiator:id,username')->get();
    return Inertia::render('Donation', [
        'donations' => $donations,
    ]);
})->name('donation');





Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/donor', [DonorDashboardController::class, 'index'])->name('donor.dashboard');
    // Route::get('/dashboard/donor/donations', [DonorDashboardController::class, 'donationIndex'])->name('donor.donations.index');
    // Route::get('/dashboard/donor/donations/{donation}', [DonationDetailController::class, 'show'])->name('donor.donations.show');
    Route::get('/dashboard/donor/profile', [DonorProfileController::class, 'index'])->name('donor.profile');
    Route::patch('/dashboard/donor/profile', [DonorProfileController::class, 'update'])->name('donor.profile.update');
    Route::delete('/dashboard/donor/profile', [DonorProfileController::class, 'destroy'])->name('donor.profile.destroy');
    Route::get('/dashboard/donor/profile/register-donee', [DonorProfileController::class, 'showRegisterForm'])->name('donor.donee-register-form');
    Route::post('dashboard/donor/profile/donee-registration', [DonorProfileController::class, 'doneeRegister'])->name('donor.donee-register');
    // Route::patch('/dashboard/donor/profile', [ProfileController::class, 'update'])->name('donor.profile.update');
    Route::get('/dashboard/donor/donation-history', [DonorDashboardController::class, 'donationHistoryIndex'])->name('donor.dashboard.donationHistory');

    Route::get('/donation-history/all', [DonationHistoryController::class, 'index'])->name('donor.dashboard.donationHistory.index');
    Route::get('/donation-history/funds', [DonationHistoryController::class, 'funds'])->name('donor.dashboard.donationHistory.funds');
    Route::get('/donation-history/items', [DonationHistoryController::class, 'items'])->name('donor.dashboard.donationHistory.items');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/admin', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/dashboard/admin/manage-donations', [ManageDonationsController::class, 'index'])->name('admin.manage-donations');
    Route::get('/dashboard/admin/manage-donations/edit', [ManageDonationsController::class, 'edit'])->name('admin.manage-donations.edit');
    Route::post('/dashboard/admin/manage-donations/set-status', [ManageDonationsController::class, 'setStatus'])->name('admin.manage-donations.set-status');

    Route::patch('/dashboard/admin/manage-donations/{id}', [ManageDonationsController::class, 'update'])->name('admin.manage-donations.update');
    Route::patch('/dashboard/admin/manage-users/{id}', [ManageUsersController::class, 'update'])->name('admin.manage-users.update');
    Route::get('/dashboard/admin/manage-users', [ManageUsersController::class, 'index'])->name('admin.manage-users');
    Route::get('/dashboard/admin/manage-users/edit', [ManageUsersController::class, 'edit'])->name('admin.manage-users.edit');
    Route::patch('/dashboard/admin/profile', [AdminProfileController::class, 'updateProfile'])->name('admin.profile.update');
    Route::get('/dashboard/admin/profile', [AdminProfileController::class, 'index'])->name('admin.profile');
    Route::get('/dashboard/admin/manage-application', [DoneeApplicationController::class, 'index'])->name('admin.manage-application');
    Route::get('/dashboard/admin/manage-application/user-detail/{userId}', [DoneeApplicationController::class, 'showUserDetail'])->name('admin.manage-application.user-detail');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/super-admin', [DashboardController::class, 'index'])->name('super-admin.dashboard');

    Route::get('/dashboard/super-admin/manage-users', [ManageUserController::class, 'index'])->name('super-admin.manage-users');
    Route::get('/dashboard/super-admin/manage-users/edit', [ManageUserController::class, 'edit'])->name('super-admin.manage-users.edit');
    Route::patch('/dashboard/super-admin/manage-users/{id}', [ManageUserController::class, 'update'])->name('super-admin.manage-users.update');
    Route::get('/dashboard/super-admin/profile', [SuperProfileController::class, 'index'])->name('super-admin.profile');
    Route::patch('/dashboard/super-admin/profile', [SuperProfileController::class, 'update'])->name('super-admin.profile.update');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/donee', function () {
        return redirect(route("donee.donations.index"));
    })->name('donee.dashboard');
    Route::get('/dashboard/donee/create-donation', [InitController::class, 'index'])->name('donee.init');
    Route::get('dashboard/donee/profile', [DoneeProfileController:: class, 'index'])->name('donee.profile');
    Route::delete('dashboard/donee/profile', [DoneeProfileController:: class, 'destroy'])->name('donee.profile.destroy');
    Route::get('/dashboard/donee/donations', [DoneeDashboardController::class, 'donationIndex'])->name('donee.donations.index');
    Route::patch('/dashboard/donee/profile', [DoneeProfileController::class, 'update'])->name('donee.profile.update');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    Route::get('/donations/create', [DonationController::class, 'create'])->name('donations.create');
    Route::post('/donations/donate', [DonorController::class, 'donate'])->name('donations.donate');

    // midtrans url endpoints
    Route::get('/donations/payment/pay/{fund}', [PaymentController::class, 'show'])->name('donation.pay');
    Route::post('/donations/payment/notifications/handling');
    Route::get('/donations/payment/finish', [PaymentController::class, 'finish'])->name('midtrans.finish');
    Route::post('/donations/payment/error', [PaymentController::class, 'error'])->name('midtrans.error');

    // product donation handling
    Route::post('/donations/product/verify', [ProductDonationController::class, 'verify'])->name('product.verify');
    Route::post('/donations/product/finish', [ProductDonationController::class, 'finish'])->name('product.finish');
});
Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
Route::get('/donations/fundraiser/latest', [FundraiserController::class, 'latest'])->name('fundraiser.latest');
Route::get('/donations/product/latest', [ProductDonationController::class, 'latest'])->name('product_donation.latest');
Route::get('/donations/{donation}', [DonationController::class, 'show'])->name('donations.show');
Route::get('/donations/search', [DonationController::class, 'search'])->name('donations.search');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('books/create', [BookController::class, 'create'])->name('books.create');
    Route::post('books', [BookController::class, 'store'])->name('books.store');
});

// donee application group
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/donee/apply', [DoneeApplicationController::class, 'create'])->name('doneeapplication.create');
    Route::patch('/donor/applications/update', [DoneeApplicationController::class, 'update'])->name('doneeapplication.update');
});

Route::fallback(function () {
    return Inertia::render('404');
})->name('fallback');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
require __DIR__ . '/auth.php';
require __DIR__ . '/superadmin.php';
