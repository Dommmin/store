<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Collection;

class CollectionController extends Controller
{
    public function index()
    {
        return Collection::query()
            ->where('enabled', true)
            ->with('products', function ($query): void {
                $query->inRandomOrder()->take(10);
            })
            ->get();
    }

    public function show(Collection $collection)
    {
        return $collection;
    }
}
