<?php

namespace App\Enums;

enum OrganizationStatus: string
{
    case ACTIVE = 'ACTIVE';
    case SUSPENDED = 'SUSPENDED';
    case PENDING_VERIFICATION = 'PENDING_VERIFICATION';
    case INACTIVE = 'INACTIVE';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
