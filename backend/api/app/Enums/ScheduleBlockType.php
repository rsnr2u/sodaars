<?php

namespace App\Enums;

enum ScheduleBlockType: string
{
    case BOOKING = 'BOOKING';
    case MAINTENANCE = 'MAINTENANCE';
    case CIVIC_HOLD = 'CIVIC_HOLD';
    case INTERNAL_BLOCK = 'INTERNAL_BLOCK';
    case TENTATIVE_HOLD = 'TENTATIVE_HOLD';

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
