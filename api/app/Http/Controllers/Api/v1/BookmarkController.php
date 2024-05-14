<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\BookmarkStoreRequest;
use App\Models\Bookmark;
use Illuminate\Http\Request;

class BookmarkController extends ApiController
{
    public function index(Request $request)
    {
        if ( ! $request->user()) {
            return [];
        }

        return Bookmark::query()
            ->where('user_id', $request->user()->id)
            ->with('product')
            ->get();
    }

    public function store(BookmarkStoreRequest $request)
    {
        $validated = $request->validated();

        if ( ! $request->user()) {
            return null;
        }

        $validated['user_id'] = $request->user()->id;

        $bookmark = Bookmark::create($validated);

        return $this->ok('Successfully marked as bookmark.', $bookmark);
    }

    public function destroy(Bookmark $bookmark)
    {
        $bookmark->delete();

        return $this->ok('Successfully unmarked as bookmark.', $bookmark);
    }

    public function count(Request $request)
    {
        if ( ! $request->user()) {
            return null;
        }

        return Bookmark::query()
            ->where('user_id', $request->user()->id)
            ->count();
    }
}
