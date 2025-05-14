<?php

namespace App\Http\Controllers;

use Midtrans\Snap;
use App\Models\Fund;
use Midtrans\Config;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller {
    // public function createTransaction(Request $request) {
    //     try {
    //         Config::$serverKey = config('services.midtrans.server_key');
    //         Config::$isProduction = config('services.midtrans.is_production');
    //         Config::$isSanitized = true;
    //         Config::$is3ds = true;

    //         $request->validate([
    //             'amount' => 'required|numeric|min:1000',
    //             'name' => 'required|string',
    //             'email' => 'required|email',
    //         ]);

    //         $params = [
    //             'transaction_details' => [
    //                 'order_id' => 'ORDER-' . uniqid(),
    //                 'gross_amount' => $request->amount,
    //             ],
    //             'customer_details' => [
    //                 'first_name' => $request->name,
    //                 'email' => $request->email,
    //             ],
    //         ];

    //         $snapToken = Snap::getSnapToken($params);

    //         return response()->json(['token' => $snapToken]);
    //     } catch (\Exception $e) {
    //         \Log::error('MidTrans Error: ' . $e->getMessage());
    //         return response()->json(['error' => 'Failed to create transaction'], 500);
    //     }
    // }

    /**
     * Show Snap UI Page.
     *
     * @return redirect
     */
    public function show(Fund $fund) {
        $user = Auth::user();
        if ($user->id !== $fund->donorDonation->donor->id) {
            Abort(403, 'Forbidden');
        }

        return redirect($fund->redirect_url);
    }

    /**
     *
     */
    public function finish(Request $request) {
        \Log::info("Request data: ", [$request->query()]);

        return redirect('/');
    }

    /**
     *
     */
    public function error(Request $request) {
        \Log::info("Request data: ", [$request->all()]);

        return redirect('/');
    }
}
