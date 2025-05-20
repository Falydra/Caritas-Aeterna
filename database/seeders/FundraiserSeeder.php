<?php

namespace Database\Seeders;

use App\Models\Donee;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FundraiserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        for ($i = 0; $i < 5; $i++) {
            $user = Donee::inRandomOrder()->first();

            $title = Str::of(fake()->sentence(random_int(3, 4)))->replace('.', '');
            $target = 720000;
        }
    }
}
