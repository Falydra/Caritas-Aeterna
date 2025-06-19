<?php

namespace App\Http\Controllers\Donee;

use App\Models\Fund;
use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use App\Models\Facility;
use App\Models\BookDonation;
use App\Models\DonationItem;
use Illuminate\Http\Request;
use App\Models\ProductDonation;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DoneeDashboardController extends Controller {
    public function index() {
        if (Auth::user()->role() != Donee::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resources.'
            ]);
        }

        return Inertia::render('Donee/Dashboard', [
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(),
            ],
            'donationStoreUrl' => route('donations.store'),

        ]);
    }

public function donationIndex()
    {
        $authenticatedUser = Auth::user();

        if ($authenticatedUser->role() !== Donee::class) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => "You do not have permission to access this resource."
            ]);
        }

        // Fetch paginated donations
        $donationsPaginator = $authenticatedUser->donations()
            ->select(['id', 'initiator_id', 'type', 'title', 'type_attributes', 'status'])
            ->paginate(10);

        $transformedDonationItems = $donationsPaginator->getCollection()->map(function ($donation) {
            return $donation->toArray();
        });

        // dd($authenticatedUser->toArray());
        return Inertia::render('Donee/ActiveDonation', [
            'auth' => [
                'user' => $authenticatedUser->toArray(),
                'roles' => $authenticatedUser->roleName()
            ],
            'donations' => [
                'data' => $transformedDonationItems,
                'current_page' => $donationsPaginator->currentPage(),
                'last_page' => $donationsPaginator->lastPage(),
                'per_page' => $donationsPaginator->perPage(),
                'total' => $donationsPaginator->total(),
                'next_page_url' => $donationsPaginator->nextPageUrl(),
                'prev_page_url' => $donationsPaginator->previousPageUrl(),
            ]
        ]);
    }

    public function donatedItems(Donation $donation) {
        $user = Auth::user();
        if ($user->role() !== Donee::class && $user->id !== $donation->initiator_id) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => "You do not have permission to access this resources."
            ]);
        }

        $donationData = Donation::select([
            'id',
            'initiator_id',
            'type',
            'type_attributes',
            'title'
        ])->find($donation->id);

        if ($donation->type() === ProductDonation::class) {
            $data = DonationItem::whereHas('donorDonation', function ($q) use ($donation) {
                $q->where('donation_id', $donation->id);
            })->with([
                'donorDonation.donor:id,username'
            ])->paginate(10);

            return Inertia::render('Donation/DonatedItemList', [
                'auth' => [
                    'user' => $user,
                    'roles' => $user->roleName()
                ],
                'data' => [
                    'donation' => $donationData,
                    'donation_item' => $data
                ],
            ]);
        } else {
            $data = Fund::where('status', 'finished')
            ->select([
                'id',
                'donation_id',
                'donor_donation_id',
                'amount',
                'status',
                'updated_at'
            ])->whereHas('donorDonation', function ($q) use ($donation) {
                $q->where('donation_id', $donation->id);
            })->with([
                'donorDonation:id,donor_id',
                'donorDonation.donor:id,username'
            ])->paginate(10);

            return Inertia::render('Donation/DonatedItemList', [
                'auth' => [
                    'user' => $user,
                    'roles' => $user->roleName()
                ],
                'data' => [
                    'donation' => $donationData,
                    'funds' => $data
                ]
            ]);
        }
    }
    public function donatedItemsTest(Donation $donation) {
        $user = Auth::user();
        if ($user->role() !== Donee::class && $user->id !== $donation->initiator_id) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => "You do not have permission to access this resources."
            ]);
        }

        $donationData = Donation::select([
            'id',
            'initiator_id',
            'type',
            'type_attributes',
            'title'
        ])->find($donation->id);

        if ($donation->type() === ProductDonation::class) {
            $data = DonationItem::whereHas('donorDonation', function ($q) use ($donation) {
                $q->where('donation_id', $donation->id);
            })->with([
                'donorDonation.donor:id,username'
            ])->paginate(10);

            return Inertia::render('Donation/Test', [
                'auth' => [
                    'user' => $user,
                    'roles' => $user->roleName()
                ],
                'data' => [
                    'donation' => $donationData,
                    'donation_item' => $data
                ],
            ]);
        } else {
            $data = Fund::where('status', 'finished')
            ->select([
                'id',
                'donation_id',
                'donor_donation_id',
                'amount',
                'status',
                'updated_at'
            ])->whereHas('donorDonation', function ($q) use ($donation) {
                $q->where('donation_id', $donation->id);
            })->with([
                'donorDonation:id,donor_id',
                'donorDonation.donor:id,username'
            ])->paginate(10);

            return Inertia::render('Donation/Test', [
                'auth' => [
                    'user' => $user,
                    'roles' => $user->roleName()
                ],
                'data' => [
                    'donation' => $donationData,
                    'funds' => $data
                ]
            ]);
        }
    }

}
