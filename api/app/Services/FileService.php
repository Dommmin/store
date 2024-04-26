<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Spatie\Image\Exceptions\CouldNotLoadImage;
use Spatie\Image\Exceptions\InvalidImageDriver;

class FileService
{
    /**
     * @throws InvalidImageDriver
     * @throws CouldNotLoadImage
     */
    public function storeFiles(array $files = [], string $disk = 'local', string $directory = ''): array
    {
        $data = [];

        foreach ($files as $file) {
            if ($file->isValid()) {
                $extension = $file->getClientOriginalExtension();
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $fileName = $originalName.'-'.uniqid().'.'.$extension;
                $path = $directory === '' ? $fileName : $directory.'/'.$fileName;

                Storage::disk($disk)->put($path, $file->get(), 'public');

                $data[] = [
                    'name' => $originalName,
                    'path' => Storage::disk($disk)->url($path),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        return $data;
    }
}
