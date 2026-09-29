<?php

namespace App\Enums;

enum ResourceType: string
{
    case HOARDING = 'HOARDING';
    case BILLBOARD = 'BILLBOARD';
    case UNIPOLE = 'UNIPOLE';
    case GANTRY = 'GANTRY';
    case LED_SCREEN = 'LED_SCREEN';
    case DIGITAL_SCREEN = 'DIGITAL_SCREEN';
    case BUS_SHELTER = 'BUS_SHELTER';
    case POLE_AD = 'POLE_AD';
    case WALL_MOUNT = 'WALL_MOUNT';
    case ROOFTOP = 'ROOFTOP';
    case BRIDGE_PANEL = 'BRIDGE_PANEL';
    case OTHER = 'OTHER';

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
