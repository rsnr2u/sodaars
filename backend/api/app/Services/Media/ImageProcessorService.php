<?php

namespace App\Services\Media;

use App\DTOs\ProcessedImageDto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ImageProcessorService
{
    /**
     * Validate the uploaded image content against MIME, magic bytes, size, and security constraints.
     */
    public function validate(UploadedFile $file): array
    {
        $maxSizeKb = (int) config('media.max_file_size', 15360);
        $minSizeKb = (int) config('media.min_file_size', 5);
        $allowedMimes = config('media.allowed_mimes', ['image/jpeg', 'image/png', 'image/webp']);
        $allowedExtensions = config('media.allowed_extensions', ['jpg', 'jpeg', 'png', 'webp']);

        // 1. Extension check
        $extension = strtolower($file->getClientOriginalExtension());
        if (! in_array($extension, $allowedExtensions, true)) {
            throw ValidationException::withMessages([
                'file' => ["The file extension '{$extension}' is not permitted. Allowed extensions: " . implode(', ', $allowedExtensions)],
            ]);
        }

        // 2. File size check
        $fileSizeBytes = $file->getSize();
        if ($fileSizeBytes > ($maxSizeKb * 1024)) {
            throw ValidationException::withMessages([
                'file' => ["The file size exceeds the maximum limit of {$maxSizeKb} KB (" . round($maxSizeKb / 1024, 1) . " MB)."],
            ]);
        }

        if ($fileSizeBytes < ($minSizeKb * 1024)) {
            throw ValidationException::withMessages([
                'file' => ["The file size is smaller than the minimum allowed size of {$minSizeKb} KB."],
            ]);
        }

        // 3. Real path verification
        $realPath = $file->getRealPath();
        if (! $realPath || ! file_exists($realPath)) {
            throw ValidationException::withMessages([
                'file' => ['The uploaded file could not be read from disk.'],
            ]);
        }

        // 4. MIME type inspection via fileinfo (magic bytes)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detectedMime = finfo_file($finfo, $realPath);
        finfo_close($finfo);

        if (! in_array($detectedMime, $allowedMimes, true)) {
            throw ValidationException::withMessages([
                'file' => ["The detected MIME type '{$detectedMime}' is invalid. Allowed types: " . implode(', ', $allowedMimes)],
            ]);
        }

        // 5. Image integrity check via getimagesize()
        $imageInfo = @getimagesize($realPath);
        if ($imageInfo === false) {
            throw ValidationException::withMessages([
                'file' => ['The uploaded file is not a valid or readable image.'],
            ]);
        }

        [$width, $height] = $imageInfo;

        // 6. Security scan: prevent executable or script injection inside image contents
        $contentSample = @file_get_contents($realPath, false, null, 0, 1024);
        if ($contentSample !== false) {
            $dangerousPatterns = ['<?php', '<?=', '<script', '<html', '<svg'];
            foreach ($dangerousPatterns as $pattern) {
                if (stripos($contentSample, $pattern) !== false) {
                    throw ValidationException::withMessages([
                        'file' => ['The uploaded file failed security integrity checks and was rejected.'],
                    ]);
                }
            }
        }

        return [
            'mime_type' => $detectedMime,
            'extension' => $extension === 'jpeg' ? 'jpg' : $extension,
            'width' => $width,
            'height' => $height,
            'file_size' => $fileSizeBytes,
        ];
    }

    /**
     * Process an uploaded file into optimized display image and thumbnail versions.
     */
    public function process(UploadedFile $file): ProcessedImageDto
    {
        $meta = $this->validate($file);
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $sanitizedOriginalFilename = Str::slug($originalFilename) . '.' . $meta['extension'];

        $tempOriginal = tempnam(sys_get_temp_dir(), 'sod_orig_');
        copy($file->getRealPath(), $tempOriginal);

        $optimizedTemp = null;
        $thumbnailTemp = null;
        $finalWidth = $meta['width'];
        $finalHeight = $meta['height'];

        if (extension_loaded('gd')) {
            $gdImage = $this->createGdImage($tempOriginal, $meta['mime_type']);

            if ($gdImage) {
                // 1. Generate optimized display version (max 1920px)
                $maxDisplayDim = (int) config('media.display_max_dimension', 1920);
                $optImage = $this->resizeProportionally($gdImage, $meta['width'], $meta['height'], $maxDisplayDim);
                
                $finalWidth = imagesx($optImage);
                $finalHeight = imagesy($optImage);

                $optimizedTemp = tempnam(sys_get_temp_dir(), 'sod_opt_') . '.jpg';
                imagejpeg($optImage, $optimizedTemp, (int) config('media.quality.jpeg', 85));

                if ($optImage !== $gdImage) {
                    imagedestroy($optImage);
                }

                // 2. Generate thumbnail (600x400)
                $thumbWidth = (int) config('media.thumbnail.width', 600);
                $thumbHeight = (int) config('media.thumbnail.height', 400);
                $thumbImage = $this->createThumbnail($gdImage, $meta['width'], $meta['height'], $thumbWidth, $thumbHeight);

                $thumbnailTemp = tempnam(sys_get_temp_dir(), 'sod_thumb_') . '.jpg';
                imagejpeg($thumbImage, $thumbnailTemp, (int) config('media.quality.jpeg', 85));
                imagedestroy($thumbImage);

                imagedestroy($gdImage);
            }
        }

        // Fallbacks if GD is not present
        if (! $optimizedTemp || ! file_exists($optimizedTemp)) {
            $optimizedTemp = $tempOriginal;
        }

        if (! $thumbnailTemp || ! file_exists($thumbnailTemp)) {
            $thumbnailTemp = $tempOriginal;
        }

        return new ProcessedImageDto(
            originalFilePath: $tempOriginal,
            originalFilename: $sanitizedOriginalFilename,
            mimeType: $meta['mime_type'],
            extension: $meta['extension'],
            fileSize: $meta['file_size'],
            width: $finalWidth,
            height: $finalHeight,
            optimizedFilePath: $optimizedTemp,
            thumbnailFilePath: $thumbnailTemp
        );
    }

    /**
     * Create a GD resource from the source image.
     */
    protected function createGdImage(string $path, string $mimeType)
    {
        return match ($mimeType) {
            'image/jpeg' => @imagecreatefromjpeg($path),
            'image/png' => @imagecreatefrompng($path),
            'image/webp' => @imagecreatefromwebp($path),
            default => null,
        };
    }

    /**
     * Proportional resize if dimensions exceed maximum boundary.
     */
    protected function resizeProportionally($source, int $width, int $height, int $maxDim)
    {
        if ($width <= $maxDim && $height <= $maxDim) {
            return $source;
        }

        $ratio = min($maxDim / $width, $maxDim / $height);
        $newWidth = (int) round($width * $ratio);
        $newHeight = (int) round($height * $ratio);

        $target = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($target, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        return $target;
    }

    /**
     * Create a centered crop thumbnail.
     */
    protected function createThumbnail($source, int $srcWidth, int $srcHeight, int $targetWidth, int $targetHeight)
    {
        $thumb = imagecreatetruecolor($targetWidth, $targetHeight);

        // Aspect ratios
        $srcRatio = $srcWidth / $srcHeight;
        $targetRatio = $targetWidth / $targetHeight;

        if ($srcRatio > $targetRatio) {
            // Source is wider than target ratio
            $cropWidth = (int) round($srcHeight * $targetRatio);
            $cropHeight = $srcHeight;
            $cropX = (int) round(($srcWidth - $cropWidth) / 2);
            $cropY = 0;
        } else {
            // Source is taller than target ratio
            $cropWidth = $srcWidth;
            $cropHeight = (int) round($srcWidth / $targetRatio);
            $cropX = 0;
            $cropY = (int) round(($srcHeight - $cropHeight) / 2);
        }

        imagecopyresampled($thumb, $source, 0, 0, $cropX, $cropY, $targetWidth, $targetHeight, $cropWidth, $cropHeight);

        return $thumb;
    }
}
