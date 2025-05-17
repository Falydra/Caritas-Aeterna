<?php

namespace Tests\Feature\SuperAdmin;

use Tests\TestCase;
use App\Models\Admin;
use App\Models\Donor;
use App\Models\SuperAdmin;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SuperAdminDestroyAdminTest extends TestCase {
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function SuperAdminCanDeleteAdmin() {
        $superAdmin = SuperAdmin::create([
            'username' => 'superadmin',
            'email' => 'superadmin@example.com',
            'password' => 'admin',
        ]);

        $admin = Admin::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'admin',
        ]);

        $response = $this->actingAs($superAdmin)->post(route('admin.delete'), [
            'id' => $admin->id,
        ]);

        // Assert redirect and success message
        $response->assertRedirect();
        $response->assertSessionHas('success', 'Admin deleted successfully');

        // Assert the admin no longer exists in the database
        $this->assertDatabaseMissing('users', [
            'id' => $admin->id,
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function NonSuperAdminCanDeleteAdmin() {
        $user = Admin::create([
            'username' => 'user',
            'email' => 'user@example.com',
            'password' => 'admin',
        ]);

        $admin = Admin::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'admin',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.delete'), [
            'id' => $admin->id,
        ]);

        $response->assertForbidden();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function InvalidAdminIdTest() {
        $user = SuperAdmin::create([
            'username' => 'superadmin',
            'email' => 'superadmin@example.com',
            'password' => 'admin',
        ]);

        $response = $this->actingAs($user)->post(route('admin.delete'), [
            'id' => "not an integer",
        ]);

        $response->assertSessionHasErrors('id');
    }
}
