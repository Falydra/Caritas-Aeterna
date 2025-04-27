<?php

namespace App\Http\Controllers\Donation;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\DonationStoreRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Donation\DonationCollection;

class DonationController extends Controller {
    public function index() {
        $donations = Donation::select(
            'type', 'type_attributes', 'title', 'header_image'
        )->latest()->paginate(10);

        return (new DonationCollection($donations))->additional([
            'status' => 'success',
            'message' => 'Lists donation retrieved successfully'
        ]);
    }

    public function show(Donation $donation) {
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

    public function store(DonationStoreRequest $request) {
        $user = $request->user();

        if (!$user || $user->role() !== Donee::class) {
            abort(403, 'dih ogah, lu siapa coba');
        }

        $validated = $request->validate([
            'data.type' => "bail|required",
        ]);

        if ($validated['data']['type'] === 'product_donation') {
            return app(ProductDonationController::class)->store($request);
        }

        if ($validated['data']['type'] === 'fundraiser') {
            return app(FundraiserController::class)->store($request);
        }

        abort(400, 'Invalid donation type');
    }
}
