<?php

declare(strict_types=1);

use App\Http\Controllers\Api\v1\ImageController;
use App\Http\Controllers\Api\v1\SearchController;
use App\Http\Controllers\Auth\SocialiteLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', fn(Request $request) => $request->user())->middleware('auth:sanctum');

Route::prefix('auth/{provider}')->group(function (): void {
    Route::get('/url', [SocialiteLoginController::class, 'redirectToProvider']);
    Route::get('/callback', [SocialiteLoginController::class, 'handleProviderCallback']);
});

Route::apiResource('images', ImageController::class);
Route::get('search', SearchController::class);
