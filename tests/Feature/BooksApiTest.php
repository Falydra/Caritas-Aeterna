<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Donee;
use Intervention\Image\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BooksApiTest extends TestCase {
    /**
     * A basic feature test example.
     */
    public function test_can_create_book(): void {
        $user = Donee::first();
        $user->markEmailAsVerified();

        $img_name = 'book_02.jpg';
        $img_path = storage_path('app\\public\\uploads\\test\\' . $img_name);
        Storage::copy('public/uploads/test/' . $img_name, 'public/uploads/test/book_cover.jpg');
        $file = new UploadedFile(
            $img_path,
            $img_name,
            'image/jpg',
            null,
            true
        );

        $payload = [
            'isbn' => '9786237351956',
            'title' => 'At Night, I Become A Person',
            'authors' => [
                '0' => 'Yoru Sumino',
                '1' => 'Some Name'
            ],
            'published_year' => '2022',
            'synopsis' => '"Mana sosokmu yang sebenarnya? Yang malam, atau yang siang?"',
            'price' => 106000,
            'cover_image' => $file
        ];

        $response = $this->actingAs($user)->postJson(
            'books',
            [
                'data' => $payload
            ]
        );

        $response->assertStatus(302);
    }

    public function test_batch_create_book(): void {
        $user = Donee::first();

        $books = [
            'Ferris Wheel at Night',
            'At Night I Become a Monster',
            'Blue, Painful and Brittle',
            'Confessions',
            'Penance'
        ];

        $bookAuthors = [
            'Minato Kanae',
            'Sumino Yoru',
            'Sumino Yoru',
            'Minato Kanae',
            'Minato Kanae'
        ];

        for ($i = 0; $i < 5; $i++) {
            $isbn = fake()->isbn13();
            $title = $books[$i];
            $authors = array();
            // for ($j = 0; $j < random_int(1, 3); $j++) {
            //     $authors[$j] = fake()->name();
            // }
            $authors[0] = $bookAuthors[$i];
            $publishedYear = (string) fake()->year();
            $synopsis = fake()->paragraph(5);
            $price = fake()->numberBetween(75000, 110000);

            // generate image
            $imageName = "book_0{$i}.jpg";
            $imagePath = storage_path('app\\public\\uploads\\test\\' . $imageName);
            Storage::copy('public/uploads/test/' . $imageName, 'public/uploads/test/book_cover.jpg');

            $file = new UploadedFile(
                $imagePath,
                "cover_{$i}.jpg",
                "image/jpeg",
                null,
                true
            );

            $payload = [
                'isbn' => $isbn,
                'title' => $title,
                'authors' => $authors,
                'published_year' => $publishedYear,
                'synopsis' => $synopsis,
                'price' => $price,
                'cover_image' => $file,
            ];

            $response = $this->actingAs($user)->postJson('books', ['data' => $payload]);
            $response->assertStatus(302);

            // Assert book exists in DB
            $this->assertDatabaseHas('books', [
                'isbn' => $isbn,
                'title' => $title,
                'published_year' => $publishedYear,
                'price' => $price,
            ]);
        }
    }
}
