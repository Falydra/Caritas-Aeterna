<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Book;
use App\Models\Donor;
use App\Models\ProductDonation;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TestDonorDonateProduct extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_donor_donate_book(): void {
        $user = Donor::first();
        $user->markEmailAsVerified();
        $this->actingAs($user);

        $imgPath = storage_path('app\\public\\uploads\\test\\book_00.jpg');
        $packageImgFile = new UploadedFile(
            $imgPath,
            'book_00.jpg',
            'image/jpg',
            null,
            true
        );

        $resi = 'xxxx-xxxx-xxxx-xxxx';

        $donation = ProductDonation::first();
        $books = [
            [
                'isbn' => $donation->books->first()->isbn(),
                'amount' => 2
            ]
        ];

        $response = $this->postJson(
            '/donations/donate',
            ['data' => [
                'type' => ProductDonation::class, // App\Models\...
                'user_id' => $user->id, // int
                'donation_id' => $donation->id, //
                'package_picture' => $packageImgFile,
                'resi' => $resi,
                'products' => [
                    'books' => $books
                ]
            ]]
        );


        $response->assertRedirect();
        $response->assertSessionHas('message', 'success');
    }
}
