<?php

namespace App\Http\Controllers\Donor;

use Exception;
use Inertia\Inertia;
use App\Models\Fundraiser;
use Illuminate\Http\Request;
use App\Models\ProductDonation;
use App\Services\DonationService;
use App\Http\Controllers\Controller;
use App\Exceptions\UnverifiedUserException;
use App\Exceptions\InvalidUserTypeException;
use App\Exceptions\DonateOwnDonationException;
use App\Http\Requests\Donor\DonorDonateRequest;

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
            dd($e->getMessage());
            abort(500, $e->getMessage());
        }

        // return redirect($fund->redirect_url);
        return Inertia::location($fund->redirect_url);
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
