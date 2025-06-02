<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;


use Inertia\Inertia;
use App\Models\Admin;
use App\Models\User;


class AdminProfileController extends Controller
{
    public function index()
    {
        $user = User::where('type', 'App\\Models\\Admin')->first();
        return Inertia::render('Admin/Profile', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
        ]);
    }

        public function update(ProfileUpdateRequest $request)
    {
        $Admin = Admin::findOrFail($request->user()->id);
        $Admin->fill($request->validated());

        if ($Admin->isDirty('email')) {
            $Admin->email_verified_at = null;
        }

        $Admin->save();

        return redirect()->route('admin.profile')->with('success', 'Profile updated successfully.');
    }
}