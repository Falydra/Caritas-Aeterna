<?php

namespace App\Http\Controllers\Donation;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Donation\DonationCollection;
use App\Models\Fundraiser;

class DonationController extends Controller {
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

    public function store(Request $request) {
        /*{
            "data" : {
                "type" : string,
                "title" : string,
                "description" : text,
                "header_image" : string,
                "class_attributes" : {
                    "amount" : int,
                    "items" : [products]
                }
            },
        }*/
        
        $user = $request->user();

        if (!$user || $user->role() !== Donee::class) {
            abort(403, 'dih ogah, lu siapa coba');
        }

        $validatedData = $request->validate([
            'title' => "bail|required|string|max:255",
            'description' => "bail|required|max:2048",
            'type' => "bail|required",
            'header_image' => "string"
        ]);

        if ($request->type === Fundraiser::class) {
            $donation = $user->donations()->create([

            ]);
        }

        return redirect()->route('welcome');
    }

    public function index() {
        $donations = Donation::latest()->paginate(10);

        return (new DonationCollection($donations))->additional([
            'status' => 'success',
            'message' => 'Lists donation retrieved successfully'
        ]);
    }
}
