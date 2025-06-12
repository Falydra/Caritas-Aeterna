<?php

namespace App\Http\Controllers\Donee;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use App\Models\Facility;
use App\Models\BookDonation;
use App\Models\DonationItem;
use Illuminate\Http\Request;
use App\Models\ProductDonation;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DoneeDashboardController extends Controller {
    public function index() {
        if (Auth::user()->role() != Donee::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resources.'
            ]);
        }

        return Inertia::render('Donee/Dashboard', [
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
            'donationStoreUrl' => route('donations.store'),

        ]);
    }

    public function donationIndex() {
        if (Auth::user()->role() !== Donee::class) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => "You do not have permission to access this resources."
            ]);
        }

        $user = Auth::user();
        $donations = $user->donations()->select(['id', 'initiator_id', 'type', 'title', 'type_attributes', 'status'])->paginate(10);

        return Inertia::render('Donee/ActiveDonation', [
            'auth' => [
                'user' => $user,
                'roles' => $user->roleName()
            ],
            'data' => $donations
        ]);
    }

    public function donatedItems(Donation $donation) {
        $user = Auth::user();
        if ($user->role() !== Donee::class && $user->id !== $donation->initiator_id) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => "You do not have permission to access this resources."
            ]);
        }

        $donationData = $donation->select([
            'id',
            'initiator_id',
            'type',
            'type_attributes',
            'title'
        ])->first();

        if ($donation->type() === ProductDonation::class) {
            $data = DonationItem::whereHas('donorDonation', function ($q) use ($donation) {
                $q->where('donation_id', $donation->id);
            })->with([
                'donorDonation.donor:id,username'
            ])->paginate(10);

            return Inertia::render('Donation/DonatedItemList', [
                'auth' => [
                    'user' => $user,
                    'roles' => $user->roleName()
                ],
                'data' => [
                    'donation' => $donationData,
                    'donation_item' => $data
                ],
            ]);
        }

        return Inertia::render('Donation/DonatedItemList', [
            'auth' => [
                'user' => $user,
                'roles' => $user->roleName()
            ],
            'data' => []
        ]);
    }
}
