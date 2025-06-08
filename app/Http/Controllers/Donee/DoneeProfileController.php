<?php

namespace App\Http\Controllers\Donee;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\User;


class DoneeProfileController extends Controller
{
    public function index()
    {
        // $user = User::where('type', 'App\\Models\\Donee')->first();
        $user = Auth::user();
        return Inertia::render('Donee/Profile', [
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
        $donee = Donee::findOrFail($request->user()->id);
        $donee->fill($request->validated());

        if ($donee->isDirty('email')) {
            $donee->email_verified_at = null;
        }

        $donee->save();

        return redirect()->route('donee.profile')->with('success', 'Profile updated successfully.');
    }
}