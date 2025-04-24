<?php

namespace App\Http\Controllers\Donation;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProductDonation;
use App\Traits\HandleDonationsData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\DonationStoreRequest;
use Illuminate\Support\Facades\Auth;

class ProductDonationController extends Controller {
    use HandleDonationsData;

    public function index() {
        $donations = ProductDonation::select(
            'type',
            'type_attributes',
            'title',
            'header_image'
        )->latest()->paginate(10);
    }

    public function show(ProductDonation $donation) {
        return Inertia::render('Donation/Show', [
            'donation' => $donation
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

        return Inertia::render('Donation/Create', [
            'auth' => Auth::user(),
            'donationStoreUrl' => route('donations.store'),
        ]);
    }

    public function store(DonationStoreRequest $request) {
        $validated = $request->validated();
        $additional = $request->validate([
            // 'data.products' => "bail|required|array",
            // 'data.products.books' => "bail|required|array",
            // 'data.products.facilities' => "bail|required|array"
        ]);

        // get general data
        $title = $validated['data']['title'];
        $titleSnake = Str::snake($title);
        $descriptions = $validated['data']['text_descriptions'];
        $headerImage = $validated['data']['header_image'];

        // store header image
        $headerImagePath = '';
        $this->storeImage(
            $titleSnake,
            $headerImage,
            $headerImagePath
        );

        // store image descriptions
        $images = $validated['data']['image_descriptions'];
        $imageDescriptions = array();
        foreach ($images as $index => $image) {
            $filePath = '';
            $this->storeImage(
                $titleSnake,
                $image,
                $filePath
            );
            $imageDescriptions[$index] = $filePath;
        }

        // format type and attributes
        $type = $validated['data']['type'];
        $typeAttr = $validated['data']['type_attributes'];
        $this->formatTypeAttributes($type, $typeAttr, $typeAttr);

        $user = $request->user();
        $donation = $user->donations()->create([
            'type' => $type,
            'type_attributes' => $typeAttr,
            'title' => $title,
            'header_image' => $headerImagePath,
            'text_descriptions' => $descriptions,
            'image_descriptions' => $imageDescriptions
        ]);

        return redirect()->route('donations.show', $donation->id);
    }

    public function getAllBooks(ProductDonation $donation) {
    }
}
