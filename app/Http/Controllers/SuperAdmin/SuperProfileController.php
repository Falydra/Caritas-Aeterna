<?php

namespace App\Http\Controllers\SuperAdmin;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;


use Inertia\Inertia;
use App\Models\SuperAdmin;
use App\Models\User;


class SuperProfileController extends Controller
{
    public function index()
    {
        $user = User::where('type', 'App\\Models\\SuperAdmin')->first();
        return Inertia::render('SuperAdmin/Profile', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
        ]);
    }

        public function update(ProfileUpdateRequest $request)
    {
        $superAdmin = SuperAdmin::findOrFail($request->user()->id);
        $superAdmin->fill($request->validated());

        if ($superAdmin->isDirty('email')) {
            $superAdmin->email_verified_at = null;
        }

        $superAdmin->save();

        return redirect()->route('super-admin.profile')->with('success', 'Profile updated successfully.');
    }
}