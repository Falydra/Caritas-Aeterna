<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Admin;

class ManageUsersController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        //Only Donor and Donee user fetched
        $users = User::whereIn('type', ['App\\Models\\Donor', 'App\\Models\\Donee'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $data = $users->getCollection()->map(function ($user) {
            return $user->toArray() + ['role' => $user->roleName()];
        });


        if (Auth::user()->role() != Admin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('Admin/ManageUsers', [
            'users' => [
                'data' => $data,
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
            ],
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }
}