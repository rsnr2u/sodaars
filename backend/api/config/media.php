<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Media Storage Disk
    |--------------------------------------------------------------------------
    |
    | The default disk driver to use for media uploads. In local development,
    | this defaults to 'public' (served from storage/app/public). In production,
    | this can be swapped to 's3' or 'r2' via the MEDIA_DISK environment variable.
    |
    */
    'disk' => env('MEDIA_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | File Size Limits (in Kilobytes)
    |--------------------------------------------------------------------------
    |
    | Maximum allowed upload file size. Default is 15MB (15360 KB).
    | Minimum allowed upload file size is 5KB to reject zero-byte files.
    |
    */
    'max_file_size' => env('MEDIA_MAX_FILE_SIZE', 15360),
    'min_file_size' => env('MEDIA_MIN_FILE_SIZE', 5),

    /*
    |--------------------------------------------------------------------------
    | Allowed MIME Types and Extensions
    |--------------------------------------------------------------------------
    |
    | Strictly limited to visual image formats. SVG and executables are prohibited.
    |
    */
    'allowed_mimes' => [
        'image/jpeg',
        'image/png',
        'image/webp',
    ],

    'allowed_extensions' => [
        'jpg',
        'jpeg',
        'png',
        'webp',
    ],

    /*
    |--------------------------------------------------------------------------
    | Image Optimization Constraints
    |--------------------------------------------------------------------------
    |
    | Display version max dimension (scales down massive 12MP-50MP raw uploads).
    | Thumbnail dimensions (for cards, galleries, and preview components).
    |
    */
    'display_max_dimension' => 1920,

    'thumbnail' => [
        'width' => 600,
        'height' => 400,
    ],

    /*
    |--------------------------------------------------------------------------
    | Image Compression Quality
    |--------------------------------------------------------------------------
    */
    'quality' => [
        'jpeg' => 85,
        'webp' => 82,
    ],
];
