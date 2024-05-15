<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Mail\AbandonedCartReminder;
use App\Models\CartItem;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class AbandonedCart extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:abandoned-cart';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Look for abandoned carts and notify their owner';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        CartItem::query()
            ->select('user_id')
            ->withWhereHas('user')
            ->whereDate('updated_at', '<', today()->subDay())
            ->groupBy('user_id')
            ->orderBy('user_id')
            ->chunk(200, function ($carts): void {
                foreach ($carts as $cart) {
                    Mail::to($cart->user)->send(new AbandonedCartReminder($cart));
                }
            });
    }
}
