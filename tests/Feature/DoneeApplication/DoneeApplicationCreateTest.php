<?php

namespace Tests\Feature\DoneeApplication;

use Carbon\Carbon;
use Tests\TestCase;
use App\Models\Donee;
use App\Models\Donor;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DoneeApplicationCreateTest extends TestCase {
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function DonorCreateApplication() {
        $donor = Donor::create([
            'username' => 'donor',
            'email' => 'donor@example.com',
            'password' => 'user'
        ]);
        $donor->markEmailAsVerified();

        $donor->userIdentity()->create([
            'nik' => '33xx01xx07xx00xx',
            'full_name' => 'donor',
            'id_card_image' => 'test.jpg',
            'verified_at' => Carbon::now()
        ]);

        $response = $this->actingAs($donor)->post(route('doneeapplication.create'), [
            'donor_id' => $donor->id
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Application submitted successfully');

        $this->assertDatabaseHas('donee_applications', [
            'donor_id' => $donor->id,
            'status' => 'pending'
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function NonDonorCreateApplication() {
        $user = Donee::create([
            'username' => 'donee',
            'email' => 'donee@example.com',
            'password' => 'user'
        ]);
        $user->markEmailAsVerified();

        $response = $this->actingAs($user)->post(route('doneeapplication.create'), [
            'donor_id' => $user->id
        ]);

        $response->assertStatus(403);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function DonorWithoutIdentityCreateApplication() {
        $donor = Donor::create([
            'username' => 'donor',
            'email' => 'donor@example.com',
            'password' => 'user'
        ]);
        $donor->markEmailAsVerified();

        $response = $this->actingAs($donor)->post(route('doneeapplication.create'), [
            'donor_id' => $donor->id
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('missing_identity');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function DonorMismatchIdCreateApplication() {
        $donor = Donor::create([
            'username' => 'donor',
            'email' => 'donor@example.com',
            'password' => 'user'
        ]);
        $donor->markEmailAsVerified();

        $donor2 = Donor::create([
            'username' => 'donor2',
            'email' => 'donor2@example.com',
            'password' => 'user'
        ]);
        $donor2->markEmailAsVerified();

        $response = $this->actingAs($donor)->post(route('doneeapplication.create'), [
            'donor_id' => $donor2->id
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('donor_id');
    }
}
