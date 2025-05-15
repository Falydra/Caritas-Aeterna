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
use App\Models\ProductDonation;
use App\Services\ImageService;
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

        $service = new ImageService();
        $storePath = 'image/books/' . $titleSlug;
        $service->storeImage(
            $titleSlug,
            $coverImage,
            $storePath,
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

    public function search(Request $request) {
        $validated = $request->validate([
            'data.keyword' => 'bail|string'
        ]);

        $query = data_get($validated, 'data.keyword');
        if (isset($query)) {
            $query = $this->sanitizeTextInput($query);
        }

        $books = Book::query()
            ->when($query, function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                ->orWhere('authors', 'like', "%{$query}%")
                ->orWhere('synopsis', 'like', "%{$query}%");
            })
            ->latest()
            ->paginate(10);

        return (new BookCollection($books))->additional([
            'status' => 'success',
            'message' => 'Lists book retrieved successfully'
        ]);
    }

    /**
     * Helper Methods
     */
    protected function sanitizeTextInput(string $text): string {
        $text = strip_tags($text);
        $text = trim($text);
        $text = preg_replace('/\s+/', ' ', $text);
        return $text;
    }
}
