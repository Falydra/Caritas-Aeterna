<?php

namespace App\Services;

use App\Exceptions\InvalidDonationTypeException;
use Exception;
use App\Models\Fund;
use GuzzleHttp\Client;
use App\Models\Fundraiser;
use Illuminate\Support\Facades\DB;

class MidtransService {
    /**
     * Get Transaction Snap Token.
     *
     * @return array
     */
    public function snap(array $payload) {
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $authString = base64_encode("{$serverKey}:");

        $client = new Client();
        $response = $client->post(env('MIDTRANS_SNAP_API_ENDPOINT'), [
            'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Authorization' => "Basic {$authString}",
                ],
            'body' => json_encode($payload)
        ]);

        $data = json_decode($response->getBody()->getContents(), true);

        return $data;
    }

    /**
     * Finish payment and update fund entry
     *
     * @return void
     */
    public function finishPayment(array $data): Fund {
        DB::beginTransaction();
        try {
            $orderId = data_get($data, 'order_id');
            $fund = Fund::where('order_id', $orderId)->first();
            $donation = $fund->donation;

            $typeAttr = $donation->type_attributes;
            $typeAttr['current_fund'] += $fund->amount;

            $donation->update([
                'type_attributes' => $typeAttr
            ]);
            $donation->save();

            $donation = $fund->donation;
            $targetFund = data_get($typeAttr, 'target_fund');
            $currentFund = data_get($typeAttr, 'current_fund');
            if ($currentFund > $targetFund) {
                $donation->update([
                    'status' => 'finished'
                ]);
                $donation->save();
            }

            $fund->update([
                'status' => 'finished'
            ]);
            $fund->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $fund;
    }
}
