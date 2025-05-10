<?php

namespace App\Http\Controllers\Donor;

use App\Exceptions\DonateOwnDonationException;
use App\Exceptions\InvalidUserTypeException;
use App\Exceptions\UnverifiedUserException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Donor\DonorDonateRequest;
use App\Models\Fundraiser;
use App\Models\ProductDonation;
use App\Services\DonationService;
use Exception;
use Illuminate\Http\Request;

class DonorController extends Controller {
    public function donate(DonorDonateRequest $request, DonationService $service) {
        $typeValidated = $request->validate([
            'data.type' => 'bail|required|string'
        ]);
        $type = data_get($typeValidated, 'data.type');

        if ($type === ProductDonation::class) {
            return app(DonorController::class)->donateProduct($request, $service);
        } else if ($type === Fundraiser::class) {
            return app(DonorController::class)->donateFund($request, $service);
        }

        abort(500, "No such type as {$type}");
    }

    public function donateFund(DonorDonateRequest $request, DonationService $service) {
        try {
            $fund = $service->donateFund($request->validated());
        } catch (UnverifiedUserException $e) {
            abort(403, $e->getMessage());
        } catch (DonateOwnDonationException $e) {
            abort(403, $e->getMessage());
        } catch (InvalidUserTypeException $e) {
            abort(403, $e->getMessage());
        } catch (Exception $e) {
            abort(500, $e->getMessage());
        }

        return redirect($fund->redirect_url);
    }

    public function donateProduct(DonorDonateRequest $request, DonationService $service) {
        try {
            $service->donateProduct($request->validated());
        } catch (UnverifiedUserException $e) {
            abort(403, $e->getMessage());
        } catch (DonateOwnDonationException $e) {
            abort(403, $e->getMessage());
        } catch (InvalidUserTypeException $e) {
            abort(403, $e->getMessage());
        } catch (Exception $e) {
            abort(500, $e->getMessage());
        }

        return back()->with(['message' => 'success']);
    }
}
