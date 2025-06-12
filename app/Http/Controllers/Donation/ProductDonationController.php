<?php

namespace App\Http\Controllers\Donation;

use Exception;
use Throwable;
use App\Models\Book;
use Inertia\Inertia;
use App\Models\Donee;
use App\Models\Donation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\ImageService;
use App\Models\ProductDonation;
use App\Services\DonationService;
use Illuminate\Support\Facades\DB;
use App\Traits\HandleDonationsData;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Query\Builder;
use App\Http\Resources\Donation\DonationCollection;
use App\Http\Requests\Donation\DonationStoreRequest;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;

class ProductDonationController extends Controller {
    use HandleDonationsData;

    public function index() {
        $donations = ProductDonation::select(
            'type',
            'type_attributes',
            'title',
            'header_image'
        )->whereNot(function (Builder $query) {
            $query->where('status', 'pending')->orWhere('status', 'denied');
        })->latest()->paginate(10);

        return (new DonationCollection($donations))->additional([
            'status' => 'success',
            'message' => 'Lists donation retrieved successfully'
        ]);
    }


    public function latest() {
        $donations = ProductDonation::select(
            'id',
            'initiator_id',
            'type',
            'type_attributes',
            'title',
            'header_image',
        )->with('initiator:id,username')
            ->whereNot(function (QueryBuilder $q) {
                $q->where('status', 'pending')->orWhere('status', 'denied');
            })->latest()->paginate(10);

        return (new DonationCollection($donations))->additional([
            'status' => 'success',
            'message' => 'Lists donation retrieved successfully'
        ]);
    }

    public function show(ProductDonation $donation) {
        
        $data = ProductDonation::with(
            'books',
            'facilities',
            'initiator:id,username'
        )->where('id', $donation->id)
            ->first();

        
        return Inertia::render('Donation/DonationDetail', [
            'donation' => $data,
            'auth' => [
                'user' => Auth::user(),
                'roles' => Auth::user()->roleName(), 
            ],
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
            'data.products' => "bail|required|array",

            // book validation
            'data.products.books' => "bail|nullable|array",
            'data.products.books.*.isbn' => "bail|required_with:data.products.books|exists:books,isbn",
            'data.products.books.*.amount' => "bail|required_with:data.products.books|integer|min:1|max:255",

            // facilities validation
            'data.products.facilities' => "bail|nullable|array",
            'data.products.facilities.*.name' => "bail|required_with:data.products.facilities|string|max:255",
            'data.products.facilities.*.description' => "bail|required_with:data.products.facilities|string|max:255",
            'data.products.facilities.*.dimension' => "bail|nullable|string|max:255",
            'data.products.facilities.*.material' => "bail|nullable|string|max:255",
            'data.products.facilities.*.price' => "bail|required_with:data.products.facilities|integer|min:0|max:4294967295",
            'data.products.facilities.*.amount' => "bail|required_with:data.products.facilities|integer|min:1|max:255"
        ]);

        DB::beginTransaction();

        try {
            // create the donation
            $donation = $this->storeDonation($request, $validated);

            // add target fund
            $targetFund = 0;
            $productAmount = 0;

            // attach books if any
            $books = data_get($additional, 'data.products.books');
            if (isset($books)) {
                foreach ($books as $book) {
                    $donation->books()->attach($book['isbn'], [
                        'amount' => $book['amount']
                    ]);
                    $targetFund += Book::find($book['isbn'])->price * $book['amount'];
                    $productAmount += $book['amount'];
                }
            }

            // create facilities if any
            $facilities = data_get($additional, 'data.products.facilities');
            if (isset($facilities)) {
                foreach ($facilities as $facility) {
                    // create facility
                    $donation->facilities()->create([
                        'name' => $this->sanitizeTextInput($facility['name']),
                        'description' => $this->sanitizeTextInput($facility['description']),
                        'dimension' => $this->sanitizeTextInput($facility['dimension'] ?? null),
                        'material' => $this->sanitizeTextInput($facility['material'] ?? null),
                        'price' => $facility['price'],
                        'amount' => $facility['amount']
                    ]);
                    $targetFund += $facility['price'];
                    $productAmount += $facility['amount'];
                }
            }

            $typeAttr = $donation->type_attributes;
            $typeAttr['target_fund'] = $targetFund;
            $typeAttr['product_amount'] = $productAmount;
            $donation->update([
                'type_attributes' => $typeAttr
            ]);

            DB::commit();

            return redirect()->route('donations.show', $donation->id);
        } catch (Throwable $e) {
            DB::rollBack();
            report($e);

            return back()->withErrors('Failed to create product donation');
        }
    }

    public function verify(Request $request, DonationService $service) {
        $authUser = Auth::user();
        if ($authUser->role() !== Donee::class) {
            abort(403, "You don't have permission to perform this action");
        }

        $validated = $request->validate([
            'donation_item_id' => 'bail|required|integer'
        ]);

        try {
            $service->verifyProductDonation([
                'user' => $authUser,
                'donation_item_id' => data_get($validated, 'donation_item_id')
            ]);
        } catch (Exception $e) {
            abort(500, $e->getMessage());
        }

        return back()->with('success', 'successfully verify the product');
    }

    public function finish(Request $request, DonationService $service) {
        $authUser = Auth::user();
        if ($authUser->role() !== Donee::class) {
            abort(403, "You don't have permission to perform this action");
        }

        $validated = $request->validate([
            'donation_item_id' => 'bail|required|integer'
        ]);

        try {
            $service->finishProductDonation([
                'user' => $authUser,
                'donation_item_id' => data_get($validated, 'donation_item_id')
            ]);
        } catch (Exception $e) {
            abort(500, $e->getMessage());
        }

        return back()->with('success', 'successfully accepts the product');
    }

    /**
     * Helper Methods
     */
    protected function storeDonation(Request $request, $validated): Donation {
        // get general data
        $title = $validated['data']['title'];
        $titleSlug = Str::slug($title);
        $descriptions = $validated['data']['text_descriptions'];
        $headerImage = $validated['data']['header_image'];

        // store header image
        $headerImagePath = '';
        $storePath = 'image/donations/' . $titleSlug;
        $service = new ImageService();
        $service->storeImage(
            $titleSlug,
            $headerImage,
            $storePath,
            $headerImagePath
        );

        // store image descriptions
        $images = $validated['data']['image_descriptions'];
        $imageDescriptions = array();
        foreach ($images as $index => $image) {
            $filePath = '';
            $service->storeImage(
                $titleSlug,
                $image,
                $storePath,
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

        return $donation;
    }

    public function getAllBooks(ProductDonation $donation) {
    }
}
