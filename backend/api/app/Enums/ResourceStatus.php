<?php

namespace App\Enums;

enum ResourceStatus: string
{
    case ACTIVE = 'ACTIVE';
    case INACTIVE = 'INACTIVE';
    case UNDER_MAINTENANCE = 'UNDER_MAINTENANCE';
    case UNDER_REVIEW = 'UNDER_REVIEW';

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
