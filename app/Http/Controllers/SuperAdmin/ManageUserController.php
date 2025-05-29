<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageUserController extends Controller
{
   
    public function index()
    {
        $user = User::paginate(10)->through(function ($user) {
            return $user->toArray() + ['role' => $user->roleName()];
        });

        return Inertia::render('SuperAdmin/ManageUser', [
            'user' => $user,
        ]);
    }


    public function edit(Request $request)
    {
        return Inertia::render('SuperAdmin/EditUser', [
            'user' => User::findOrFail($request->id)->toArray() + ['role' => User::findOrFail($request->id)->roleName()],
        ]);
    }

}