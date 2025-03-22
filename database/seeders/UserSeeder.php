<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('TestSuperAdmin1234'),
        ]);
        $superAdmin->roles()->attach(Role::where('name', 'super-admin')->first());

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('TestAdmin1234'),
        ]);
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        $donor = User::create([
            'name' => 'Donatur',
            'email' => 'donatur@example.com',
            'password' => Hash::make('Test1234'),
        ]);
        $donor->roles()->attach(Role::where('name', 'donor')->first());

        // test donee (inisiator)
        $donee = User::create([
            'name' => 'Inisiator',
            'email' => 'inisiator@example.com',
            'password' => Hash::make('Test1234'),
        ]);
        $donee->roles()->attach(Role::where('name', 'donee')->first());
    }
}
