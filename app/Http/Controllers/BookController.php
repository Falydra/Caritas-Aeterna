<?php

namespace App\Http\Controllers;

use App\Http\Requests\Book\BookStoreRequest;
use App\Models\Book;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Donee;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\BookCollection;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller {
    public function index() {
        $books = Book::select(
            'title',
            'authors',
            'cover_image',
            'price'
        )->get()->sortBy('title');

        return (new BookCollection($books))->additional([
            'status' => 'success',
            'message' => 'Lists book retrieved successfully'
        ]);
    }

    public function create() {
        if (empty(Auth::user())) {
            return Inertia::render('Error', [
                'code' => '401',
                'status' => 'unauthorized',
                'message' => 'login dulu bray'
            ]);
        }

        if (Auth::user()->role() != Donee::class) {
            return Inertia::render('Error', [
                'code' => '403',
                'status' => 'forbidden',
                'message' => 'dih ogah, lu siapa coba'
            ]);
        }

        return Inertia::render('Book/Create', [
            'auth' => Auth::user(),
            'bookStoreUrl' => route('books.store')
        ]);
    }

    public function store(BookStoreRequest $request) {
        $validated = $request->validated();

        $isbn = $this->sanitizeTextInput(data_get($validated, 'data.isbn', ''));
        $title = $this->sanitizeTextInput(data_get($validated, 'data.title', ''));
        $authors = data_get($validated, 'data.authors', array());
        $publishedYear = $this->sanitizeTextInput(data_get($validated, 'data.published_year', ''));
        $synopsis = $this->sanitizeTextInput(data_get($validated, 'data.synopsis', null));
        $price = data_get($validated, 'data.price', null);

        $titleSlug = $isbn . '-' . Str::slug($title);

        // store cover image
        $coverImage = data_get($validated, 'data.cover_image');
        $coverImagePath = '';
        $this->storeImage(
            $titleSlug,
            $coverImage,
            $coverImagePath
        );
        // \Log::info("Cover Image Path: " . $coverImagePath);

        $book = Book::create([
            'isbn' => $isbn,
            'title' => $title,
            'authors' => $authors,
            'published_year' => $publishedYear,
            'synopsis' => $synopsis,
            'cover_image' => $coverImagePath,
            'price' => $price
        ]);

        return back()->with('success', 'Book added successfully');
    }

    protected function storeImage(
        string $title,
        UploadedFile $file,
        string &$filepath
    ) {
        $storePath = 'image/books/' . $title;
        $filename = $file->hashName();
        $path = $file->storeAs($storePath, $filename, 'public');
        $filepath = Storage::url($path);
    }

    protected function sanitizeTextInput(string $text): string {
        $text = strip_tags($text);
        $text = trim($text);
        $text = preg_replace('/\s+/', ' ', $text);
        return $text;
    }
}
