<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CartItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CartItemPolicy
{
    use HandlesAuthorization;

    public function update(User $user, CartItem $cart): bool
    {
        return $user->id === $cart->user_id;
    }

    public function delete(User $user, CartItem $cart): bool
    {
        return $user->id === $cart->user_id;
    }
}
