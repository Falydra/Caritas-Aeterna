<?php

namespace App\Http\Controllers;

use App\Models\Fund;
use Inertia\Inertia;
use App\Models\Donor;
use App\Models\DonationItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class DonationHistoryController extends Controller {
    public function index(Request $request) {
        if (Auth::user()->role() !== Donor::class) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resources.'
            ]);
        }

        $user = Auth::user();
        $funds = $this->getFunds($user);
        $items = $this->getItems($user);

        $history = collect($funds)->merge($items)->sortByDesc('created_at')->values();

        $page = $request->get('page', 1);
        $perPage = 10;
        $offset = ($page - 1) * $perPage;

        $paginated = new LengthAwarePaginator(
            $history->slice($offset, $perPage)->values(),
            $history->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginated);
    }

    public function funds(Request $request) {
        if (Auth::user()->role() !== Donor::class) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbidden',
                'message' => 'You do not have permission to access this resources.'
            ]);
        }

        $user = Auth::user();
        $funds = $this->getFunds($user);

        $history = collect($funds)->sortByDesc('created_at')->values();

        $page = $request->get('page', 1);
        $perPage = 10;
        $offset = ($page - 1) * $perPage;

        $paginated = new LengthAwarePaginator(
            $history->slice($offset, $perPage)->values(),
            $history->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginated);
    }

    public function items(Request $request) {
        if (Auth::user()->role() !== Donor::class) {
            return Inertia::render('Error', [
                'code' => 403,
                'status' => 'forbiddend',
                'message' => 'You do not have permission to access this resources.'
            ]);
        }

        $user = Auth::user();
        $items = $this->getItems($user);

        $history = collect($items)->sortByDesc('created_at')->values();

        $page = $request->get('page', 1);
        $perPage = 10;
        $offset = ($page - 1) * $perPage;

        $paginated = new LengthAwarePaginator(
            $history->slice($offset, $perPage)->values(),
            $history->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginated);
    }

    protected function getFunds(User $user) {
        return Fund::whereHas('donorDonation', function ($q) use ($user) {
            $q->where('donor_id', $user->id);
        })->select([
            'id',
            'donor_donation_id',
            'amount',
            'status',
            'redirect_url',
            'created_at'
        ])->with([
            'donorDonation:id,donation_id',
            'donorDonation.donation:id,title'
        ])->get()->map(function ($q) {
            return $q->toArray() + ['type' => 'Funds'];
        });
    }

    protected function getItems(User $user) {
        return DonationItem::whereHas('donorDonation', function ($q) use ($user) {
            $q->where('donor_id', $user->id);
        })->select([
            'id',
            'donor_donation_id',
            'product_amount',
            'status',
            'created_at'
        ])->with([
            'donorDonation:id,donation_id',
            'donorDonation.donation:id,title'
        ])->get()->map(function ($q) {
            return $q->toArray() + [
                'type' => 'Products',
                'created_at' => optional($q->created_at)->translatedFormat('Y-m-d H:i:s')
            ];
        });
    }
}
