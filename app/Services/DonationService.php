<?php

namespace App\Services;

use Exception;
use App\Models\Book;
use App\Models\Donee;
use App\Models\Donor;
use Illuminate\Support\Str;
use App\Models\BookDonation;
use App\Models\DonationItem;
use App\Models\DonorDonation;
use App\Models\ProductDonation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\InvalidUserTypeException;
use App\Exceptions\DonateOwnDonationException;

class DonationService {
    public function donateProduct(array $donationData) {
        $userId = data_get($donationData, 'data.user_id');
        $donationId = data_get($donationData, 'data.donation_id');

        $user = Donor::find($userId);
        $donation = ProductDonation::find($donationId);

        if ($user->role() === Donee::class) {
            throw new InvalidUserTypeException('You are not allowed to perform to this action');
        }

        if ($user->id === $donation->initiator_id) {
            throw new DonateOwnDonationException('You are not allowed to donate to your own donation');
        }

        DB::beginTransaction();

        try {
            $donorDonation = $this->attachProductDonationToDonor($user, $donation);
            $donationItem = $this->createDonationItem(
                $donorDonation,
                $donationData
            );

            $books = data_get($donationData, 'data.products.books');
            if (isset($books)) {
                foreach ($books as $bookData) {
                    $this->createBookItemPivot(
                        $donation,
                        $donationItem,
                        $bookData
                    );
                }
            }

            $facilities = data_get($donationData, 'data.products.facilities');
            if (isset($facilities)) {
                foreach ($facilities as $facilityData) {
                    // TODO create method to handle facility pivot transaction
                }
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    protected function createBookItemPivot(
        ProductDonation $donation,
        DonationItem $donationItem,
        array $bookData
    ) {
        $isbn = data_get($bookData, 'isbn');
        $amount = data_get($bookData, 'amount');

        $book = BookDonation::where('donation_id', $donation->id)->where('isbn', $isbn)->first();
        $donationItem->books()->attach($book->isbn);

        // TODO: Handle BookDonation amount transaction
    }

    protected function createDonationItem(DonorDonation $donation, array $donationData): DonationItem {
        $donationTitle = Str::of($donation->donation->title)->snake();

        $packagePicture = data_get($donationData, 'data.package_picture');
        $packagePicturePath = '';
        $this->storeImage(
            $donationTitle,
            $packagePicture,
            $packagePicturePath
        );

        $resi = data_get($donationData, 'data.resi');

        $donationItem = $donation->donationItem()->create([
            'package_picture' => $packagePicturePath,
            'resi' => $resi,
        ]);

        return $donationItem;
    }

    protected function attachProductDonationToDonor(Donor $donor, ProductDonation $donation): DonorDonation {
        $pivot = $this->getDonorDonationPivot($donor, $donation);

        if (!isset($pivot)) {
            $donor->donations()->attach($donation->id);
            $pivot = $this->getDonorDonationPivot($donor, $donation);
        }

        return $pivot;
    }

    protected function getDonorDonationPivot(Donor $donor, ProductDonation $donation): ?DonorDonation {
        $pivot = DonorDonation::where('donor_id', $donor->id)
            ->where('donation_id', $donation->id)
            ->first();

        if (!isset($pivot)) {
            return null;
        }

        return $pivot;
    }

    protected function storeImage(
        string $title,
        UploadedFile $file,
        string &$filepath
    ) {
        $storePath = 'image/donations/' . $title . '/items';
        $filename = $file->hashName();
        $path = $file->storeAs($storePath, $filename, 'public');
        $filepath = Storage::url($path);
    }
}
