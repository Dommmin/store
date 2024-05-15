<?php

declare(strict_types=1);

namespace App\Events;

use App\Mail\OrderConfirmation;
use App\Models\CartItem;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Cashier\Cashier;
use Stripe\LineItem;

class HandleCheckoutSessionCompletedEvent
{
    use Dispatchable;

    public function handle($sessionId): void
    {
        DB::transaction(function () use ($sessionId): void {
            $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

            $user = User::find($session->metadata->user_id);

            $order = $user->orders()->create([
                'uuid' => Str::uuid()->toString(),
                'status' => $session->payment_status,
                'currency' => $session->currency,
                'total' => $session->amount_total,
                'stripe_checkout_session_id' => $session->id,
                'billing_address' => [
                    'name' => $session->customer_details->name,
                    'email' => $session->customer_details->email,
                    'phone' => $session->customer_details->phone,
                    'city' => $session->customer_details->address->city,
                    'country' => $session->customer_details->address->country,
                    'postal_code' => $session->customer_details->address->postal_code,
                    'line1' => $session->customer_details->address->line1,
                    'line2' => $session->customer_details->address->line2,
                    'state' => $session->customer_details->address->state,
                ],
                'shipping_address' => [
                    'name' => $session->shipping_details->name,
                    'city' => $session->shipping_details->address->city,
                    'country' => $session->shipping_details->address->country,
                    'postal_code' => $session->shipping_details->address->postal_code,
                    'line1' => $session->shipping_details->address->line1,
                    'line2' => $session->shipping_details->address->line2,
                    'state' => $session->shipping_details->address->state,
                ],
            ]);

            $lineItems = Cashier::stripe()->checkout->sessions->allLineItems($session->id);

            $orderItems = collect($lineItems->all())->map(function (LineItem $line) use ($order) {
                $product = Cashier::stripe()->products->retrieve($line->price->product);

                return new OrderItem([
                    'order_id' => $order->id,
                    'product_id' => $product->metadata->product_id,
                    'price' => $line->price->unit_amount,
                    'quantity' => $line->quantity,
                ]);
            });

            $order->items()->saveMany($orderItems);

            CartItem::where('user_id', $user->id)->delete();

            $order->loadMissing('items.product', 'user');

            Mail::to($user)->send(new OrderConfirmation($order));
        });
    }
}
