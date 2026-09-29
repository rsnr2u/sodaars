<?php

namespace App\Services\Media;

use App\Contracts\MediaStorageInterface;
use App\DTOs\ProcessedImageDto;
use App\DTOs\StoredMediaDto;
use App\Models\AdvertisingResource;
use App\Models\Location;
use App\Models\Organization;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaStorageService implements MediaStorageInterface
{
    /**
     * Store processed media assets for a location under tenant-isolated storage path.
     */
    public function storeLocationMedia(
        Organization $organization,
        Location $location,
        ProcessedImageDto $processedImage,
        ?string $disk = null
    ): StoredMediaDto {
        $diskName = $disk ?? config('media.disk', 'public');
        $mediaUuid = (string) Str::uuid();
        $fileName = "{$mediaUuid}.{$processedImage->extension}";
        $thumbFileName = "{$mediaUuid}_thumb.jpg";

        $baseDir = "organizations/{$organization->uuid}/locations/{$location->uuid}";
        $origRelPath = "{$baseDir}/originals/{$fileName}";
        $dispRelPath = "{$baseDir}/{$fileName}";
        $thumbRelPath = "{$baseDir}/thumbnails/{$thumbFileName}";

        $storage = Storage::disk($diskName);

        // Store original safely
        $storage->putFileAs("{$baseDir}/originals", new File($processedImage->originalFilePath), $fileName, 'public');

        // Store optimized display image
        $storage->putFileAs($baseDir, new File($processedImage->optimizedFilePath), $fileName, 'public');

        // Store thumbnail
        $storage->putFileAs("{$baseDir}/thumbnails", new File($processedImage->thumbnailFilePath), $thumbFileName, 'public');

        // Clean up temp files
        $this->cleanupTempFiles([
            $processedImage->originalFilePath,
            $processedImage->optimizedFilePath,
            $processedImage->thumbnailFilePath,
        ]);

        return new StoredMediaDto(
            storageDisk: $diskName,
            originalPath: $origRelPath,
            storagePath: $dispRelPath,
            thumbnailPath: $thumbRelPath,
            fileName: $fileName,
            originalFilename: $processedImage->originalFilename,
            mimeType: $processedImage->mimeType,
            fileSize: $processedImage->fileSize,
            width: $processedImage->width,
            height: $processedImage->height
        );
    }

    /**
     * Store processed media assets for an advertising resource under tenant-isolated storage path.
     */
    public function storeResourceMedia(
        Organization $organization,
        AdvertisingResource $resource,
        ProcessedImageDto $processedImage,
        ?string $disk = null
    ): StoredMediaDto {
        $diskName = $disk ?? config('media.disk', 'public');
        $mediaUuid = (string) Str::uuid();
        $fileName = "{$mediaUuid}.{$processedImage->extension}";
        $thumbFileName = "{$mediaUuid}_thumb.jpg";

        $baseDir = "organizations/{$organization->uuid}/resources/{$resource->uuid}";
        $origRelPath = "{$baseDir}/originals/{$fileName}";
        $dispRelPath = "{$baseDir}/{$fileName}";
        $thumbRelPath = "{$baseDir}/thumbnails/{$thumbFileName}";

        $storage = Storage::disk($diskName);

        // Store original safely
        $storage->putFileAs("{$baseDir}/originals", new File($processedImage->originalFilePath), $fileName, 'public');

        // Store optimized display image
        $storage->putFileAs($baseDir, new File($processedImage->optimizedFilePath), $fileName, 'public');

        // Store thumbnail
        $storage->putFileAs("{$baseDir}/thumbnails", new File($processedImage->thumbnailFilePath), $thumbFileName, 'public');

        // Clean up temp files
        $this->cleanupTempFiles([
            $processedImage->originalFilePath,
            $processedImage->optimizedFilePath,
            $processedImage->thumbnailFilePath,
        ]);

        return new StoredMediaDto(
            storageDisk: $diskName,
            originalPath: $origRelPath,
            storagePath: $dispRelPath,
            thumbnailPath: $thumbRelPath,
            fileName: $fileName,
            originalFilename: $processedImage->originalFilename,
            mimeType: $processedImage->mimeType,
            fileSize: $processedImage->fileSize,
            width: $processedImage->width,
            height: $processedImage->height
        );
    }

    /**
     * Delete files associated with a media record safely from disk.
     */
    public function deleteMediaFiles(
        string $disk,
        ?string $originalPath,
        ?string $storagePath,
        ?string $thumbnailPath
    ): void {
        $storage = Storage::disk($disk);

        if ($originalPath && $storage->exists($originalPath)) {
            $storage->delete($originalPath);
        }

        if ($storagePath && $storage->exists($storagePath)) {
            $storage->delete($storagePath);
        }

        if ($thumbnailPath && $storage->exists($thumbnailPath)) {
            $storage->delete($thumbnailPath);
        }
    }

    /**
     * Generate the public or CDN URL for a given storage path.
     */
    public function getUrl(?string $path, ?string $disk = null): ?string
    {
        if (empty($path)) {
            return null;
        }

        $diskName = $disk ?? config('media.disk', 'public');

        return Storage::disk($diskName)->url($path);
    }

    /**
     * Clean up temporary working files.
     */
    protected function cleanupTempFiles(array $paths): void
    {
        foreach (array_unique($paths) as $path) {
            if ($path && file_exists($path) && str_starts_with($path, sys_get_temp_dir())) {
                @unlink($path);
            }
        }
    }
}
