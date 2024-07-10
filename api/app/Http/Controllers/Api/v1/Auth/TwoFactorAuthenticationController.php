<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Requests\TwoFactorLoginRequest;

class TwoFactorAuthenticationController extends Controller
{
    public function enabled()
    {
        return Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm');
    }

    public function challenge(TwoFactorLoginRequest $request)
    {
        if (! $request->hasChallengedUser()) {
            abort(403);
        }

        return response()->noContent(200);
    }
}
