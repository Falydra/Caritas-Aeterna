<?php

use App\Http\Controllers\Donation\DonationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Fund\FundController;

// Route::post('/payment/create', [PaymentController::class, 'createTransaction']);
// Route::post('/fund/store', [FundController::class, 'submitFund'])->name('fund.submit');
Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
Route::get('/donations/{donation}', [DonationController::class, 'show'])->name('donations.show');
Route::get('/donations/search', [DonationController::class, 'search'])->name('donations.search');
Route::post('/notification/handler', [FundController::class, 'notificationHandler'])->name('notification.handler');
