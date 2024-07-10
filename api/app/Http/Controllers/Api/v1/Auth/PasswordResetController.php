<?php

namespace App\Http\Controllers\Api\v1\Auth;

use Illuminate\Http\Request;

class PasswordResetController
{
    public function __invoke(Request $request, string $token)
    {
        return $token;
    }
}
