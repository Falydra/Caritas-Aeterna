<?php

namespace App\Http\Requests\Book;

use App\Models\Donee;
use Illuminate\Foundation\Http\FormRequest;

class BookStoreRequest extends FormRequest {
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
            'data.isbn' => 'bail|required|string|max:13',
            'data.title' => 'bail|required|string|max:255',
            'data.authors' => 'bail|required|array',
            'data.published_year' => 'bail|required|string|max:4',
            'data.synopsis' => 'bail|nullable|string|max:1024',
            'data.cover_image' => 'bail|nullable|mimes:jpg,jpeg,png,webp|max:2048',
            'data.price' => 'bail|nullable|integer|min:0|max:4294967295',
        ];
    }
}
