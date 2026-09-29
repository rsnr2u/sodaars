<?php

namespace App\Enums;

enum BillingCycle: string
{
    case MONTHLY = 'MONTHLY';
    case ANNUAL = 'ANNUAL';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
