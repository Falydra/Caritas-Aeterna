<?php

namespace App\Services;

use GuzzleHttp\Client;

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
}
