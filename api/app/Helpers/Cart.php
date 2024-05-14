<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

use function request;

class Cart
{
    public static function getTotal(): int
    {
        $cartItems = self::getCartItems();

        $total = 0;
        foreach ($cartItems as $cartItem) {
            $total += $cartItem['product']->price * $cartItem['quantity'];
        }

        return $total;
    }

    public static function getCartItems()
    {
        $request = request();
        $user = $request->user();
        if ($user) {
            return CartItem::where('user_id', $user->id)
                ->with('product')
                ->get();
        }

        return self::getCookieCartItems();
    }

    public static function getCookieCartItems(): array
    {
        $request = request();
        $cartItems = json_decode($request->cookie('cart_items', '[]'), true);

        if (empty($cartItems)) {
            return [];
        }

        $productIds = Arr::pluck($cartItems, 'product_id');

        $products = Product::whereIn('id', $productIds)->get();
        $products = $products->keyBy('id');

        return array_map(fn ($item) => [
            'product' => $products[$item['product_id']],
            'quantity' => $item['quantity'],
        ], $cartItems);
    }

    public static function moveCartItemsIntoDb(): void
    {
        $request = request();
        $cartItems = json_decode($request->cookie('cart_items', '[]'), true);

        Log::info('cartItems', $cartItems);

        $newCartItems = [];

        foreach ($cartItems as $cartItem) {
            $newCartItems[] = [
                'user_id' => auth()->id(),
                'product_id' => $cartItem['product_id'],
                'quantity' => $cartItem['quantity'],
            ];
        }

        if ( ! empty($newCartItems)) {
            CartItem::create($newCartItems);
        }
    }
}
