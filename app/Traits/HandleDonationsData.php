<?php

namespace App\Traits;

use App\Models\Fundraiser;
use App\Models\ProductDonation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HandleDonationsData {
    protected function formatTypeAttributes(string &$type, array $target, array &$typeAttr) {
        if ($type === "fundraiser") {
            $type = Fundraiser::class;
            $typeAttr = [
                'target_fund' => $target['target_fund'],
                'current_fund' => 0,
                'product_amount' => $target['product_amount'],
                'fulfilled_product_amount' => 0
            ];
        }

        if ($type === "product_donation") {
            $type = ProductDonation::class;
            $typeAttr = [
                'product_amount' => $target['product_amount'],
                'fulfilled_product_amount' => 0
            ];
        }
    }

    protected function sanitizeTextInput(?string $text): ?string {
        if (is_null($text)) {
            return null;
        }

        $text = strip_tags($text);
        $text = trim($text);
        $text = preg_replace('/\s+/', ' ', $text);
        return $text;
    }
}
