<?php

namespace App\Enums;

enum ScheduleStatus: string
{
    case CONFIRMED = 'CONFIRMED';
    case TENTATIVE = 'TENTATIVE';
    case CANCELLED = 'CANCELLED';

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
