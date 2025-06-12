<?php

namespace App\Http\Controllers\Donee;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Donee;


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

        $items = $donation->select([
            'id',
            'initiator_id',
            'type',
            'type_attributes',
            'title'
        ])->with([
            'donorDonations:id,donation_id',
            'donorDonations.funds:id,order_id,donor_donation_id,amount,status,updated_at',
            'donorDonations.donationItem:id,donor_donation_id,product_amount,package_picture,resi,status,updated_at'
        ])->first();

        return Inertia::render('Donation/DonatedItemList', [
            'auth' => [
                'user' => $user,
                'roles' => $user->roleName()
            ],
            'data' => $items
        ]);
    }
}
