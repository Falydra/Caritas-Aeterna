<?php

namespace App\Http\Controllers\Donation;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use App\Models\Fundraiser;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProductDonation;
use App\Traits\HandleDonationsData;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Donation\DonationCollection;
use Illuminate\Contracts\Database\Eloquent\Builder;
use App\Http\Requests\Donation\DonationStoreRequest;

class DonationController extends Controller {
    use HandleDonationsData;

    public function index() {
        $donations = Donation::select(
            'type',
            'type_attributes',
            'title',
            'header_image'
        )->whereNot(function (Builder $query) {
            $query->where('status', 'pending')->orWhere('status', 'denied');
        })->latest()->paginate(10);

        return (new DonationCollection($donations))->additional([
            'status' => 'success',
            'message' => 'Lists donation retrieved successfully'
        ]);
    }

    public function show(Donation $donation) {
        if (request()->is('api/*')) {
            $donationData = Donation::with([
                'donorDonations' => function ($q) {
                    $q->select(
                        'id', 'donor_id', 'donation_id', 'verified_at'
                    )->whereHas('funds', function ($q) {
                        $q->where('status', 'on_progress'); ####### IMPORTANT!!! CHANGE TO SUCCESS ##########
                    })->latest('created_at')->take(10);
                },
                'donorDonations.donor' => function ($q) {
                    $q->select('id', 'username');
                },
                'donorDonations.funds' => function ($q) {
                    $q->select('id', 'donor_donation_id', 'amount');
                }
            ])->find($donation->id);
            return $donationData;
        }

        if ($donation->type === ProductDonation::class) {
            return app(ProductDonationController::class)->show($donation);
        }

        if ($donation->type === Fundraiser::class) {
            return app(FundraiserController::class)->show($donation);
        }
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
            'data.type' => "bail|required|string",
        ]);

        if ($validated['data']['type'] === 'product_donation') {
            return app(ProductDonationController::class)->store($request);
        }

        if ($validated['data']['type'] === 'fundraiser') {
            return app(FundraiserController::class)->store($request);
        }

        abort(400, 'Invalid donation type');
    }

    public function search(Request $request) {
        $validated = $request->validate([
            'data.keyword' => "bail|string"
        ]);

        $query = data_get($validated, 'data.keyword');
        if (isset($query)) {
            $query = $this->sanitizeTextInput($query);
        }

        $donations = Donation::query()
            ->when($query, function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                ->orWhere('type', 'like', "%{$query}%");
            })
            ->latest()
            ->paginate(10);

        return (new DonationCollection($donations))->additional([
            'status' => 'success',
            'message' => 'Lists donation retrieved successfully'
        ]);
    }
}
