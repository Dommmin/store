<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\ProductResource;
use App\Models\Association;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends ApiController
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $brand = $request->input('brand');
        $category = $request->input('category');
        $min_price = $request->input('min_price', 1) * 100;
        $max_price = $request->input('max_price', 10000) * 100;
        $perPage = $request->input('perPage', 20);

        $orderBy = $request->input('orderBy', 'id');
        $order = $request->input('order', 'desc');

        $products = Product::query()
            ->when($query, fn ($query) => $query->where('name', 'like', '%' . request('q') . '%'))
            ->when($brand, fn ($query) => $query->where('brand_id', $brand))
            ->when($category, fn ($query) => $query->where('category_id', $category))
            ->when($min_price, fn ($query) => $query->where('price', '>=', $min_price))
            ->when($max_price, fn ($query) => $query->where('price', '<=', $max_price))
            ->orderBy($orderBy, $order)
            ->simplePaginate($perPage)
            ->withQueryString();

        return ProductResource::collection($products);
    }

    public function show(Product $product)
    {
        $product->load([
            'sizes',
            'bookmark',
            'attributes.attribute',
            'associations.variant.productAttributes.attribute',
            'associations.attribute',
        ])
            ->loadCount('reviews')
            ->loadAvg('reviews', 'rating');

        return new ProductResource($product);
    }

    public function variants(Product $product)
    {
        $products = Association::query()
            ->where('product_id', $product->id)
            ->with(['variant.attributes.attribute'])
            ->with('variant', function ($query): void {
                $query->withCount('reviews')->withAvg('reviews', 'rating');
            })
            ->get()
            ->pluck('variant');

        return ProductResource::collection($products);
    }
}
