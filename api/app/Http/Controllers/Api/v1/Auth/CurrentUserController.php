<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Actions\ConfirmPassword;

class CurrentUserController extends Controller
{
    public function destroy(Request $request, StatefulGuard $guard)
    {
        $confirmed = app(ConfirmPassword::class)(
            $guard,
            $request->user(),
            $request->password
        );

        if (! $confirmed) {
            throw ValidationException::withMessages([
                'password' => __('The password is incorrect.'),
            ]);
        }

        $request->user()->delete();

        $guard->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
