<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Fund\FundController;
use App\Http\Controllers\Donation\DonationController;

Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
Route::get('/donations/{donation}', [DonationController::class, 'show'])->name('donations.show');
Route::get('/donations/search', [DonationController::class, 'search'])->name('donations.search');

Route::get('/books/search', [BookController::class, 'search'])->name('books.search');
Route::resource('/books', BookController::class);
