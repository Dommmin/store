<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
class ProductResource extends JsonResource
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
            'brand_id' => $this->brand_id,
            'category_id' => $this->category_id,
            'collection_id' => $this->collection_id,
            'brand' => $this->whenLoaded('brand', fn () => $this->brand),
            'name' => $this->name,
            'model' => $this->model,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'price' => $this->price,
            'formatted_price' => $this->whenHas('price', fn () => $this->formatted_price),
            'url' => $this->url,
            'images' => $this->images,
            'main_image' => $this->main_image,
            'sizes' => $this->whenLoaded('sizes', fn () => SizeResource::collection($this->sizes)) ?? [],
            'attributes' => $this->whenLoaded('attributes', fn () => app(ProductService::class)->transformAttributes($this->attributes)),
            'associations' => $this->whenLoaded('associations', function () {
                return $this->associations->groupBy('attribute.name')->map(fn ($item) => $item->map(function ($association) {
                    return [
                        'id' => $association->id,
                        'attribute' => $association->attribute,
                        'variant' => new VariantResource($association->variant),
                    ];
                }));
            }),
            'bookmark_id' => $this->when($request->user(), function () use ($request) {
                return $this->bookmark()
                    ->whereUserId($request->user()->id)
                    ->pluck('id')->first() ?? false;
            }),
            'review' => $this->when($request->user(), fn () => $this->review()->whereUserId($request->user()->id)->first() ?? false),
            'reviews_count' => $this->whenCounted('reviews', fn () => $this->reviews_count),
            'reviews_avg_rating' => $this->hasAttribute('reviews_avg_rating') && $this->reviews_avg_rating
                ? round((float) $this->reviews_avg_rating, 2)
                : 0,
        ];
    }
}
