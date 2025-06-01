<?php


namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;


use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use Illuminate\Http\Request;

class ManageDonationsController extends Controller
{
   
    public function index()
    {
        $donations = Donation::with('initiator:id,username')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($donation) {
                return $donation->toArray() + ['initiator' => $donation->initiator->username];
            });

         if (Auth::user()->role() != Admin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('Admin/ManageDonations', [
            'donations' => $donations,
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }

    public function edit(Request $request)
    {
        $donation = Donation::findOrFail($request->id);

        if (Auth::user()->role() != Admin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('Admin/EditDonation', [
            'donation' => $donation->toArray() + ['initiator' => $donation->initiator->username],
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }
    
}