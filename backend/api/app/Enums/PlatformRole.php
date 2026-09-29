<?php

namespace App\Enums;

enum PlatformRole: string
{
    case SUPER_ADMIN = 'SUPER_ADMIN';
    case ADMIN = 'ADMIN';
    case STAFF = 'STAFF';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
