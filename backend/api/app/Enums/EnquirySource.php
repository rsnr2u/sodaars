<?php

namespace App\Enums;

enum EnquirySource: string
{
    case DIRECT_VISIT = 'DIRECT_VISIT';
    case PHONE = 'PHONE';
    case EMAIL = 'EMAIL';
    case WEBSITE = 'WEBSITE';
    case AGENCY_RFQ = 'AGENCY_RFQ';
    case REFERRAL = 'REFERRAL';
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
