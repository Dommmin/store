<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Helpers\Cart;

class MoveCartItems
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        Cart::moveCartItemsIntoDb();
    }
}
