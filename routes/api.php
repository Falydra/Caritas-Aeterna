<?php



use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;



Route::post('/payment/create', [PaymentController::class, 'createTransaction']);
