<?php

namespace App\Enums;

enum ProviderRole: string
{
    case PROVIDER_OWNER = 'PROVIDER_OWNER';
    case PROVIDER_MANAGER = 'PROVIDER_MANAGER';
    case PROVIDER_STAFF = 'PROVIDER_STAFF';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
