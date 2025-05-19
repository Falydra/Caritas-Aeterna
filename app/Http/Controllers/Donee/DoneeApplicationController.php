<?php

namespace App\Http\Controllers\Donee;

use App\Enums\DoneeApplicationStatusEnum;
use App\Models\Admin;
use App\Models\Donor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\DoneeApplication;
use App\Services\DoneeApplicationService;
use Exception;
use Illuminate\Support\Facades\Auth;

class DoneeApplicationController extends Controller {
    public function create(Request $request) {
        $authUser = Auth::user();

        // if authenticated user is not donor, abort
        if ($authUser->role() !== Donor::class) {
            abort(403, "You don't have permission to perform this action");
        }

        $validated = $request->validate([
            'donor_id' => 'bail|required|integer',
        ]);

        $donorId = data_get($validated, 'donor_id');

        $user = Donor::findOrFail($donorId);

        // if authenticated user id is different from request user id
        if (!$user->matches($authUser)) {
            return back()->withErrors([
                'donor_id' => 'User ID mismatch'
            ]);
        }

        // if authenticated user doesn't have identity
        if (!$authUser->hasIdentity()) {
            return back()->withErrors([
                'missing_identity' => 'User must fill Identity Form first'
            ]); // or redirect to identity form
        }

        DB::beginTransaction();
        try {
            $application = $user->doneeApplication()->create();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'database' => $e->getMessage()
            ]);
        }

        return back()->with('success', 'Application submitted successfully');
    }

    public function update(Request $request, DoneeApplicationService $service) {
        $authUser = Auth::user();

        // if auth user is not admin, abort
        if ($authUser->role() !== Admin::class) {
            abort(403, "You don't have permission to view this resources");
        }

        $validated = $request->validate([
            'admin_id' => 'bail|required|integer',
            'application_id' => 'bail|required|integer',
            'status' => 'bail|required|string'
        ]);

        $adminId = data_get($validated, 'admin_id');
        $applicationId = data_get($validated, 'application_id');
        $status = data_get($validated, 'status');

        $admin = Admin::findOrFail($adminId);
        $application = DoneeApplication::findOrFail($applicationId);

        // if auth user id and request admin id mismatch, return back
        if (!$authUser->matches($admin)) {
            return back()->withErrors([
                'admin_id' => 'Admin ID mismatch'
            ]);
        }

        DB::beginTransaction();
        try {
            if ($status === 'accept') {
                $application->accept($admin);
                $service->acceptApplication($application);
                return back()->with('success', 'Application accepted successfully');
            } elseif ($status === 'deny') {
                $application->deny($admin);
                return back()->with('success', 'Application denied successfully');
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'database' => $e->getMessage()
            ]);
        }
    }
}
