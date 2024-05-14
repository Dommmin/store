<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class VariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'url' => $this->url,
            'formatted_price' => $this->formattedPrice,
            'image' => $this->images[0] ?? null,
            'attributes' => $this->productAttributes->map(fn ($item) => ['name' => $item->attribute->name, 'value' => $item->value]),
        ];
    }
}
