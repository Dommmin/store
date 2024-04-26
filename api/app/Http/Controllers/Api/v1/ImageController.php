<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImageStoreRequest;
use App\Models\Image;
use App\Services\FileService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Exceptions\CouldNotLoadImage;
use Spatie\Image\Exceptions\InvalidImageDriver;

class ImageController extends Controller
{
    public function __construct(private readonly FileService $fileService)
    {
    }

    public function index()
    {
        return Image::get();
    }

    /**
     * @throws CouldNotLoadImage
     * @throws InvalidImageDriver
     */
    public function store(ImageStoreRequest $request)
    {
        $files = $request->file('images');

        $images = $this->fileService->storeFiles($files, 'minio', 'images');

        return Image::insert($images);
    }

    public function show(Image $image): Image
    {
        return $image;
    }

    public function destroy(Image $image): Response
    {
        $image->delete();

        Storage::disk('minio')->delete($image->name);

        return response()->noContent();
    }
}
