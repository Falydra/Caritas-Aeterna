<?php

namespace App\Http\Controllers\Admin;

use Exception;
use App\Models\User;
use App\Models\Admin;
use App\Models\SuperAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\Admin\AdminCollection;

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

    public function put(Request $request) {
        if (Auth::user()->role() !== SuperAdmin::class) {
            abort(403, "You don't have permission to perform this action");
        }

        $validated = $request->validate([
            'id' => 'bail|required|int',
            'current_password' => 'bail|required|string|min:8',
            'new_password' => 'bail|required|string|min:8|confirmed'
        ]);

        $id = data_get($validated, 'id');
        $currentPassword = data_get($validated, 'current_password');
        $newPassword = data_get($validated, 'new_password');
        $admin = Admin::findOrFail($id);

        // check if current pw is correct
        if (!Hash::check($currentPassword, $admin->password)) {
            return back()->withErrors([
                'current_password' => 'Current password is incorrect'
            ]);
        }

        // check if new pw is same as current pw
        if (Hash::check($request->new_password, $admin->password)) {
            return back()->withErrors(['new_password' => 'New password cannot be the same as the current password']);
        }

        DB::beginTransaction();
        try {
            $admin->update([
                'password' => Hash::make($newPassword)
            ]);
            $admin->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', $admin->username . "'s password changed successfully");
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
