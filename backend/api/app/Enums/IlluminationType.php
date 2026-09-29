<?php

namespace App\Enums;

enum IlluminationType: string
{
    case FRONT_LIT = 'FRONT_LIT';
    case BACK_LIT = 'BACK_LIT';
    case NON_LIT = 'NON_LIT';
    case DIGITAL_LED = 'DIGITAL_LED';
    case SOLAR_LIT = 'SOLAR_LIT';
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
