<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\ApiController;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;

class PaymentController extends ApiController
{
    /**
     * @throws ApiErrorException
     */
    public function checkout(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        //        $stripe = new StripeClient(env('STRIPE_SECRET'));
        //
        //        $stripe->coupons->create([
        //            'duration' => 'repeating',
        //            'id' => '10OFF',
        //            'percent_off' => 10,
        //            'duration_in_months' => 3,
        //        ]);

        $cartItems = CartItem::query()
            ->where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        $lineItems = [];
        $paymentMethodTypes = ['card', 'p24', 'blik', 'klarna'];

        foreach ($cartItems as $cartItem) {
            $images = collect($cartItem->product->images)->pluck('url')->toArray();

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'pln',
                    'product_data' => [
                        'name' => $cartItem->product->name,
                        'images' => $images,
                        'description' => $cartItem->product->short_description,
                        'metadata' => [
                            'product_id' => $cartItem->product->id,
                        ],
                    ],
                    'unit_amount' => $cartItem->product->price,
                ],
                'quantity' => $cartItem->quantity,
            ];
        }

        $session = Session::create([
            'payment_method_types' => $paymentMethodTypes,
            'line_items' => $lineItems,
            'mode' => 'payment',
            'allow_promotion_codes' => true,
            'shipping_address_collection' => [
                'allowed_countries' => ['PL'],
            ],
            'metadata' => [
                'user_id' => $request->user()->id,
            ],
            'success_url' => env('FRONTEND_URL') . '/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => env('FRONTEND_URL') . '/',
        ]);

        return $this->ok($session->url);
    }

    public function confirmation(Request $request)
    {
        return Order::query()
            ->where('user_id', $request->user()->id)
            ->where('stripe_checkout_session_id', $request->session_id)
            ->firstOrFail();
    }
}
