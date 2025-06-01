<?php


namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Admin;


class AdminDashboardController extends Controller {
    public function index() {
         if (Auth::user()->role() != Admin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }
        return Inertia::Render('Admin/Dashboard',[
             'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }
}
