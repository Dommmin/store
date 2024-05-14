<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\ReviewStoreRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends ApiController
{
    public function index(Product $product, Request $request)
    {
        $perPage = $request->input('perPage', 10);

        $reviews = Review::where('product_id', $product->id)
            ->with('user:id,name,profile_photo_url')
            ->latest('created_at')
            ->simplePaginate($perPage);

        return ReviewResource::collection($reviews);
    }

    public function store(ReviewStoreRequest $request, Product $product)
    {
        $validated = $request->validated();

        $validated['product_id'] = $product->id;
        $validated['user_id'] = $request->user()->id;

        $review = Review::create($validated);

        return $this->ok('Review posted successfully.', $review);
    }

    public function ratings(Product $product)
    {
        $ratings = array_fill(1, 5, 0);

        $reviews = Review::where('product_id', $product->id)
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')
            ->get();

        foreach ($reviews as $review) {
            $ratings[$review->rating] = $review->count;
        }

        krsort($ratings);

        return array_values($ratings);
    }
}
