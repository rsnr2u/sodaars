<?php

namespace App\Models;

use App\Enums\ResourceMediaType;
use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdvertisingResourceMedia extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'advertising_resource_media';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'organization_id',
        'advertising_resource_id',
        'file_url',
        'file_name',
        'original_filename',
        'mime_type',
        'file_size',
        'width',
        'height',
        'storage_disk',
        'storage_path',
        'original_path',
        'thumbnail_path',
        'alt_text',
        'caption',
        'is_primary',
        'sort_order',
        'media_type',
    ];

    /**
     * Appended dynamic accessors.
     */
    protected $appends = [
        'display_url',
        'thumbnail_url',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($media) {
            if (empty($media->uuid)) {
                $media->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'sort_order' => 'integer',
            'is_primary' => 'boolean',
            'media_type' => ResourceMediaType::class,
        ];
    }

    /**
     * Get the public display URL.
     */
    public function getDisplayUrlAttribute(): string
    {
        if (! empty($this->storage_path)) {
            return Storage::disk($this->storage_disk ?? config('media.disk', 'public'))->url($this->storage_path);
        }

        return $this->file_url ?? '';
    }

    /**
     * Get the public thumbnail URL.
     */
    public function getThumbnailUrlAttribute(): string
    {
        if (! empty($this->thumbnail_path)) {
            return Storage::disk($this->storage_disk ?? config('media.disk', 'public'))->url($this->thumbnail_path);
        }

        return $this->getDisplayUrlAttribute();
    }

    /**
     * The advertising resource this media asset belongs to.
     */
    public function advertisingResource(): BelongsTo
    {
        return $this->belongsTo(AdvertisingResource::class);
    }
}
