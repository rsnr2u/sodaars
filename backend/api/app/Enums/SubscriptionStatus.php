<?php

namespace App\Enums;

enum SubscriptionStatus: string
{
    case ACTIVE = 'ACTIVE';
    case TRIAL = 'TRIAL';
    case PAST_DUE = 'PAST_DUE';
    case CANCELLED = 'CANCELLED';
    case EXPIRED = 'EXPIRED';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
