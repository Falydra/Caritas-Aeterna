<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\User;

class ManageUserController extends Controller
{
   
    public function index()
    {
        $users = User::where('type', 'App\\Models\\Admin')->paginate(10);

        $data = $users->getCollection()->map(function ($user) {
            return $user->toArray() + ['role' => $user->roleName()];
        });

        return Inertia::render('SuperAdmin/ManageUser', [
            'user' => [
                'data' => $data,
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
            ],
        ]);
    }


    public function edit(Request $request)
    {
        return Inertia::render('SuperAdmin/EditUser', [
            'user' => Admin::findOrFail($request->id)->toArray() + ['role' => Admin::findOrFail($request->id)->roleName()],
        ]);
    }

}