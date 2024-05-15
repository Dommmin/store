<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\ImageStoreRequest;
use App\Models\Image;
use App\Services\FileService;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends ApiController
{
    public function __construct(private readonly FileService $fileService)
    {
    }

    public function index()
    {
        return Image::get();
    }

    /**
     * @throws FileNotFoundException
     */
    public function bulkInsert(ImageStoreRequest $request)
    {
        $files = $request->file('images');

        $images = $this->fileService->storeFiles($files, 'minio', 'images');

        return Image::insert($images);
    }

    /**
     * @throws FileNotFoundException
     */
    public function store(Request $request)
    {
        $file = $request->file('upload');

        $path = $this->fileService->storeFile($file, 'minio', 'images');

        return 'http://localhost:9099/app/' . $path;
    }

    public function show(Image $image): Image
    {
        return $image;
    }

    public function destroy(Image $image): JsonResponse
    {
        $image->delete();

        Storage::disk('minio')->delete($image->name);

        return $this->ok('Image deleted successfully.');
    }
}
