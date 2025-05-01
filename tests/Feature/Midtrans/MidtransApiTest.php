<?php

namespace Tests\Feature\Midtrans;

use Tests\TestCase;
use App\Models\Donor;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

class MidtransApiTest extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_submit_fund_as_donor(): void {
        $donor = Donor::inRandomOrder()->first();
        $donor->markEmailAsVerified();

        $payload = [
            'donor_name' => $donor->username,
            'donor_email' => $donor->email,
            'amount' => 40000,
            'donation_type' => 'donasi buku'
        ];
        Log::info('Payload: ', [$payload]);

        // $this->withoutMiddleware(VerifyCsrfToken::class);

        $response = $this->actingAs($donor)->postJson(
            '/api/fund/store',
            $payload
        );
        Log::info('Response: ', [$response->getContent()]);
        $response->assertStatus(200);
    }
}
