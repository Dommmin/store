<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function creating(User $user): void
    {
        $user->profile_photo_url = $user->createProfilePhotoUrl();
    }
}
