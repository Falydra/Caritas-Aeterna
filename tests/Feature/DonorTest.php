<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Donor;
use App\Models\ProductDonation;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DonorTest extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_donor_donate_product(): void {
        $user = Donor::inRandomOrder()->first();
        $user->markEmailAsVerified();

        $donation = ProductDonation::inRandomOrder()->first();

        $data = [
            'type' => $donation->type,
            'user_id' => $user->id,
            'donation_id' => $donation->id,
            'products' => [
                
            ]
        ];

        $response = $this->actingAs($user)->postJson(
            'donations/donate',
            ['data' => $data]
        );

        $response->assertStatus(200);
    }
}
