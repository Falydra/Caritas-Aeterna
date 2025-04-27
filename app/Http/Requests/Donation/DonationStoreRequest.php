<?php

namespace App\Http\Requests\Donation;

use App\Models\Donee;
use Illuminate\Foundation\Http\FormRequest;

class DonationStoreRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return $this->user()?->role() === Donee::class;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'data.type' => "bail|required",
            'data.title' => "bail|required|string|unique:donations,title|max:255",
            'data.header_image' => "bail|required|image|mimes:jpg,jpeg,png,webp|max:4096",
            'data.text_descriptions' => "required|array",
            'data.image_descriptions' => "required|array",
            'data.image_descriptions.*' => "image|mimes:jpg,png,webp|max:4096",
            'data.type_attributes' => "bail|required|array",
        ];
    }
}
