<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;

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

    public function edit(Request $request) {
        

        if (Auth::user()->role() != Admin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('Admin/EditUser', [
            'user' => User::findOrFail($request->id)->toArray() + ['role' => User::findOrFail($request->id)->roleName()],
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }

        public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'nullable|string|min:6',
        ]);
        $user->username = $validated['username'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }
        $user->save();

        return redirect()->route('admin.manage-users.edit', ['id' => $user->id])->with('success', 'User updated!');
    }

    public function destroy(Request $request) {
        if (Auth::user()->role() !== Admin::class) {
            abort(403, "You don't have permission to perform this action");
        }

        $validated = $request->validate([
            'id' => 'bail|required|int'
        ]);

        $id = data_get($validated, 'id');

        DB::beginTransaction();

        try {
            $user = User::findOrFail($id);
            $user->delete();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'database' => $e->getMessage()
            ]);
        }

        return back()->with('success', 'user deleted successfully');
    }
}