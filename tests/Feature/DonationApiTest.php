<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Donee;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DonationApiTest extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_can_creae_donation_as_donee(): void {
        $user = Donee::first();

        $response = $this->actingAs($user)->postJson(
            'donations',
            [
                'data' => [
                    'type' => 'fundraiser',
                    'title' => 'donasi untuk emi',
                    'description' => 'bantu emi untuk mendapatkan uang guna membeli au premium buna x wowo',
                    'header_image' => ''

                ]
            ]
        );

        $response->assertStatus(200);
    }
}
