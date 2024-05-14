<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\CategoryStoreRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends ApiController
{
    public function index(Request $request)
    {
        $query = Category::query()
            ->select(['id', 'name']);

        if ($request->filled('perPage')) {
            return $query->simplePaginate($request->input('perPage', 5))->withQueryString();
        }

        return $query->get();
    }

    public function store(CategoryStoreRequest $request)
    {
        $validated = $request->validated();

        $category = Category::create($validated);

        return $this->ok('Category created successfully.', $category);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $category->update($validated);

        return $this->ok('Category updated successfully.', $category);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return $this->ok('Category deleted successfully.');
    }
}
