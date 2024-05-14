<?php

declare(strict_types=1);

namespace App\Services;

class ProductService
{
    public function transformAttributes($attributes)
    {
        return $attributes->groupBy('attribute_id')->map(fn ($attributesGroup) => [
            'id' => $attributesGroup->first()->attribute_id,
            'name' => $attributesGroup->first()->attribute->name,
            'value' => $attributesGroup->pluck('value')->join(', '),
            'description' => $attributesGroup->first()->attribute->description,
        ])->values();
    }
}
