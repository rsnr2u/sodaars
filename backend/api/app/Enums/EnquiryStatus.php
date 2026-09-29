<?php

namespace App\Enums;

enum EnquiryStatus: string
{
    case NEW = 'NEW';
    case UNDER_REVIEW = 'UNDER_REVIEW';
    case QUOTED = 'QUOTED';
    case NEGOTIATING = 'NEGOTIATING';
    case CONVERTED = 'CONVERTED';
    case LOST = 'LOST';
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

    /**
     * Check if a transition from current status to target status is valid.
     */
    public function canTransitionTo(self $target): bool
    {
        if ($this === $target) {
            return true;
        }

        return match ($this) {
            self::NEW => in_array($target, [self::UNDER_REVIEW, self::CANCELLED], true),
            self::UNDER_REVIEW => in_array($target, [self::QUOTED, self::LOST, self::CANCELLED], true),
            self::QUOTED => in_array($target, [self::NEGOTIATING, self::CONVERTED, self::LOST, self::CANCELLED], true),
            self::NEGOTIATING => in_array($target, [self::QUOTED, self::CONVERTED, self::LOST, self::CANCELLED], true),
            self::CONVERTED => false, // Terminal in Stage 8
            self::LOST => in_array($target, [self::UNDER_REVIEW], true), // Re-opened
            self::CANCELLED => false, // Terminal
        };
    }
}
