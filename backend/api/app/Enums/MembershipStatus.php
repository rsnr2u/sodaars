<?php

namespace App\Enums;

enum MembershipStatus: string
{
    case ACTIVE = 'ACTIVE';
    case INVITED = 'INVITED';
    case SUSPENDED = 'SUSPENDED';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
