<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Services\FileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends ApiController
{
    public function __construct(private readonly FileService $fileService)
    {
    }

    public function index(Request $request)
    {
        $sortBy = $request->input('sortBy', 'id');
        $sortOrder = $request->input('sortOrder', 'desc');
        $perPage = $request->input('perPage', 10);

        $query = Product::query()
            ->with(['category:id,name', 'brand:id,name', 'collection:id,name'])
            ->when($request->has('attribute'), function ($query) use ($request): void {
                $query->whereHas('attributes', function ($query) use ($request): void {
                    $query->where('attribute_id', $request->input('attribute'))
                        ->where('url', '!=', $request->get('product'));
                });
            })
            ->orderBy($sortBy, $sortOrder);

        if ($request->has('perPage')) {
            return $query->simplePaginate($perPage)->withQueryString();
        }

        return $query->get();
    }

    public function store(ProductStoreRequest $request)
    {
        $validated = $request->validated();
        unset($validated['attributes_values']);

        DB::transaction(function () use ($request, $validated): void {
            $files = $request->file('images');

            $directory = 'images/products';
            $images = $this->fileService->storeFiles($files, 'public', $directory);

            $validated['images'] = $images;

            $product = Product::create($validated);

            $attributes = [];

            Log::info('attributes', $request->attributes_values);

            foreach ($request->attributes_values as $id => $value) {
                $attributes[] = [
                    'product_id' => $product->id,
                    'attribute_id' => $id,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            ProductAttribute::insert($attributes);
        });

        return $this->ok('Product created successfully.');
    }

    public function update(Product $product, ProductStoreRequest $request)
    {
        $validated = $request->validated();
        unset($validated['attributes_values'], $validated['images']);

        DB::transaction(function () use ($request, $validated, $product): void {
            $this->fileService->deleteFiles($product->images);

            $files = $request->file('images');

            $directory = 'images/products';
            $images = $this->fileService->storeFiles($files, 'public', $directory);

            $validated['images'] = $images;

            $product->update($validated);

            ProductAttribute::whereProductId($product->id)->delete();

            $attributes = [];

            foreach ($request->attributes_values as $id => $value) {
                $attributes[] = [
                    'product_id' => $product->id,
                    'attribute_id' => $id,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            ProductAttribute::insert($attributes);
        });

        return $this->ok('Product updated successfully.');
    }

    public function show(Product $product)
    {
        $product->load([
            'sizes',
            'attributes.attribute',
        ]);

        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        $this->fileService->deleteFiles($product->images, 'minio');

        return $this->ok('Product deleted successfully.');
    }

    public function publish(Product $product)
    {
        $product->update(['is_published' => true]);

        return $this->ok('Product published successfully.');
    }

    public function unpublish(Product $product)
    {
        $product->update(['is_published' => false]);

        return $this->ok('Product unpublished successfully.');
    }

    public function attributes(Product $product)
    {
        return $product
            ->attributes()
            ->with('attribute')
            ->get();
    }
}
