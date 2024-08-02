<?php

declare(strict_types=1);

use App\Http\Controllers\Api\v1\BookmarkController;
use App\Http\Controllers\Api\v1\BrandController;
use App\Http\Controllers\Api\v1\CartController;
use App\Http\Controllers\Api\v1\CategoryController;
use App\Http\Controllers\Api\v1\CollectionController;
use App\Http\Controllers\Api\v1\OrderController;
use App\Http\Controllers\Api\v1\PaymentController;
use App\Http\Controllers\Api\v1\ProductController;
use App\Http\Controllers\Api\v1\ReviewController;
use App\Http\Controllers\Api\v1\SearchController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Hello Api';
});

include __DIR__ . '/admin.php';
include __DIR__ . '/auth.php';

Route::get('search', SearchController::class);

Route::post('cart-items/increment', [CartController::class, 'incrementQuantity']);
Route::post('cart-items/decrement', [CartController::class, 'decrementQuantity']);
Route::post('cart-items/remove', [CartController::class, 'remove']);
Route::get('cart-items/count', [CartController::class, 'count']);
Route::get('cart-items/total', [CartController::class, 'totalPrice']);
Route::get('bookmarks/count', [BookmarkController::class, 'count']);

Route::middleware('verified')->group(function (): void {
    Route::post('checkout', [PaymentController::class, 'checkout']);
    Route::post('confirmation', [PaymentController::class, 'confirmation']);
    Route::apiResource('orders', OrderController::class)->names([
        'index' => 'public.orders.index',
        'store' => 'public.orders.store',
        'show' => 'public.orders.show',
        'update' => 'public.orders.update',
        'destroy' => 'public.orders.destroy',
    ]);
});

Route::get('products/{product}/variants', [ProductController::class, 'variants']);
Route::get('products/{product}/ratings', [ReviewController::class, 'ratings']);
Route::apiResource('products', ProductController::class)->names([
    'index' => 'public.products.index',
    'store' => 'public.products.store',
    'show' => 'public.products.show',
    'update' => 'public.products.update',
    'destroy' => 'public.products.destroy',
]);
Route::apiResource('cart-items', CartController::class)->only('index', 'store');
Route::apiResource('bookmarks', BookmarkController::class);
Route::apiResource('brands', BrandController::class)->names([
    'index' => 'public.brands.index',
    'store' => 'public.brands.store',
    'show' => 'public.brands.show',
    'update' => 'public.brands.update',
    'destroy' => 'public.brands.destroy',
]);
Route::apiResource('categories', CategoryController::class)->names([
    'index' => 'public.categories.index',
    'store' => 'public.categories.store',
    'show' => 'public.categories.show',
    'update' => 'public.categories.update',
    'destroy' => 'public.categories.destroy',
]);
Route::apiResource('products/{product}/reviews', ReviewController::class)->names([
    'index' => 'public.reviews.index',
    'store' => 'public.reviews.store',
    'show' => 'public.reviews.show',
    'update' => 'public.reviews.update',
    'destroy' => 'public.reviews.destroy',
]);
Route::apiResource('collections', CollectionController::class)->names([
    'index' => 'public.collections.index',
    'store' => 'public.collections.store',
    'show' => 'public.collections.show',
    'update' => 'public.collections.update',
    'destroy' => 'public.collections.destroy',
]);
