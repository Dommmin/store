<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['required', 'exists:brands,id'],
            'model' => ['required', 'string'],
            //            'collection_id' => ['nullable', 'exists:collections,id'],
            'name' => ['required', 'string'],
            'short_description' => ['required', 'string', 'max:255', 'min:5'],
            'description' => ['nullable'],
            'price' => ['required'],
            'images' => ['required', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'attributes_values' => ['required', 'array'],
            'attributes_values.*' => ['required', 'string'],
        ];
    }
}
