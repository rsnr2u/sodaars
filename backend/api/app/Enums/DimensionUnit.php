<?php

namespace App\Enums;

enum DimensionUnit: string
{
    case FEET = 'FEET';
    case METERS = 'METERS';
    case INCHES = 'INCHES';

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
