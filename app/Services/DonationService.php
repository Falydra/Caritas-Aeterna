<?php

namespace App\Services;

use App\Models\Book;
use App\Models\Donee;
use App\Models\Donor;
use Illuminate\Support\Str;
use App\Models\BookDonation;
use App\Models\DonationItem;
use App\Models\DonorDonation;
use App\Models\ProductDonation;
use Illuminate\Http\UploadedFile;
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

        $donorDonation = $this->attachProductDonationToDonor($user, $donation);

        $books = data_get($donationData, 'data.products.books');
        if (isset($books)) {
        }

        $facilities = data_get($donationData, 'data.products.facilities');
        if (isset($facilities)) {
        }
    }

    protected function createDonationItem(DonorDonation $donation, array $donationData): DonationItem {
        $donationTitle = Str::of($donation->donation->title)->snake();
        
        $donationItem = $donation->donationItem()->create([]);

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
