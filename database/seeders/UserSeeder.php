<?php

namespace Database\Seeders;

use App\Enums\GenderEnum;
use App\Models\User;
use App\Models\SuperAdmin;
use App\Models\Admin;
use App\Models\Donor;
use App\Models\Donee;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $admin = Admin::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => 'admin',
        ]);
        $admin->userProfile()->create([
            'full_name' => 'administrator',
            'phone_number' => '082100000001',
            'date_of_birth' => '2004-01-01',
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

        $donor = Donor::create([
            'username' => 'donor',
            'email' => 'donor@example.com',
            'password' => 'user',
            // 'type' => Donor::class
        ]);
        $donor->userProfile()->create([
            'full_name' => 'orang baik #1',
            'phone_number' => '082100000003',
            'date_of_birth' => '2002-01-01',
            'gender' => GenderEnum::OTHER->value,
            'last_updated' => Carbon::now()
        ]);

        $donee = Donee::create([
            'username' => 'donee',
            'email' => 'donee@example.com',
            'password' => 'user',
            // 'type' => Donee::class
        ]);
        $donee->userProfile()->create([
            'full_name' => 'orang #1',
            'phone_number' => '082100000004',
            'date_of_birth' => '1998-01-01',
            'gender' => GenderEnum::OTHER->value,
            'last_updated' => Carbon::now()
        ]);
        $donee_identity = $donee->userIdentity()->create([
            'nik' => '3374010101980001',
            'full_name' => 'orang #1',
            'id_card_image' => '3374010101980001.jpg',
            'verified_at' => Carbon::now()
        ]);
        $donee_identity->address()->create([
            'address_detail' => 'jl hidup bersamamu 1a',
            'rt' => '001',
            'rw' => '001',
            'kelurahan' => 'zona nyaman',
            'kecamatan' => 'hidup aman',
            'city' => 'perasaanmu',
            'province' => 'hatimu',
            'postal_code' => '00001'
        ]);

        $donee = Donee::create([
            'username' => 'donee_2',
            'email' => 'donee2@example.com',
            'password' => 'user',
            // 'type' => Donee::class
        ]);
        $donee->userProfile()->create([
            'full_name' => 'orang #2',
            'phone_number' => '082100000005',
            'date_of_birth' => '1998-01-01',
            'gender' => GenderEnum::OTHER->value,
            'last_updated' => Carbon::now()
        ]);
        $donee_identity = $donee->userIdentity()->create([
            'nik' => '3374010101980001',
            'full_name' => 'orang #2',
            'id_card_image' => '3374010101980002.jpg',
            'verified_at' => Carbon::now()
        ]);
        $donee_identity->address()->create([
            'address_detail' => 'jl hidup bersamamu 7a',
            'rt' => '001',
            'rw' => '001',
            'kelurahan' => 'zona nyaman',
            'kecamatan' => 'hidup aman',
            'city' => 'perasaanmu',
            'province' => 'hatimu',
            'postal_code' => '00001'
        ]);
    }
}
