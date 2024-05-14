<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Review
 */
class ReviewResource extends JsonResource
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
            'title' => $this->title,
            'body' => $this->body,
            'rating' => $this->rating,
            'image' => $this->image,
            'confirmed_purchase' => $this->confirmed_purchase,
            'created_at' => $this->created_at->diffForHumans(),
            'user' => new UserResource($this->user),
        ];
    }
}
