<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\DonationSeeder;
use App\Models\Admin;
use App\Enums\GenderEnum;
use Carbon\Carbon;


class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // $this->call([
        //     UserSeeder::class,
        //     // BookSeeder::class,
        //     DonationSeeder::class,
        // ]);
        $admin = Admin::create([
            'username' => 'admin2',
            'email' => 'admin2@example.com',
            'password' => 'admin',
        ]);
        $admin->userProfile()->create([
            'full_name' => 'administrator2',
            'phone_number' => '082100000002',
            'date_of_birth' => '2004-01-02',
            'gender' => GenderEnum::OTHER->value,
            'last_updated' => Carbon::now()
        ]);
    }
}
