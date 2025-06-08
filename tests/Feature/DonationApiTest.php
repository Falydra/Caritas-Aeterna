<?php

namespace Tests\Feature;

use App\Enums\DonationStatusEnum;
use Tests\TestCase;
use App\Models\Book;
use App\Models\Admin;
use App\Models\Donee;
use App\Models\Donation;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DonationApiTest extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_can_create_product_donation_as_donee(): void {
        $user = Donee::first();
        $user->markEmailAsVerified();

        $title = Str::of(fake()->sentence(random_int(4, 6)))->replace('.', '');
        $books = $this->populateBooksField();
        $facilities = $this->populateFacilitiesField();
        $product_amount = count($books) + count($facilities);

        $data = $this->generateDonation(
            'product_donation',
            $title,
            $product_amount
        );

        $data['products'] = [
            'books' => $books,
            'facilities' => $facilities
        ];

        $response = $this->actingAs($user)->postJson(
            'donations',
            ['data' => $data]
        );
        $response->assertStatus(302);
        $this->assertDatabaseHas('donations', [
            'title' => $title,
        ]);
    }

    public function test_create_product_donation_with_book(): void {
        $user = Donee::inRandomOrder()->first();

        $title = Str::of(fake()->sentence(random_int(4, 6)))->replace('.', '');

        $books = $this->populateBooksField();
        $product_amount = count($books);

        $data = $this->generateDonation(
            'product_donation',
            $title,
            $product_amount
        );

        $data['products'] = [
            'books' => $books
        ];

        $response = $this->actingAs($user)->postJson(
            'donations',
            ['data' => $data]
        );

        $response->assertStatus(302);
        $this->assertDatabaseHas('donations', [
            'title' => $title,
        ]);
    }

    public function test_create_product_donation_with_facility(): void {
        $user = Donee::inRandomOrder()->first();

        $title = Str::of(fake()->sentence(random_int(4, 6)))->replace('.', '');

        $facilities = $this->populateFacilitiesField();
        $product_amount = count($facilities);

        $data = $this->generateDonation(
            'product_donation',
            $title,
            $product_amount
        );

        $data['products'] = [
            'facilities' => $facilities
        ];

        $response = $this->actingAs($user)->postJson(
            'donations',
            ['data' => $data]
        );

        $response->assertStatus(302);
        $this->assertDatabaseHas('donations', [
            'title' => $title,
        ]);
    }

    public function test_create_fundraiser(): void {
        $user = Donee::inRandomOrder()->first();
        $user->markEmailAsVerified();

        $title = Str::of(fake()->sentence(random_int(3, 4)))->replace('.', '');
        $target = 720000;

        $data = $this->generateDonation(
            'fundraiser',
            $title,
            $target
        );

        $response = $this->actingAs($user)->postJson(
            'donations',
            ['data' => $data]
        );

        $response->assertStatus(302);
        $this->assertDatabaseHas('donations', [
            'title' => $title,
        ]);
    }

    protected function startDonation($admin, $donation): void {
        $donation->setOnProgress($admin);

        $this->assertDatabaseHas('donations', [
            'id' => $donation->id,
            'status' => DonationStatusEnum::ON_PROGRESS->value,
            'reviewed_by' => $admin->id
        ]);
    }

    public function test_batch_start_donation(): void {
        $donations = Donation::all();
        $admin = Admin::first();

        foreach ($donations as $donation) {
            $this->startDonation($admin, $donation);
        }
    }

    private function populateBooksField() {
        $books = array();
        for ($i = 0; $i < random_int(2, 10); $i++) {
            $isbn = Book::inRandomOrder()->first()->isbn;
            $amount = random_int(1, 5);
            $books[$i] = [
                'isbn' => $isbn,
                'amount' => $amount
            ];
        }

        return $books;
    }

    private function populateFacilitiesField() {
        $facilities = array();
        for ($i = 0; $i < random_int(1, 10); $i++) {
            $facilities[$i] = [
                'name' => Str::of(fake()->sentence(random_int(2, 5)))->replace('.', ''),
                'description' => fake()->sentence(random_int(5, 6)),
                'dimension' => random_int(1, 4) . 'm x ' . random_int(1, 4) . 'm',
                'material' => fake()->word(),
                'price' => random_int(50000, 150000),
                'amount' => random_int(1, 5)
            ];
        }

        return $facilities;
    }

    private function generateDonation(string $type, string $title, int $attr_amount) {
        $header_name = 'header_0' . random_int(1, 4) . '.png';
        $header_path = storage_path('app\\public\\uploads\\test\\' . $header_name);
        $header_file = new UploadedFile(
            $header_path,
            $header_name,
            'image/png',
            null,
            true
        );

        $text_descriptions = array();
        $images = array();
        for ($i = 0; $i < random_int(1, 9); $i++) {
            if ($i === 0) {
                $text_descriptions["{$i}"] = fake()->sentence(random_int(75, 120));
                $image_name = 'desc_0' . random_int(1, 6) . '.png';
                $images["{$i}"] = $image_name;

                continue;
            }

            $dice = random_int(0, 1);
            if ($dice === 0) {
                $text_descriptions["{$i}"] = fake()->sentence(random_int(75, 120));
            } else {
                $image_name = 'desc_0' . random_int(1, 6) . '.png';
                $images["{$i}"] = $image_name;
            }
        }

        $image_descriptions = [];
        if (count($images) > 0) {
            $this->populateImageDescriptions($images, $image_descriptions);
        }

        if ($type === 'product_donation') {
            $attr = [
                "product_amount" => $attr_amount,
                "fulfilled_product_amount" => 0
            ];
        } else {
            $attr = [
                "target_fund" => $attr_amount,
                "current_fund" => 0,
                "product_amount" => 0,
                "fulfilled_product_amount" => 0
            ];
        }

        $data = [
            "type" => $type,
            "title" => $title,
            "type_attributes" => $attr,
            "header_image" => $header_file,
            "text_descriptions" => $text_descriptions,
            "image_descriptions" => $image_descriptions ?? [],
        ];
        return $data;
    }

    private function populateImageDescriptions(array $images, array &$image_descriptions) {
        foreach ($images as $index => $name) {
            $img_path = storage_path('app\\public\\uploads\\test\\' . $name);
            $img_file = new UploadedFile(
                $img_path,
                $name,
                'image/jpg',
                null,
                true
            );
            $image_descriptions += [$index => $img_file];
        }
    }
}
