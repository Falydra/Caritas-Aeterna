<?php

namespace Tests\Feature\DoneeApplication;

use Carbon\Carbon;
use Tests\TestCase;
use App\Models\User;
use App\Models\Admin;
use App\Models\Donee;
use App\Models\Donor;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DoneeApplicationUpdateTest extends TestCase {
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function AdminAcceptApplication() {
        $user = Donor::create([
            'username' => 'donor',
            'email' => 'donor@example.com',
            'password' => 'user'
        ]);
        $user->markEmailAsVerified();

        $application = $user->doneeApplication()->create([
            'donor_id' => $user->id
        ]);

        $admin = Admin::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'admin'
        ]);

        $response = $this->actingAs($admin)->post(route('doneeapplication.update'), [
            'admin_id' => $admin->id,
            'application_id' => $application->id,
            'status' => 'accept'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Application accepted successfully');

        $this->assertDatabaseHas('users', [
            'username' => 'donor',
            'email' => 'donor@example.com',
            'type' => Donee::class
        ]);
    }
}
