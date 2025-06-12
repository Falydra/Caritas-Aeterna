<?php


namespace App\Http\Controllers\Donor;

use App\Models\Donor;
use Inertia\Inertia;
use App\Models\Donation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DonationItem;
use App\Models\Fund;
use Illuminate\Support\Facades\Auth;

class DonorDashboardController extends Controller {
    public function index(Request $request) {
        if (Auth::user()->role() != Donor::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resources.'
            ]);
        }

        return Inertia::render('Donor/Dashboard', [
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
            'donations' => Donation::with('initiator:id,username')->get(),
        ]);
    }

    public function donationHistoryIndex() {
        if (Auth::user()->role() !== Donor::class) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resources.'
            ]);
        }

        $user = Auth::user();

        return Inertia::render('Donor/DonationHistory', [
            'auth' => [
                'user' => $user,
                'roles' => $user->roleName(),
            ]
        ]);
    }
};
