<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\SocialiteLoginController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth/{provider}')->group(function (): void {
    Route::get('/url', [SocialiteLoginController::class, 'redirectToProvider']);
    Route::get('/callback', [SocialiteLoginController::class, 'handleProviderCallback']);
});
