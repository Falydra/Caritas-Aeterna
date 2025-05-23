<?php

namespace Tests\Feature;

use App\Models\ProductDonation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TestDoneeAcceptProductDonation extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_donee_verify_donation(): void {
        $donation = ProductDonation::first();
        $user = $donation->initiator;
        $this->actingAs($user);

        $donationItem = $donation->donorDonations->first()->donationItem;
        $response = $this->postJson(
            route('product.verify'),
            ['donation_item_id' => $donationItem->id]
        );

        $response->assertRedirect();
        $response->assertSessionHas('success', 'successfully verify the product');
    }

    public function test_donee_finish_donation(): void {
        $donation = ProductDonation::first();
        $user = $donation->initiator;
        $this->actingAs($user);

        $donationItem = $donation->donorDonations->first()->donationItem;
        $response = $this->postJson(
            route('product.finish'),
            ['donation_item_id' => $donationItem->id]
        );

        $response->assertRedirect();
        $response->assertSessionHas('success', 'successfully accepts the product');
    }
}
