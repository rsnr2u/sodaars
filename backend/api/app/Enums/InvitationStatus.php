<?php

namespace App\Enums;

enum InvitationStatus: string
{
    case PENDING = 'PENDING';
    case ACCEPTED = 'ACCEPTED';
    case EXPIRED = 'EXPIRED';
    case REVOKED = 'REVOKED';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
