<?php


namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;



class DashboardController extends Controller
{
    public function index()
    {

        $user = User::paginate(10)->through(function ($q) {
        return $q->toArray() + ['role' => $q->roleName()];
        });

        

       

        return Inertia::render('SuperAdmin/Dashboard', [
            'user' => $user,
         
           
        ]);
    }



}
