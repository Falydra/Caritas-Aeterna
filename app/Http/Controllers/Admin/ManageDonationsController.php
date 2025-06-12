<?php


namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Admin;


use App\Models\Donee;
use App\Models\Donation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

 class ManageDonationsController extends Controller {
    public function index() {
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
                'message' => 'You do not have permission to access this resource.'
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

    public function edit(Request $request) {
        $user = Auth::user();
        if ($user->role() !== Admin::class && $user->role() !== Donee::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resource.'
            ]);
        }

        $donation = Donation::findOrFail($request->id);
        if ($user->role() === Donee::class && $user->id !== $donation->initiator_id) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resource.'
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

    public function update(Request $request, $id) {
        $donation = Donation::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'header_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'text_description' => 'nullable|string',
            'image_description' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'target_amount' => 'required|numeric',

        ]);
        $donation->title = $validated['title'];
        $donation->text_descriptions = $validated['description'];
        $donation->type_attributes = array_merge($donation->type_attributes ?? [], [
            'target_amount' => $validated['target_amount'],
        ]);
        $donation->save();

        return redirect()->route('admin.manage-donations.edit', ['id' => $donation->id])->with('success', 'Donation updated!');
    }
}
