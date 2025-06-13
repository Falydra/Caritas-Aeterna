<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SuperAdmin;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;

class ManageUserController extends Controller
{
   
    public function index()
    {

        if (Auth::user()->role() != SuperAdmin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        $users = User::where('type', 'App\\Models\\Admin')->paginate(10);

        $data = $users->getCollection()->map(function ($user) {
            return $user->toArray() + ['role' => $user->roleName()];
        });

        return Inertia::render('SuperAdmin/ManageUser', [
            'user' => [
                'data' => $data,
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
            ],
        ]);
    }

    public function showCreateForm(){
        if (Auth::user()->role() != SuperAdmin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        $user = Auth::user();

        return Inertia::render('SuperAdmin/CreateUserForm', [
            'user' => $user->toArray() + ['role' => $user->roleName()],
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
        
    }

    public function edit(Request $request)
    {

        if (Auth::user()->role() != SuperAdmin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('SuperAdmin/EditUser', [
            'user' => Admin::findOrFail($request->id)->toArray() + ['role' => Admin::findOrFail($request->id)->roleName()],
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
        ]);
    }

    public function update(Request $request, $id)
{
    $user = Admin::findOrFail($id);
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

    return redirect()->route('super-admin.manage-users.edit', ['id' => $user->id])->with('success', 'User updated!');
}

}