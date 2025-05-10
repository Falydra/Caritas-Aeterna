<?php

namespace App\Http\Controllers\Donee;

use Inertia\Inertia;
use App\Models\Donee;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class InitController extends Controller {
    public function index() {
        if (Auth::user()->role() != Donee::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('Donee/Init', [
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }
}
