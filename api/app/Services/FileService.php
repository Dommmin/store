<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    /**
     * @throws FileNotFoundException
     */
    public function storeFiles(array $files = [], string $disk = 'public', string $directory = ''): array
    {
        $data = [];

        foreach ($files as $file) {
            if ($file->isValid()) {
                $path = $this->store($file, $directory, $disk);
                $data[] = [
                    'id' => $file->hashName(),
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'url' => env('DOCKER_APP_URL') . '/storage/' . $path,
                ];
            }
        }

        return $data;
    }

    public function storeFile(?UploadedFile $file = null, string $disk = 'public', string $directory = ''): string
    {
        return $this->store($file, $directory, $disk);
    }

    public function deleteFiles(array $files, string $disk = 'public'): void
    {
        foreach ($files as $file) {
            Storage::disk($disk)->delete($file['path']);
        }
    }

    private function store(UploadedFile $file, string $directory, string $disk): string
    {
        $extension = $file->getClientOriginalExtension();
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = $originalName . '-' . uniqid() . '.' . $extension;
        $path = $directory === '' ? $fileName : $directory . '/' . $fileName;

        Storage::disk($disk)->put($path, file_get_contents($file->getRealPath()), 'public');

        return $path;
    }
}
