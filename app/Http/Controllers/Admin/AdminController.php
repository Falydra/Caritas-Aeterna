<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\SuperAdmin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminCollection;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller {
    public function index() {
        if (Auth::user()->type != SuperAdmin::class) {
            abort(403, "You don't have permission to view this resources");
        }

        $users = Admin::all()->paginate(10);

        return (new AdminCollection($users))->additional([
            'status' => 'success',
            'message' => 'Lists admin retrieved successfully'
        ]);
    }

    public function create(Request $request) {
        
    }
}
