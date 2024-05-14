<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends ApiController
{
    public function index(Request $request)
    {
        $sortBy = $request->input('sortBy', 'id');
        $sortOrder = $request->input('sortOrder', 'desc');
        $perPage = $request->input('perPage', 10);

        return User::query()
            ->with('roles')
            ->select(['id', 'name', 'profile_photo_url', 'email'])
            ->when($request->has('search'), function ($query) use ($request): void {
                $query->where('name', 'like', '%' . $request->input('search') . '%')
                    ->orWhere('email', 'like', '%' . $request->input('search') . '%');
            })
            ->orderBy($sortBy, $sortOrder)
            ->simplePaginate($perPage);
    }
}
