<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\ApiController;
use App\Models\Category;

class CategoryController extends ApiController
{
    public function index()
    {
        return Category::get();
    }
}
