<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Features;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    protected $appends = [
        'two_factor_enabled',
    ];

    public function getTwoFactorEnabledAttribute(): bool
    {
        Log::info($this->two_factor_confirmed_at);

        return Features::enabled(Features::twoFactorAuthentication())
            && null !== $this->two_factor_secret;
    }

    public function createProfilePhotoUrl(): string
    {
        $firstCharacter = $this->email[0];

        $integerToUse = is_numeric($firstCharacter)
            ? ord(mb_strtolower($firstCharacter)) - 21
            : ord(mb_strtolower($firstCharacter)) - 96;

        return 'https://www.gravatar.com/avatar/'
            . md5($this->email)
            . '?s=200&d=https://s3.amazonaws.com/laracasts/images/forum/avatars/default-avatar-'
            . $integerToUse
            . '.png';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
