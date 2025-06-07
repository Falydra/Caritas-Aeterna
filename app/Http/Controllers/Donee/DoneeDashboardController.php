<?php

namespace App\Http\Controllers\Donee;

use App\Http\Controllers\Controller;
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
        $donations = $user->donations()->select(['id', 'initiator_id', 'type', 'title', 'type_attributes', 'status'])->paginate(2);

        return Inertia::render('Donee/ActiveDonation', [
            'auth' => [
                'user' => $user,
                'roles' => $user->roleName()
            ],
            'data' => $donations
        ]);
    }
}
