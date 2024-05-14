<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\AttributeValueStoreRequest;
use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;

class AttributeValueController extends ApiController
{
    public function index(Attribute $attribute, Request $request)
    {
        $perPage = $request->get('perPage', 5);

        $query = AttributeValue::query()
            ->select(['id', 'name'])
            ->where('attribute_id', $attribute->id);

        if ($request->has('perPage')) {
            return $query->simplePaginate($perPage)->withQueryString();
        }

        return $query->get();
    }

    public function show(Attribute $attribute, AttributeValue $attributeValue)
    {
        return $attributeValue;
    }

    public function store(Attribute $attribute, AttributeValueStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['attribute_id'] = $attribute->id;

        $attributeValue = AttributeValue::create($validated);

        return $this->ok('Attribute value created successfully', $attributeValue);
    }

    public function update(Attribute $attribute, AttributeValue $attributeValue, AttributeValueStoreRequest $request)
    {
        $attributeValue->update($request->validated());

        return $this->ok('Attribute value updated successfully', $attributeValue);
    }

    public function destroy(Attribute $attribute, AttributeValue $attributeValue)
    {
        $attributeValue->delete();

        return $this->ok('Attribute value deleted successfully');
    }
}
