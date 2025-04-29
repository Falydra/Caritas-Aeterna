<?php

namespace App\Http\Controllers\Donor;

use App\Exceptions\DonateOwnDonationException;
use App\Exceptions\InvalidUserTypeException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Donor\DonorDonateRequest;
use App\Models\Fundraiser;
use App\Models\ProductDonation;
use App\Services\DonationService;
use Exception;
use Illuminate\Http\Request;

class DonorController extends Controller {
    public function donate(DonorDonateRequest $request, DonationService $service) {
        try {
            $typeValidated = $request->validate([
                'data.type' => 'bail|required|string'
            ]);
            $type = data_get($typeValidated, 'data.type');

            if ($type === ProductDonation::class) {
                $service->donateProduct($request->validated());
            } else if ($type === Fundraiser::class) {
                // call fundraiser service
            } else {
                abort(500, "No such type as {$type}");
            }
        } catch (DonateOwnDonationException $e) {
            abort(403, $e->getMessage());
        } catch (InvalidUserTypeException $e) {
            abort(403, $e->getMessage());
        } catch (Exception $e) {
            // \Log::alert($e->getMessage());
            abort(500, $e->getMessage());
        }

        return response()->json([
            'message' => 'success'
        ], 200);
    }
}
