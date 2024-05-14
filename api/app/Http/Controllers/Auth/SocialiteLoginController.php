<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteLoginController extends Controller
{
    public function redirectToProvider($provider)
    {
        $url = Socialite::driver($provider)->redirect()->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function handleProviderCallback($provider)
    {
        /** @var \Laravel\Socialite\Two\User $socialiteUser */
        $socialiteUser = Socialite::driver($provider)->user();

        $user = User::firstOrCreate(
            ['email' => $socialiteUser->email],
            ['name' => $socialiteUser->name, 'password' => Hash::make(Str::random())]
        );

        Auth::login($user, true);

        return redirect(env('FRONTEND_URL'));
    }
}
