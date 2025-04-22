<?php

namespace App\Http\Controllers\Donation;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use Illuminate\Http\Request;
use App\Models\ProductDonation;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ProductDonationController extends Controller {
    public function index() {
        $donations = ProductDonation::select(
            'type', 'type_attributes', 'title', 'header_image'
        )->latest()->paginate(10);
    }

    public function show(ProductDonation $donation) {
        return Inertia::render('Donation/Show', [
            'donation' => $donation
        ]);
    }

    public function create() {
        if (empty(Auth::user())) {
            return Inertia::render('Error', [
                'code' => '401',
                'status' => 'unauthorized',
                'message' => 'login dulu bray'
            ]);
        }

        if (Auth::user()->role() != Donee::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('Donation/Create', [
            'auth' => Auth::user(),
            'donationStoreUrl' => route('donations.store'),
        ]);
    }
}
