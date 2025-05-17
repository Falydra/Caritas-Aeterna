<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\SuperAdmin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminCollection;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller {
    public function index() {
        if (Auth::user()->role() !== SuperAdmin::class) {
            abort(403, "You don't have permission to view this resources");
        }

        $users = Admin::all()->paginate(10);

        return (new AdminCollection($users))->additional([
            'status' => 'success',
            'message' => 'Lists admin retrieved successfully'
        ]);
    }

    public function create(Request $request) {
        if (Auth::user()->role() !== SuperAdmin::class) {
            abort(403, "You don't have permission to perform this action");
        }

        $validated = $request->validate([
            'username' => 'bail|required|string|max:50|unique:users,username',
            'email' => 'bail|required|string|unique:users,email',
            'password' => 'bail|required|string|min:8|confirmed'
        ]);

        $username = data_get($validated, 'username');
        $email = data_get($validated, 'email');
        $password = data_get($validated, 'password');

        DB::beginTransaction();

        try {
            $user = Admin::create([
                'username' => $username,
                'email' => $email,
                'password' => $password
            ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Admin created successfully');
    }

    public function destroy(Request $request) {
        if (Auth::user()->role() !== SuperAdmin::class) {
            abort(403, "You don't have permission to perform this action");
        }

        $validated = $request->validate([
            'id' => 'bail|required|int'
        ]);

        $id = data_get($validated, 'id');

        DB::beginTransaction();

        try {
            $admin = Admin::findOrFail($id);
            $admin->delete();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Admin deleted successfully');
    }
}
