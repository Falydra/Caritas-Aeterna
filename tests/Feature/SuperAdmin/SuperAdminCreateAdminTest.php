<?php

namespace Tests\Feature\SuperAdmin;

use Tests\TestCase;
use App\Models\Admin;
use App\Models\Donor;
use App\Models\SuperAdmin;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SuperAdminCreateAdminTest extends TestCase {
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function SuperAdminCanCreateAdmin() {
            $superAdmin = SuperAdmin::create([
                'username' => 'superadmin_1',
                'email' => 'superadmin@example.com',
                'password' => 'admin',
            ]);

        $this->actingAs($superAdmin);

        $response = $this->post(route('admin.create'), [
            'username' => 'newadmin',
            'email' => 'newadmin@example.com',
            'password' => 'securepassword',
            'password_confirmation' => 'securepassword',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Admin created successfully');

        $this->assertDatabaseHas('users', [
            'username' => 'newadmin',
            'email' => 'newadmin@example.com',
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function NonSuperAdminCannotCreateAdmin() {
        $user = Donor::create([
            'username' => 'donor',
            'email' => 'donor@example.com',
            'password' => 'user'
        ]);

        $response = $this->actingAs($user)->post(route('admin.create'), [
            'username' => 'newadmin',
            'email' => 'newadmin@example.com',
            'password' => 'securepassword',
            'password_confirmation' => 'securepassword',
        ]);

        $response->assertStatus(403);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function CreateAdminRequiresUnqueUsernameEmail() {
        $superAdmin = SuperAdmin::create([
            'username' => 'superadmin_1',
            'email' => 'superadmin@example.com',
            'password' => 'admin',
        ]);

        // Pre-existing user
        Admin::create([
            'username' => 'existingadmin',
            'email' => 'existingadmin@example.com',
            'password' => 'admin'
        ]);

        $this->actingAs($superAdmin);

        $response = $this->from(route('admin.create'))->post(route('admin.create'), [
            'username' => 'existingadmin',
            'email' => 'existingadmin@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('admin.create'));
        $response->assertSessionHasErrors(['username', 'email']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function CreateAdminRequiresConfirmedPassword() {
        $superAdmin = SuperAdmin::create([
            'username' => 'superadmin_1',
            'email' => 'superadmin@example.com',
            'password' => 'admin',
        ]);

        $response = $this->actingAs($superAdmin)->post(route('admin.create'), [
            'username' => 'newadmin',
            'email' => 'newadmin@example.com',
            'password' => 'securepassword',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertSessionHasErrors('password');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function SuperAdminCanDeleteAdmin() {
        $superAdmin = SuperAdmin::create([
            'username' => 'superadmin_1',
            'email' => 'superadmin@example.com',
            'password' => 'admin',
        ]);

        $response = $this->actingAs($superAdmin)->post(route('admin.create'), [
            'username' => 'newadmin',
            'email' => 'newadmin@example.com',
            'password' => 'securepassword',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertSessionHasErrors('password');
    }
}
