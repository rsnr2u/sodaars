<?php

namespace App\Enums;

enum ResourceMediaType: string
{
    case DAY_PHOTO = 'DAY_PHOTO';
    case NIGHT_PHOTO = 'NIGHT_PHOTO';
    case LONG_SHOT = 'LONG_SHOT';
    case CLOSE_UP = 'CLOSE_UP';
    case SCHEMATIC = 'SCHEMATIC';
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
