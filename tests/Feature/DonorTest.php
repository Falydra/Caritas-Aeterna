<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Donor;
use App\Models\Fundraiser;
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

    public function test_donor_donate_fund(): void {
        // $user = Donor::inRandomOrder()->first();
        $user = Donor::find(46);
        $user->markEmailAsVerified();

        $donation = Fundraiser::inRandomOrder()->first();

        $data = [
            'type' => $donation->type,
            'user_id' => $user->id,
            'donation_id' => $donation->id,
            'amount' => 5000 * random_int(2, 25),
            'note' => 'test buat fund'
        ];

        $response = $this->actingAs($user)->postJson(
            'donations/donate',
            ['data' => $data]
        );

        $response->assertStatus(200);
    }
}
