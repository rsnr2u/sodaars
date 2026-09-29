<?php

namespace App\Enums;

enum LeadStatus: string
{
    case NEW = 'NEW';
    case CONTACTED = 'CONTACTED';
    case CONVERTED = 'CONVERTED';
    case ARCHIVED = 'ARCHIVED';

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
     * Enforce strict lead lifecycle state transitions.
     *
     * NEW -> CONTACTED, ARCHIVED
     * CONTACTED -> CONVERTED, ARCHIVED
     * CONVERTED = terminal
     * ARCHIVED = terminal
     */
    public function canTransitionTo(LeadStatus $target): bool
    {
        return match ($this) {
            self::NEW => in_array($target, [self::CONTACTED, self::ARCHIVED], true),
            self::CONTACTED => in_array($target, [self::CONVERTED, self::ARCHIVED], true),
            self::CONVERTED, self::ARCHIVED => false,
        };
    }
}
