<?php

declare(strict_types=1);

use App\Http\Controllers\Api\v1\Admin;
use App\Http\Controllers\Api\v1\Admin\ImageController;
use App\Http\Controllers\Api\v1\Auth\CurrentUserController;
use App\Http\Controllers\Api\v1\Auth\SocialiteLoginController;
use App\Http\Controllers\Api\v1\Auth\TwoFactorAuthenticationController;
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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
Route::get('/user', fn (Request $request) => $request->user())->middleware('auth:sanctum');

Route::delete('/user', [CurrentUserController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('user.destroy');

Route::get('/two-factor-authentication-enabled', [
    TwoFactorAuthenticationController::class, 'enabled',
])->name('two-factor-authentication.enabled');

Route::get('/two-factor-authentication-challenge', [
    TwoFactorAuthenticationController::class, 'challenge',
])->name('two-factor-authentication.challenge')
    ->middleware(['guest:' . config('fortify.guard')]);

Route::prefix('auth/{provider}')->group(function (): void {
    Route::get('/url', [SocialiteLoginController::class, 'redirectToProvider']);
    Route::get('/callback', [SocialiteLoginController::class, 'handleProviderCallback']);
});

Route::get('search', SearchController::class);

Route::post('cart-items/increment', [CartController::class, 'incrementQuantity']);
Route::post('cart-items/decrement', [CartController::class, 'decrementQuantity']);
Route::post('cart-items/remove', [CartController::class, 'remove']);
Route::get('cart-items/count', [CartController::class, 'count']);
Route::get('cart-items/total', [CartController::class, 'totalPrice']);
Route::get('bookmarks/count', [BookmarkController::class, 'count']);

Route::post('checkout', [PaymentController::class, 'checkout']);
Route::post('confirmation', [PaymentController::class, 'confirmation']);
Route::apiResource('orders', OrderController::class);

Route::get('products/{product}/variants', [ProductController::class, 'variants']);
Route::get('products/{product}/ratings', [ReviewController::class, 'ratings']);
Route::apiResource('products', ProductController::class);
Route::apiResource('cart-items', CartController::class)->only('index', 'store');
Route::apiResource('bookmarks', BookmarkController::class);
Route::apiResource('brands', BrandController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products/{product}/reviews', ReviewController::class);
Route::apiResource('collections', CollectionController::class);

Route::middleware('auth:sanctum')->prefix('admin')->group(function (): void {
    Route::post('products/{product}/publish', [Admin\ProductController::class, 'publish']);
    Route::post('products/{product}/unpublish', [Admin\ProductController::class, 'unpublish']);

    Route::post('reviews/{review}/approve', [Admin\ReviewController::class, 'approve']);
    Route::post('reviews/{review}/unapprove', [Admin\ReviewController::class, 'unapprove']);

    Route::get('products/{product}/attributes', [Admin\ProductController::class, 'attributes']);
    Route::get('products/get-products-by-attributes', [Admin\ProductController::class, 'getProductsByTheirAttributes']);
    Route::post('images/bulk-insert', [ImageController::class, 'bulkInsert']);
    Route::apiResource('images', ImageController::class);
    Route::apiResource('brands', Admin\BrandController::class);
    Route::apiResource('collections', Admin\CollectionController::class);
    Route::apiResource('categories', Admin\CategoryController::class);
    Route::apiResource('products', Admin\ProductController::class);
    Route::apiResource('attributes', Admin\AttributeController::class);
    Route::apiResource('attributes/{attribute}/attributeValues', Admin\AttributeValueController::class);
    Route::apiResource('orders', Admin\OrderController::class);
    Route::apiResource('products/{product}/associations', Admin\AssociationController::class);
    Route::apiResource('customers', Admin\CustomerController::class);
    Route::apiResource('reviews', Admin\ReviewController::class);
});
