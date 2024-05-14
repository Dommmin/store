<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Size */
class SizeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stock = $this->pivot->stock;

        $value = match ($stock) {
            2, 3 => $this->value . ' - low in stock',
            1 => $this->value . ' - last in stock',
            0 => $this->value . ' - out of stock',
            default => $this->value,
        };

        return [
            'id' => $this->id,
            'value' => $value,
            'stock' => $stock,
        ];
    }
}
