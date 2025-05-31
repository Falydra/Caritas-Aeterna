<?php



use App\Http\Controllers\DonationDetailController;
use App\Http\Controllers\Donee\InitController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Donation\DonationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\Donation\FundraiserController;
use App\Http\Controllers\Donation\ProductDonationController;
use App\Http\Controllers\Donee\DoneeApplicationController;
use App\Http\Controllers\Donor\DonorController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\ManageDonationsController;
use App\Http\Controllers\SuperAdmin\ManageUserController;
use App\Http\Controllers\GeneralNewsController;
use App\Http\Controllers\Donee\DoneeDashboardController;
use App\Models\Donation;


use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

Route::get('/', function () {
    $user = auth()->user();
    $role = $user ? $user->roleName() : "";

    $donation = Donation::with('initiator:id,username')->get();




    return Inertia::render('Welcome', [
        'auth' => [
            'user' => $user,
            'roles' => $role,
        ],
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

Route::get('/book-details', function () {
    return Inertia::render('Book-Details');
})->middleware(['auth', 'verified'])->name('book-details');

Route::get('/dashboard/admin', [AdminDashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('admin.dashboard');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/super-admin', [DashboardController::class, 'index'])->name('super-admin.dashboard');
    Route::get('/dashboard/super-admin/manage-donations', [ManageDonationsController::class, 'index'])->name('super-admin.manage-donations');
    Route::get('/dashboard/super-admin/manage-users', [ManageUserController::class, 'index'])->name('super-admin.manage-users');
    Route::get('/dashboard/super-admin/manage-users/edit', [ManageUserController::class, 'edit'])->name('super-admin.manage-users.edit');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth','verified'])->group(function() {
    Route::get('/dashboard/donee', [DoneeDashboardController ::class, 'index'])->name('donee.dashboard');
    Route::get('/dashboard/donee/create-donation', [InitController::class, 'index'])->name('donee.init');
    Route::get('/dashboard/donee/donations', [DoneeDashboardController::class, 'donationIndex'])->name('donee.donations.index');
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

// Route::get('/books', [BookController::class, 'index'])->name('books.index');
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('books/create', [BookController::class, 'create'])->name('books.create');
//     Route::post('books', [BookController::class, 'store'])->name('books.store');
// });

// donee application group
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/donee/apply', [DoneeApplicationController::class, 'create'])->name('doneeapplication.create');
    Route::post('/donor/applications/update', [DoneeApplicationController::class, 'update'])->name('doneeapplication.update');
});

Route::fallback(function () {
    return Inertia::render('404');
})->name('fallback');
require __DIR__ . '/auth.php';
require __DIR__ . '/superadmin.php';
