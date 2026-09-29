<?php

namespace App\Enums;

enum CustomerType: string
{
    case DIRECT_ADVERTISER = 'DIRECT_ADVERTISER';
    case AGENCY = 'AGENCY';
    case BRAND = 'BRAND';
    case INDIVIDUAL = 'INDIVIDUAL';
    case GOVERNMENT = 'GOVERNMENT';

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
