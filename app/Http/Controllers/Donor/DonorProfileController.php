<?php

namespace App\Http\Controllers\Donor;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;
use App\Models\Donor;
use App\Models\User;


class DonorProfileController extends Controller
{
    public function index()
    {
        // $user = User::where('type', 'App\\Models\\Donor')->first();
        $user = Auth::user();
        return Inertia::render('Donor/Profile', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function update(ProfileUpdateRequest $request)
    {
        $donor = Donor::findOrFail($request->user()->id);
        $donor->fill($request->validated());

        if ($donor->isDirty('email')) {
            $donor->email_verified_at = null;
        }

        $donor->save();

        return redirect()->route('donor.profile')->with('success', 'Profile updated successfully.');
    }

}