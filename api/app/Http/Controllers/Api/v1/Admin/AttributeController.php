<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\AttributeStoreRequest;
use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends ApiController
{
    public function index(Request $request)
    {
        $query = Attribute::query()
            ->select(['id', 'name']);

        if ($request->filled('perPage')) {
            return $query->simplePaginate($request->input('perPage', 5))->withQueryString();
        }

        return $query->get();
    }

    public function update(Attribute $attribute, AttributeStoreRequest $request)
    {
        $attribute->update($request->validated());

        return $this->ok('Attribute updated successfully', $attribute);
    }

    public function show(Attribute $attribute)
    {
        return $attribute;
    }

    public function store(AttributeStoreRequest $request)
    {
        $validated = $request->validated();

        $attribute = Attribute::create($validated);

        return $this->ok('Attribute created successfully', $attribute);
    }

    public function destroy(Attribute $attribute)
    {
        $attribute->delete();

        return $this->ok('Attribute deleted successfully.');
    }
}
