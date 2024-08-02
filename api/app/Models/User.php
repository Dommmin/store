<?php

declare(strict_types=1);

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Fortify\Features;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use Billable, HasApiTokens, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

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
        'is_admin',
    ];

    public function getTwoFactorEnabledAttribute(): bool
    {
        return Features::enabled(Features::twoFactorAuthentication())
            && $this->hasAttribute('two_factor_secret')
            && ! is_null($this->two_factor_secret);
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

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function getIsAdminAttribute(): bool
    {
        return $this->isAdmin();
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     *
     * @return void
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
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
