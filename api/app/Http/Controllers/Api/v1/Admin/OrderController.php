<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Order::query()
            ->with('user')
            ->simplePaginate(5)
            ->withQueryString();
    }

    public function show(Order $order): void
    {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): void
    {
    }

    public function destroy(string $id): void
    {
    }
}
