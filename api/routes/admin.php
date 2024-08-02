<?php

declare(strict_types=1);

use App\Http\Controllers\Api\v1\Admin;
use App\Http\Controllers\Api\v1\Admin\ImageController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('admin')->group(function (): void {
    Route::post('products/{product}/publish', [Admin\ProductController::class, 'publish']);
    Route::post('products/{product}/unpublish', [Admin\ProductController::class, 'unpublish']);

    Route::post('reviews/{review}/approve', [Admin\ReviewController::class, 'approve']);
    Route::post('reviews/{review}/unapprove', [Admin\ReviewController::class, 'unapprove']);

    Route::get('products/{product}/attributes', [Admin\ProductController::class, 'attributes']);
    Route::get('products/get-products-by-attributes', [Admin\ProductController::class, 'getProductsByTheirAttributes']);
    Route::post('images/bulk-insert', [ImageController::class, 'bulkInsert']);
    Route::apiResource('images', ImageController::class);
    Route::apiResource('brands', Admin\BrandController::class)->names([
        'index' => 'admin.brands.index',
        'store' => 'admin.brands.store',
        'show' => 'admin.brands.show',
        'update' => 'admin.brands.update',
        'destroy' => 'admin.brands.destroy',
    ]);
    Route::apiResource('collections', Admin\CollectionController::class)->names([
        'index' => 'admin.collections.index',
        'store' => 'admin.collections.store',
        'show' => 'admin.collections.show',
        'update' => 'admin.collections.update',
        'destroy' => 'admin.collections.destroy',
    ]);
    Route::apiResource('categories', Admin\CategoryController::class)->names([
        'index' => 'admin.categories.index',
        'store' => 'admin.categories.store',
        'show' => 'admin.categories.show',
        'update' => 'admin.categories.update',
        'destroy' => 'admin.categories.destroy',
    ]);

    Route::apiResource('products', Admin\ProductController::class)->names([
        'index' => 'admin.products.index',
        'store' => 'admin.products.store',
        'show' => 'admin.products.show',
        'update' => 'admin.products.update',
        'destroy' => 'admin.products.destroy',
    ]);
    Route::apiResource('attributes', Admin\AttributeController::class);
    Route::apiResource('attributes/{attribute}/attributeValues', Admin\AttributeValueController::class);
    Route::apiResource('orders', Admin\OrderController::class)->names([
        'index' => 'admin.orders.index',
        'store' => 'admin.orders.store',
        'show' => 'admin.orders.show',
        'update' => 'admin.orders.update',
        'destroy' => 'admin.orders.destroy',
    ]);
    Route::apiResource('products/{product}/associations', Admin\AssociationController::class);
    Route::apiResource('customers', Admin\CustomerController::class);
    Route::apiResource('reviews', Admin\ReviewController::class)->names([
        'index' => 'admin.reviews.index',
        'store' => 'admin.reviews.store',
        'show' => 'admin.reviews.show',
        'update' => 'admin.reviews.update',
        'destroy' => 'admin.reviews.destroy',
    ]);
});
