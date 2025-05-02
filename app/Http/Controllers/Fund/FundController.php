<?php

namespace App\Http\Controllers\Fund;

use Midtrans\Snap;
use App\Models\Fund;
use Midtrans\Config;
use GuzzleHttp\Client;
use Midtrans\Notification;
use Illuminate\Http\Request;
use App\Services\MidtransService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FundController extends Controller {
    /**
     * Make request global.
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;

    /**
     * Class constructor.
     *
     * @param \Illuminate\Http\Request $request User Request
     *
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
        // Set midtrans configuration
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is3ds');
    }

    /**
     * Show index page.
     *
     * @return \Illuminate\View\View
     */
    public function index() {
        $data['funds'] = Fund::orderBy('id', 'desc')->paginate(8);

        return view('fund', $data);
    }

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
     * Submit fund.
     *
     * @return array
     */
    public function submitFund(MidtransService $service) {
        $validator = Validator::make(request()->all(), [
            'donor_name'  => 'required',
            'donor_email' => 'required|email',
            'amount'      => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return [
                'status'  => 'error',
                'message' => $validator->errors()->first()
            ];
        }

        $response = [];
        DB::transaction(function()  {
            // Save donasi ke database
            $fund = Fund::create([
                'donor_name' => $this->request->donor_name,
                'donor_email' => $this->request->donor_email,
                'donation_type' => $this->request->donation_type,
                'amount' => floatval($this->request->amount),
                'note' => $this->request->note,
            ]);

            // Buat transaksi ke midtrans kemudian save snap tokennya.
            $payload = [
                'transaction_details' => [
                    'order_id'      => $fund->id,
                    'gross_amount'  => $fund->amount,
                ],
                'customer_details' => [
                    'first_name'    => $fund->donor_name,
                    'email'         => $fund->donor_email,
                    // 'phone'         => '08888888888',
                    // 'address'       => '',
                ],
                'item_details' => [
                    [
                        'id'       => $fund->donation_type,
                        'price'    => $fund->amount,
                        'quantity' => 1,
                        'name'     => ucwords(str_replace('_', ' ', $fund->donation_type))
                    ]
                ]
            ];

            $service = new MidtransService();
            $snapApiResponse = $service->snap($payload);

            $snapToken = $snapApiResponse['token'];
            $redirectUrl = $snapApiResponse['redirect_url'];

            $fund->snap_token = $snapToken;
            $fund->save();
            $fund->redirect_url = $redirectUrl;
            $fund->save();

            // give response snap token
            $response['snap_token'] = $snapToken;
            $response['redirect_url'] = $redirectUrl;
        });

        return response()->json($response);
    }

    /**
     * Midtrans notification handler.
     *
     * @param Request $request
     *
     * @return void
     */
    public function notificationHandler(Request $request) {
        $notif = new Notification();

        $transaction = $notif->transaction_status;
        $type = $notif->payment_type;
        $orderId = $notif->order_id;
        $fraud = $notif->fraud_status;
        $fund = Fund::findOrFail($orderId);

        if ($transaction == 'capture') {

            // For credit card transaction, we need to check whether transaction is challenge by FDS or not
            if ($type == 'credit_card') {

                if ($fraud == 'challenge') {
                    // TODO set payment status in merchant's database to 'Challenge by FDS'
                    // TODO merchant should decide whether this transaction is authorized or not in MAP
                    // $fund->addUpdate("Transaction order_id: " . $orderId ." is challenged by FDS");
                    $fund->setPending();
                } else {
                    // TODO set payment status in merchant's database to 'Success'
                    // $fund->addUpdate("Transaction order_id: " . $orderId ." successfully captured using " . $type);
                    $fund->setSuccess();
                }
            }
        } elseif ($transaction == 'settlement') {

            // TODO set payment status in merchant's database to 'Settlement'
            // $fund->addUpdate("Transaction order_id: " . $orderId ." successfully transfered using " . $type);
            $fund->setSuccess();
        } elseif ($transaction == 'pending') {

            // TODO set payment status in merchant's database to 'Pending'
            // $fund->addUpdate("Waiting customer to finish transaction order_id: " . $orderId . " using " . $type);
            $fund->setPending();
        } elseif ($transaction == 'deny') {

            // TODO set payment status in merchant's database to 'Failed'
            // $fund->addUpdate("Payment using " . $type . " for transaction order_id: " . $orderId . " is Failed.");
            $fund->setFailed();
        } elseif ($transaction == 'expire') {

            // TODO set payment status in merchant's database to 'expire'
            // $fund->addUpdate("Payment using " . $type . " for transaction order_id: " . $orderId . " is expired.");
            $fund->setExpired();
        } elseif ($transaction == 'cancel') {

            // TODO set payment status in merchant's database to 'Failed'
            // $fund->addUpdate("Payment using " . $type . " for transaction order_id: " . $orderId . " is canceled.");
            $fund->setFailed();
        }
    }

    /**
     *
     */
    public function finish(Request $request) {
        \Log::info("Request data: ", [$request->all()]);

        return redirect('/');
    }
}
