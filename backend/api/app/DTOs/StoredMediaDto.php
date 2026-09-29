<?php

namespace App\DTOs;

class StoredMediaDto
{
    public function __construct(
        public readonly string $storageDisk,
        public readonly string $originalPath,
        public readonly string $storagePath,
        public readonly string $thumbnailPath,
        public readonly string $fileName,
        public readonly string $originalFilename,
        public readonly string $mimeType,
        public readonly int $fileSize,
        public readonly ?int $width,
        public readonly ?int $height,
    ) {}
}
