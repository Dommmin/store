<?php

declare(strict_types=1);

namespace App\Repository;

use App\Models\Product;

class ProductRepository
{
    public function getRelatedProducts(int $id, int $groupId)
    {
        return Product::query()
            ->where('group_id', $groupId)
            ->where('id', '!=', $id)
            ->with('attributes.attribute')
            ->get();
    }
}
