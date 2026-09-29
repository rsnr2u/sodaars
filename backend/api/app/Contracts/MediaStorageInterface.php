<?php

namespace App\Contracts;

use App\DTOs\ProcessedImageDto;
use App\DTOs\StoredMediaDto;
use App\Models\AdvertisingResource;
use App\Models\Location;
use App\Models\Organization;

interface MediaStorageInterface
{
    /**
     * Store processed media assets for a location under tenant-isolated storage path.
     */
    public function storeLocationMedia(
        Organization $organization,
        Location $location,
        ProcessedImageDto $processedImage,
        ?string $disk = null
    ): StoredMediaDto;

    /**
     * Store processed media assets for an advertising resource under tenant-isolated storage path.
     */
    public function storeResourceMedia(
        Organization $organization,
        AdvertisingResource $resource,
        ProcessedImageDto $processedImage,
        ?string $disk = null
    ): StoredMediaDto;

    /**
     * Delete files associated with a media record safely from disk.
     */
    public function deleteMediaFiles(
        string $disk,
        ?string $originalPath,
        ?string $storagePath,
        ?string $thumbnailPath
    ): void;

    /**
     * Generate the public or CDN URL for a given storage path.
     */
    public function getUrl(?string $path, ?string $disk = null): ?string;
}
