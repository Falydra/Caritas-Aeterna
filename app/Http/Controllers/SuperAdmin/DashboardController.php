<?php


namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;


class DashboardController extends Controller
{
    public function index()
    {

        $user = auth()->user();
        $role = $user? $user->roleName() : null;
        return Inertia::render('SuperAdmin/Dashboard', [
            'user' => $user,
            'roles' => $role
        ] );
    }
}
