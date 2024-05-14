<?php

namespace App\Listeners;

use App\Events\HandleCheckoutSessionCompletedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener implements ShouldQueue
{
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'checkout.session.completed') {
            (new HandleCheckoutSessionCompletedEvent)->handle($event->payload['data']['object']['id']);
        }
    }
}
