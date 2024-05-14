<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\ApiController;
use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends ApiController
{
    public function __invoke(Request $request)
    {
        $query = $request->input('q', '');
        $brand = $request->input('brand');
        $category = $request->input('category');
        $min_price = $request->input('min_price', 1) * 100;
        $max_price = $request->input('max_price', 10000) * 100;

        $orderBy = $request->input('orderBy', 'id');
        $order = $request->input('order', 'asc');

        return Product::search($query, function ($meilisearch, $query, $options) use ($brand, $category, $min_price, $max_price) {
            $filters = [];

            if ($brand) {
                $filters[] = "brand_id = {$brand}";
            }

            if ($category) {
                $filters[] = "category_id = {$category}";
            }

            $filters[] = "price >= {$min_price}";
            $filters[] = "price <= {$max_price}";

            $filterString = implode(' AND ', $filters);

            $options['filter'] = $filterString;

            return $meilisearch->search($query, $options);
        })
            ->orderBy($orderBy, $order)
            ->simplePaginate(20)
            ->withQueryString();
    }
}
