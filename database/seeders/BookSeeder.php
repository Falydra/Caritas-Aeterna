<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Donee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class BookSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $user = Donee::first();

        for ($i = 0; $i < 5; $i++) {
            $isbn = fake()->isbn13();
            $title = fake()->sentence(4);
            $authors = array();
            for ($j = 0; $j < random_int(1, 3); $j++) {
                $authors[$j] = fake()->name();
            }
            $publishedYear = (string) fake()->year();
            $synopsis = fake()->paragraph(5);
            $price = fake()->numberBetween(75000, 300000);

            $book = Book::create([
                'isbn' => $isbn,
                'title' => "Buku {$i}",
                'authors' => $authors,
                'published_year' => $publishedYear,
                'synopsis' => $synopsis,
                'price' => $price,
                'cover_image' => "/storage/uploads/book/book_0{$i}.jpg",
            ]);
        }
    }
}
