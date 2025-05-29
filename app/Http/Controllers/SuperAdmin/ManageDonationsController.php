<?php


namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageDonationsController extends Controller
{
    /**
     * Display a listing of the donations.
     */
    public function index()
    {
        $donations = Donation::with('initiator:id,username')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($donation) {
                return $donation->toArray() + ['initiator' => $donation->initiator->username];
            });

        return Inertia::render('SuperAdmin/ManageDonations', [
            'donations' => $donations,
        ]);
    }
    /**
     * Show the form for creating a new donation.
     */
}