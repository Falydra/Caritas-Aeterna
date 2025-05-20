<?php

use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('/admin/create', [AdminController::class, 'create'])->name('admin.create');
    Route::post('/admin/destroy', [AdminController::class, 'destroy'])->name('admin.delete');
});
