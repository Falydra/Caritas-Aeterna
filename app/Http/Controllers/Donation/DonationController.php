<?php

namespace App\Http\Controllers\Donation;

use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use App\Models\Fundraiser;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Donation\DonationCollection;
use App\Models\ProductDonation;

class DonationController extends Controller {
    public function index() {
        $donations = Donation::select(
            'type', 'type_attributes', 'title', 'header_image'
        )->latest()->paginate(10);

        return (new DonationCollection($donations))->additional([
            'status' => 'success',
            'message' => 'Lists donation retrieved successfully'
        ]);
    }

    public function show(Donation $donation) {
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

    public function store(Request $request) {
        $user = $request->user();

        if (!$user || $user->role() !== Donee::class) {
            abort(403, 'dih ogah, lu siapa coba');
        }

        $validated = $request->validate([
            'data.type' => "bail|required",
            'data.title' => "bail|required|string|max:255",
            'data.header_image' => "bail|required|image|mimes:jpg,png,webp|max:4096",
            'data.text_descriptions' => "required|array",
            'data.image_descriptions' => "required|array",
            'data.image_descriptions.*' => "image|mimes:jpg,png,webp|max:4096",
            'data.type_attributes' => "required|array"
        ]);

        $title = $validated['data']['title'];
        $descriptions = $validated['data']['text_descriptions'];
        $type = $validated['data']['type'];
        $headerImage = $validated['data']['header_image'];

        // store the header image
        $file = $headerImage;
        $title_snake = Str::snake($title);
        $header_filename = $title_snake . '_header.' . $file->extension();
        $this->storeImage($file, $header_filename);
        $header_filename = '/storage/image/' . $header_filename;

        // store the image descriptions
        $images = $validated['data']['image_descriptions'];
        $image_descriptions = array();
        foreach ($images as $index => $image) {
            $filename = $title_snake . '_' . $index . '.' . $image->extension();
            $this->storeImage($image, $filename);
            $image_descriptions[$index] = '/storage/image/' . $filename;
        }

        $attr = $this->formatTypeAttributes($type, $validated['data']['type_attributes']);
        $type = $attr['type'];
        $type_attributes = $attr['type_attributes'];

        $donation = $user->donations()->create([
            'type' => $type,
            'type_attributes' => $type_attributes,
            'title' => $title,
            'header_image' => $header_filename,
            'text_descriptions' => $descriptions,
            'image_descriptions' => $image_descriptions
        ]);

        return redirect()->route('donations.show', $donation->id);
    }

    private function storeImage(UploadedFile $file, string $filename) {
        // get or create store directory
        $storePath = public_path('storage\image');
        if (!file_exists($storePath)) {
            mkdir($storePath, 0755, true);
        }

        // store the image
        $file->move($storePath, $filename);
    }

    private function formatTypeAttributes(string $type, array $target): array {
        if ($type === "fundraiser") {
            $data = [
                "type" => Fundraiser::class,
                "type_attributes" => [
                    'target_fund' => $target['target_fund'],
                    'current_fund' => 0
                ]
            ];
        } else {
            $data = [
                "type" => ProductDonation::class,
                "type_attributes" => [
                    'product_amount' => $target['product_amount'],
                    'fulfilled_product_amount' => 0
                ]
            ];
        }

        return $data;
    }
}
