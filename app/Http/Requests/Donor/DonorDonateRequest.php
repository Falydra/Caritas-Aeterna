<?php

namespace App\Http\Requests\Donor;

use App\Models\Donee;
use App\Models\Donor;
use App\Models\Fundraiser;
use App\Models\ProductDonation;
use Illuminate\Foundation\Http\FormRequest;

class DonorDonateRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return $this->user()?->role() === Donor::class || $this->user()?->role() === Donee::class;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        $type = $this->get('data')['type'];

        $rules = [
            'data.type' => 'bail|required|string',
            'data.user_id' => 'bail|required|integer|exists:users,id',
            'data.donation_id' => 'bail|required|integer|exists:donations,id',
        ];

        if ($type === ProductDonation::class) {
            $rules = [
                'data.type' => 'bail|required|string',
                'data.user_id' => 'bail|required|integer|exists:users,id',
                'data.donation_id' => 'bail|required|integer|exists:donations,id',

                // product donation validation
                'data.package_picture' => 'bail|required|image|mimes:jpg,jpeg,png,webp|max:4096',
                'data.resi' => 'bail|required|string|max:64',
                'data.products' => 'bail|required|array',

                // books validation
                'data.products.books' => 'nullable|array',
                'data.products.books.*.isbn' => 'bail|required_with:data.products.books|string|min:13|max:13|exists:books,isbn',
                'data.products.books.*.amount' => 'bail|required_with:data.products.books|integer|min:1|max:255',

                // facilities validation
                'data.products.facilities' => 'nullable|array',
                'data.products.facilities.*.id' => 'bail|required_with:data.products.facilities|integer|exists:facilities,id',
                'data.products.facilities.*.amount' => 'bail|required_with:data.products.facilities|integer|min:1|max:255',
            ];
        } elseif ($type === Fundraiser::class) {
            $rules = [
                'data.type' => 'bail|required|string',
                'data.user_id' => 'bail|required|integer|exists:users,id',
                'data.donation_id' => 'bail|required|integer|exists:donations,id',

                // additional fund validation
            ];
        }

        return $rules;
    }
}
