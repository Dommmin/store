<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::query()
            ->withCount('items')
            ->where('user_id', 1)
            ->latest()
            ->simplePaginate();

        return OrderResource::collection($orders);
    }

    public function show(Order $order)
    {
        $order->loadMissing([
            'items.product:id,name,url,price,images',
            'items.size:id,name',
        ])
            ->loadCount('items');

        return new OrderResource($order);
    }
}
