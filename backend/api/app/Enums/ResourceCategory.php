<?php

namespace App\Enums;

enum ResourceCategory: string
{
    case STATIC = 'STATIC';
    case DIGITAL = 'DIGITAL';

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
