<?php

namespace Database\Seeders;

use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Admin;
use App\Enums\GenderEnum;
use App\Models\SuperAdmin;
use Illuminate\Database\Seeder;
use Database\Seeders\DonationSeeder;


class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // $this->call([
        //     UserSeeder::class,
        // ]);

        $admin = Admin::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'admin',
        ]);
        $admin->userProfile()->create([
            'full_name' => 'administrator2',
            'phone_number' => '082100000002',
            'date_of_birth' => '2004-01-02',
            'gender' => GenderEnum::OTHER->value,
            'last_updated' => Carbon::now()
        ]);

        $super_admin = SuperAdmin::create([
            'username' => 'super_admin',
            'email' => 'superadmin@example.com',
            'password' => 'admin',
            // 'type' => SuperAdmin::class
        ]);
        $super_admin->userProfile()->create([
            'full_name' => 'super administrator',
            'phone_number' => '082100000002',
            'date_of_birth' => '2000-01-01',
            'gender' => GenderEnum::OTHER->value,
            'last_updated' => Carbon::now()
        ]);

        User::query()->update(['email_verified_at' => now()]);
    }
}
