<?php

namespace App\Http\Controllers\Donor;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Donor;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\ImageService;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;


class DonorProfileController extends Controller {
    public function index() {
        // $user = User::where('type', 'App\\Models\\Donor')->first();
        $user = Auth::user();
        $user->loadMissing('userProfile');
        $doneeApplication = Auth::user()->doneeApplication()->latest()->first();
        $doneeApplicationStatus = $doneeApplication ? $doneeApplication->status : null;
        $userProfile = $user->userProfile;

        // dd($userProfile);
        return Inertia::render('Donor/Profile', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
            'userProfile' => $userProfile ? $userProfile->toArray() : null,
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

    public function update(ProfileUpdateRequest $request) {
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

        $user->loadMissing('userProfile');
        $doneeApplication = Auth::user()->doneeApplication()->latest()->first();
        $doneeApplicationStatus = $doneeApplication ? $doneeApplication->status : null;
        $userProfile = $user->userProfile;



        return Inertia::render('Donor/DoneeRegister', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
            'userProfile' => $userProfile ? $userProfile->toArray() : null,
            'doneeApplicationStatus' => $doneeApplicationStatus,
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }
    public function doneeRegister(Request $request, ImageService $service) {
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
            'last_updated' => Carbon::now()
        ]);

        // dd($userProfile);
        $userProfile->save();

        // 2. Update or create user identity
        $userIdentity = $user->userIdentity ?: $user->userIdentity()->firstOrNew([]);

        // Handle file upload
        $identityImagePath = '';
        $storePath = 'image/identities/';
        if ($request->hasFile('id_card_image')) {
            $service->storeImage(
                Str::slug($userProfile->full_name),
                $request->file('id_card_image'),
                $storePath,
                $identityImagePath
            );
        }
        // Fill with validated data
        $userIdentity->fill([
            'nik' => $validated['nik'],
            'full_name' => $validated['full_name'],
            'id_card_image' => $identityImagePath
        ]);
        $userIdentity->save();

        // 3. Update or create address
        $address = $userIdentity->address()->create([
            'user_identity_id' => $userIdentity->id,
            'address_detail' => $validated['address_detail'],
            'rt' => $validated['rt'],
            'rw' => $validated['rw'],
            'kelurahan' => $validated['kelurahan'],
            'kecamatan' => $validated['kecamatan'],
            'city' => $validated['city'],
            'province' => $validated['province'],
            'postal_code' => $validated['postal_code'],
        ]);

        // 4. Create donee application
        $user->doneeApplication()->create();

        //Return but clear the form data
        return redirect()->route('donor.donee-register-form')
            ->with('success', 'Donee registration successful. Please wait for verification.')
            ->withInput([]);
    }

    public function createuserProfile(Request $request) {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
        ]);

        $user = $request->user();

        $user->userProfile()->create($validated);

        return back()->with('success', 'Profil berhasil dibuat.');
    }

    public function updateUserProfile(Request $request) {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
        ]);

        $user = $request->user();

        $profile = $user->userProfile;

        if (!$profile) {
            return back()->with('error', 'Profil tidak ditemukan.');
        }

        $profile->update($validated);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function verify(Request $request) {
        $user = Auth::user();
        $user->update([
            'email_verified_at' => Carbon::now()
        ]);

        return redirect(route("donor.dashboard"));
    }
}
