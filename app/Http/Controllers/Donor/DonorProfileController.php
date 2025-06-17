<?php

namespace App\Http\Controllers\Donor;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Donor;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;


class DonorProfileController extends Controller
{
    public function index()
    {
        // $user = User::where('type', 'App\\Models\\Donor')->first();
        $user = Auth::user();
        $doneeApplication = Auth::user()->doneeApplication()->latest()->first();
        $doneeApplicationStatus = $doneeApplication ? $doneeApplication->status : null;

        return Inertia::render('Donor/Profile', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
            'doneeApplicationStatus' => $doneeApplicationStatus,
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

    public function showRegisterForm() {
        $user = Auth::user();
        if ($user->roleName() !== 'donor') {
            abort(403, 'Forbidden');
        }

        $doneeApplication = Auth::user()->doneeApplication()->latest()->first();
        $doneeApplicationStatus = $doneeApplication ? $doneeApplication->status : null;



        return Inertia::render('Donor/DoneeRegister', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
            'doneeApplicationStatus' => $doneeApplicationStatus,
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }
    public function doneeRegister(Request $request)
{
    $user = Auth::user();

    // Validate input
    $validated = $request->validate([
        'full_name' => 'required|string|max:128',
        'phone_number' => 'required|string|max:32',
        'gender' => 'required|string|max:16',
        'date_of_birth' => 'required|date',
        'nik' => 'required|string|max:16',
        'id_card_image' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
        'address_detail' => 'required|string|max:255',
        'rt' => 'required|string|max:4',
        'rw' => 'required|string|max:4',
        'kelurahan' => 'required|string|max:64',
        'kecamatan' => 'required|string|max:64',
        'city' => 'required|string|max:64',
        'province' => 'required|string|max:64',
        'postal_code' => 'required|string|max:10',
    ]);

    // 1. Update or create user profile
    $userProfile = $user->userProfile ?: $user->userProfile()->firstOrNew([]);
    $userProfile->fill([
        'full_name' => $validated['full_name'],
        'phone_number' => $validated['phone_number'],
        'gender' => $validated['gender'],
        'date_of_birth' => $validated['date_of_birth'],
    ]);
    $userProfile->save();

    // 2. Update or create user identity
    $userIdentity = $user->userIdentity ?: $user->userIdentity()->firstOrNew([]);

    // Fill with validated data
    $userIdentity->fill([
        'nik' => $validated['nik'],
        'full_name' => $validated['full_name'],
    ]);

    // Handle file upload
    if ($request->hasFile('id_card_image')) {
        $path = $request->file('id_card_image')->store('id_cards', 'public');
        $userIdentity->id_card_image = $path;
    }

    $userIdentity->save();

    // 3. Update or create address
    $address = $userIdentity->address ?: $userIdentity->address()->firstOrNew([]);
    $address->fill([
        'address_detail' => $validated['address_detail'],
        'rt' => $validated['rt'],
        'rw' => $validated['rw'],
        'kelurahan' => $validated['kelurahan'],
        'kecamatan' => $validated['kecamatan'],
        'city' => $validated['city'],
        'province' => $validated['province'],
        'postal_code' => $validated['postal_code'],
    ]);
    $address->save();

    // 4. Create donee application
    $user->doneeApplication()->create();

    //Return but clear the form data
    return redirect()->route('donor.donee-register-form')
    ->with('success', 'Donee registration successful. Please wait for verification.')
    ->withInput([]);
    }


}
