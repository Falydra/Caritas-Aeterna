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

        public function update(Request $request, $id)
    {
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
