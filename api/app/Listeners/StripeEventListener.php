<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\HandleCheckoutSessionCompletedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener implements ShouldQueue
{
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'checkout.session.completed') {
            (new HandleCheckoutSessionCompletedEvent())->handle($event->payload['data']['object']['id']);
        }
    }
}
