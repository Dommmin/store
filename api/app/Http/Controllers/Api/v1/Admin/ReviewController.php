<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\AdminReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends ApiController
{
    public function index(Request $request)
    {
        $query = Review::query()
            ->select(['id', 'title', 'user_id', 'product_id', 'created_at', 'approved'])
            ->with(['user:id,name,email,profile_photo_url', 'product:id,name,url,price,images']);

        if ($request->filled('perPage')) {
            $reviews = $query->simplePaginate($request->input('perPage', 5))->withQueryString();
        } else {
            $reviews = $query->get();
        }

        return AdminReviewResource::collection($reviews);
    }

    public function show(Review $review): void
    {
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return $this->ok('Review deleted successfully.');
    }

    public function approve(Review $review)
    {
        $review->update(['approved' => true]);

        return $this->ok('Review approved successfully.');
    }

    public function unapprove(Review $review)
    {
        $review->update(['approved' => false]);

        return $this->ok('Review unapproved successfully.');
    }
}
