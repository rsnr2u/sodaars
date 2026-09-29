<?php

namespace App\DTOs;

class ProcessedImageDto
{
    public function __construct(
        public readonly string $originalFilePath,
        public readonly string $originalFilename,
        public readonly string $mimeType,
        public readonly string $extension,
        public readonly int $fileSize,
        public readonly ?int $width,
        public readonly ?int $height,
        public readonly ?string $optimizedFilePath = null,
        public readonly ?string $thumbnailFilePath = null,
    ) {}
}
