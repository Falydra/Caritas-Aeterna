<?php

namespace Database\Seeders;

use App\Models\Donee;
use App\Models\ProductDonation;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DonationSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        // $donee = Donee::first();
        // $donee->donations()->create([
        //     'type' => ProductDonation::class,
        //     'type_attributes' => [
        //         'product_amount' => 10,
        //         'fulfilled_product_amount' => 0,
        //     ],
        //     'title' => 'donasi anak durhaka',
        //     'description' => 'kami butuh bantuan buku siksa kubur untuk anak-anak durhaka',
        //     'header_image' => 'image.jpg',
        // ]);
    }
}
