<?php

namespace App\Http\Controllers\Initiator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class DashboardController extends Controller
{
    public function index()
    {
        Inertia::Render('Initiator/Dashboard');
    }
}