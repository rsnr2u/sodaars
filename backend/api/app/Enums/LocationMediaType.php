<?php

namespace App\Enums;

enum LocationMediaType: string
{
    case SITE_PHOTO = 'SITE_PHOTO';
    case SURROUNDING_AREA = 'SURROUNDING_AREA';
    case LANDMARK_VIEW = 'LANDMARK_VIEW';
    case PLOT_MAP = 'PLOT_MAP';
    case OTHER = 'OTHER';

    /**
     * Return all enum values as an array.
     *
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
