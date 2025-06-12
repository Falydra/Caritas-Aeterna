<?php

namespace App\Http\Controllers\Donee;

use App\Enums\DoneeApplicationStatusEnum;
use App\Models\Admin;
use App\Models\Donor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\DoneeApplication;
use App\Services\DoneeApplicationService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
class DoneeApplicationController extends Controller {

    public function index(Request $request)
    {
        $authUser = Auth::user();

        if ($authUser->role() !== Admin::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'Forbidden',
                'message' => "You don't have permission to view these resources."
            ]);
        }

        $paginatedApplications = DoneeApplication::where('status', DoneeApplicationStatusEnum::PENDING->value)
            ->with(['applicant:id,username'])
            ->select('id', 'donor_id', 'status', 'reviewed_by', 'reviewed_at', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $applicationData = $paginatedApplications->getCollection()->map(function ($application) {
            $data = $application->toArray();

            if ($application->relationLoaded('applicant') && $application->applicant) {
                $data['donor_username'] = $application->applicant->username;
            } else {
                $data['donor_username'] = null;
            }
            return $data;
        });

        return Inertia::render('Admin/ManageApplication', [
            'applications' => [
                'data' => $applicationData,
                'current_page' => $paginatedApplications->currentPage(),
                'last_page' => $paginatedApplications->lastPage(),
                'per_page' => $paginatedApplications->perPage(),
                'total' => $paginatedApplications->total(),
                'next_page_url' => $paginatedApplications->nextPageUrl(),
                'prev_page_url' => $paginatedApplications->previousPageUrl(),
            ],
            'auth' => [
                'user' => $authUser->toArray() + ['role' => $authUser->roleName()],
                'roles' => $authUser->roleName(),
            ],
        ]);
    }

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

        // dd($authUser);
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
                DB::commit();
                return back()->with('success', 'Application accepted successfully');
            } elseif ($status === 'deny') {
                $application->deny($admin);
                DB::commit();
                return back()->with('success', 'Application denied successfully');
            }
            
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'database' => $e->getMessage()
            ]);
        }
    }

public function showUserDetail(int $userId): JsonResponse
    {
        try {
            // Eager load relationships to prevent N+1 queries
            // and ensure related data is available.
            $user = User::with([
                'userProfile',
                'userIdentity',
                'userIdentity.address' // Eager load address through userIdentity
            ])->findOrFail($userId); // findOrFail will throw 404 if not found

            // Prepare the data structure
            $userInfo = [
                // Core User Details
                'id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'type' => $user->type, // The actual class name, e.g., App\Models\User, App\Models\Admin
                'role_class' => $user->role(), // Same as 'type' in your current setup
                'role_name' => $user->roleName(), // e.g., "user", "admin"
                'is_admin' => $user->isAdmin(),
                'is_verified' => $user->isVerified(),
                'email_verified_at' => $user->email_verified_at?->toIso8601String(), // Format datetime
                'created_at' => $user->created_at?->toIso8601String(),
                'updated_at' => $user->updated_at?->toIso8601String(),

                // Helper booleans from User model methods
                'has_profile' => $user->hasProfile(),
                'has_identity' => $user->hasIdentity(),

                // User Profile (will be null if not present)
                'profile' => null,

                // User Identity (will be null if not present)
                'identity' => null,
            ];

            
            if ($user->userProfile) {
                $userInfo['profile'] = [
                    'full_name' => $user->userProfile->full_name,
                    'phone_number' => $user->userProfile->phone_number,
                    'date_of_birth' => $user->userProfile->date_of_birth?->toDateString(), // Format date
                    'gender' => $user->userProfile->gender,
                    'profile_picture' => $user->userProfile->profile_picture,
                    'last_updated' => $user->userProfile->last_updated?->toIso8601String(),
                ];
            }
            
            if ($user->userIdentity) {
                $userInfo['identity'] = [
                    'nik' => $user->userIdentity->nik,
                    'full_name' => $user->userIdentity->full_name, // Note: UserIdentity also has full_name
                    'id_card_image' => $user->userIdentity->id_card_image,
                    'verified_at' => $user->userIdentity->verified_at?->toIso8601String(),
                    // User Identity Address (will be null if not present)
                    'address' => null,
                ];
                
                
                if ($user->userIdentity->address) {
                    $userInfo['identity']['address'] = [
                        'address_detail' => $user->userIdentity->address->address_detail,
                        'rt' => $user->userIdentity->address->rt,
                        'rw' => $user->userIdentity->address->rw,
                        'kelurahan' => $user->userIdentity->address->kelurahan,
                        'kecamatan' => $user->userIdentity->address->kecamatan,
                        'city' => $user->userIdentity->address->city,
                        'province' => $user->userIdentity->address->province,
                        'postal_code' => $user->userIdentity->address->postal_code,
                        // Add any other fields from your Address model here
                    ];
                }
            }
            
            // dd($userInfo);
            return response()->json(['user_info' => $userInfo]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'User not found.'], 404);
        } catch (\Exception $e) {
            // Log the exception for debugging
            // Log::error('Error fetching user details: ' . $e->getMessage());
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

}
