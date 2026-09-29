<?php

namespace App\Enums;

enum RegistrationSource: string
{
    case ADMIN = 'ADMIN';
    case STAFF = 'STAFF';
    case SELF = 'SELF';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
