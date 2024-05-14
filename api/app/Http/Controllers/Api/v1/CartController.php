<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Helpers\Cart;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\CartStoreRequest;
use App\Models\CartItem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class CartController extends ApiController
{
    public function index()
    {
        $cartItems = Cart::getCartItems();

        foreach ($cartItems as &$cartItem) {
            $totalPrice = $cartItem['quantity'] * $cartItem['product']->price;
            $cartItem['total_price'] = number_format($totalPrice / 100, 2, ',', '.');
        }

        return $cartItems;
    }

    public function totalPrice()
    {
        $totalPrice = Cart::getTotal();

        return number_format($totalPrice / 100, 2, ',', '.');
    }

    public function count(Request $request)
    {
        if ( ! $request->user()) {
            $cartItems = Cart::getCookieCartItems();

            return array_reduce(
                $cartItems,
                fn ($carry, $item) => $carry + $item['quantity'],
                0
            );
        }

        return CartItem::query()
            ->where('user_id', $request->user()->id)
            ->sum('quantity');
    }

    public function store(CartStoreRequest $request)
    {
        $validated = $request->validated();

        $user = $request->user();

        if ($user) {
            $validated['user_id'] = $request->user()->id;

            $cart = CartItem::firstOrNew($validated);
            $cart->quantity++;
            $cart->save();

            return $this->ok('Successfully added to cart.', $cart);
        }

        $cartItems = json_decode($request->cookie('cart_items', '[]'), true);

        $productFound = false;

        foreach ($cartItems as &$item) {
            if ($item['product_id'] === $validated['product_id']) {
                $item['quantity']++;
                $productFound = true;
                break;
            }
        }

        if ( ! $productFound) {
            $cartItems[] = [
                'product_id' => $validated['product_id'],
                'size_id' => $validated['size_id'],
                'quantity' => 1,
            ];
        }

        Cookie::queue('cart_items', json_encode($cartItems), 60 * 24 * 30);

        return $this->ok('Successfully added to cart.');
    }

    public function remove(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $cart = CartItem::whereId($request->get('id'))->firstOrFail();
            Gate::authorize('delete', $cart);

            $cart->delete();
        } else {
            $cartItems = json_decode($request->cookie('cart_items', '[]'), true);

            foreach ($cartItems as $i => &$item) {
                if ($item['product_id'] === $request->get('product_id')) {
                    array_splice($cartItems, $i, 1);
                    break;
                }
            }

            Cookie::queue('cart_items', json_encode($cartItems), 60 * 24 * 30);
        }

        return $this->ok('Successfully removed from cart.');
    }

    public function incrementQuantity(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $cart = CartItem::whereId($request->get('id'))->firstOrFail();
            Gate::authorize('update', $cart);

            $cart->quantity++;
            $cart->save();

            return $this->ok('Successfully incremented quantity.', $cart);
        }

        $cartItems = json_decode($request->cookie('cart_items', '[]'), true);

        foreach ($cartItems as &$item) {
            if ($item['product_id'] === $request->get('product_id')) {
                $item['quantity']++;
                break;
            }
        }

        Cookie::queue('cart_items', json_encode($cartItems), 60 * 24 * 30);

        return $this->ok('Successfully incremented quantity.');
    }

    /**
     * @throws Exception
     */
    public function decrementQuantity(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $cart = CartItem::whereId($request->get('id'))->firstOrFail();
            Gate::authorize('update', $cart);

            if ($cart->quantity <= 1) {
                throw new Exception('Cannot decrement quantity below 1');
            }

            $cart->quantity--;
            $cart->save();

            return $this->ok('Successfully decremented quantity.', $cart);
        }

        $cartItems = json_decode($request->cookie('cart_items', '[]'), true);

        foreach ($cartItems as &$item) {
            if ($item['product_id'] === $request->get('product_id')) {
                if ($item['quantity'] <= 1) {
                    throw new Exception('Cannot decrement quantity below 1');
                }

                $item['quantity']--;
                break;
            }
        }

        Cookie::queue('cart_items', json_encode($cartItems), 60 * 24 * 30);

        return $this->ok('Successfully decremented quantity.');
    }
}
