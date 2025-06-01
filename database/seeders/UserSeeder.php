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
        $profile = $this->userProfile();
        $donor->userProfile()->create($profile);

        $donee = Donee::create([
            'username' => 'donee',
            'email' => 'donee@example.com',
            'password' => 'user',
        ]);
        $profile = $this->userProfile();
        $donee->userProfile()->create($profile);
        $donee_identity = $donee->userIdentity()->create($this->userIdentity($profile));
        $donee_identity->address()->create($this->address());

        $donee = Donee::create([
            'username' => 'donee_2',
            'email' => 'donee2@example.com',
            'password' => 'user',
        ]);
        $profile = $this->userProfile();
        $donee->userProfile()->create($profile);
        $donee_identity = $donee->userIdentity()->create($this->userIdentity($profile));
        $donee_identity->address()->create($this->address());

        for ($i = 0; $i < 50; $i++) {
            if ($i < 10) {
                $this->donee();
            }
            $this->donor();
        }
    }

    protected function donee() {
        $donee = Donee::create([
            'username' => fake()->userName(),
            'email' => fake()->safeEmail(),
            'password' => 'user'
        ]);
        $profile = $this->userProfile();
        $donee->userProfile()->create($profile);
        $donee_identity = $donee->userIdentity()->create($this->userIdentity($profile));
        $donee_identity->address()->create($this->address());
    }

    protected function donor() {
        $donor = Donor::create([
            'username' => fake()->userName(),
            'email' => fake()->safeEmail(),
            'password' => 'user'
        ]);
        $profile = $this->userProfile();
        $donor->userProfile()->create($profile);
    }

    protected function userProfile() {
        $seed = random_int(0, 1);
        $gender = $seed === 0 ? GenderEnum::MALE->value : GenderEnum::FEMALE->value;
        $data = [
            'full_name' => fake()->name($gender),
            'phone_number' => fake()->phoneNumber(),
            'date_of_birth' => fake()->date('dmY', '2004-12-31'),
            'gender' => $gender,
            'last_updated' => Carbon::now()
        ];

        return $data;
    }

    protected function userIdentity(array $profile) {
        $nik = fake()->randomNumber(6, true) . $profile['date_of_birth'] . fake()->randomNumber(2, true);
        $data = [
            'nik' => $nik,
            'full_name' => $profile['full_name'],
            'id_card_image' => '/' . $nik . '.jpg',
            'verified_at' => Carbon::now()
        ];

        return $data;
    }

    protected function address() {
        $data = [
            'address_detail' => fake()->address(),
            'rt' => '0' . fake()->randomNumber(2, true),
            'rw' => '00' . fake()->randomDigit(),
            'kelurahan' => fake()->word(),
            'kecamatan' => fake()->word(),
            'city' => fake()->city(),
            'province' => fake()->word(),
            'postal_code' => fake()->randomNumber(5, true)
        ];

        return $data;
    }
}
