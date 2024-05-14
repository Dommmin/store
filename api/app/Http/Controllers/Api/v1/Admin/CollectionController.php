<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends ApiController
{
    public function index(Request $request)
    {
        $query = Collection::query()
            ->select(['id', 'name']);

        if ($request->filled('perPage')) {
            return $query->simplePaginate($request->input('perPage', 5))->withQueryString();
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $collection = Collection::create($validated);

        return $this->ok('Collection created successfully.', $collection);
    }

    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $collection->update($validated);

        return $this->ok('Collection updated successfully.', $collection);
    }

    public function destroy(Collection $collection)
    {
        $collection->delete();

        return $this->ok('Collection deleted successfully.');
    }
}
