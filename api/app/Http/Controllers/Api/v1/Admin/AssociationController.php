<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\AssociationStoreRequest;
use App\Models\Association;
use App\Models\Product;
use Illuminate\Http\Request;

class AssociationController extends ApiController
{
    public function index(Product $product, Request $request)
    {
        $perPage = $request->input('perPage', 5);

        return $product
            ->associations()
            ->with('product', 'variant', 'attribute')
            ->simplePaginate($perPage)
            ->withQueryString();
    }

    public function store(Product $product, AssociationStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['product_id'] = $product->id;

        $association = Association::create($validated);

        return $this->ok('Association created', $association);
    }

    public function destroy(Association $association)
    {
        $association->delete();

        return $this->ok('Association deleted', $association);
    }
}
