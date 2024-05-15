<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Order */
class OrderResource extends JsonResource
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
            'uuid' => $this->uuid,
            'total' => number_format($this->total / 100, 2, ',', '.'),
            'created_at' => $this->created_at->format('d M Y, H:i'),
            'stripe_checkout_session_id' => $this->stripe_checkout_session_id,
            'status' => $this->status,
            'items' => $this->whenLoaded('items', fn () => $this->items),
            'items_count' => $this->whenCounted('items', fn () => $this->items_count),
        ];
    }
}
