<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\BrandStoreRequest;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends ApiController
{
    public function index(Request $request)
    {
        $query = Brand::query()
            ->select(['id', 'name']);

        if ($request->filled('perPage')) {
            return $query->simplePaginate($request->input('perPage', 5))->withQueryString();
        }

        return $query->get();
    }

    public function store(BrandStoreRequest $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $brand = Brand::create($validated);

        return $this->ok('Brand created successfully.', $brand);
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $brand->update($validated);

        return $this->ok('Brand updated successfully.', $brand);
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();

        return $this->ok('Brand deleted successfully.');
    }
}
