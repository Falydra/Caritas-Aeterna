<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Inertia\Inertia;


class DonationDetailController extends Controller {
    public function index($id) {
        $donation = Donation::with('initiator:id,username')->findOrFail($id);

        return Inertia::render('Donation/DonationDetail', [
            'donation' => $donation,
        ]);
    }
}
