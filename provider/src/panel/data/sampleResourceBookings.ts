import { BookingRecord } from '../types/booking';

export interface ResourceBookingInterval {
  id: string;
  resourceId: string;
  clientName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

// Baseline sample bookings for realistic October - November 2026 demonstration
export const BASELINE_RESOURCE_BOOKINGS: ResourceBookingInterval[] = [
  // res-mum-101: 100% Fully Occupied in Oct (01 Oct - 31 Oct) -> Success color (Emerald)
  {
    id: 'bkg-seed-01',
    resourceId: 'res-mum-101',
    clientName: 'ABC Advertising Pvt Ltd',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  },
  // res-blr-102: 20 days out of 31 in Oct (01 Oct - 20 Oct, 65%) -> Warning color (Amber)
  {
    id: 'bkg-seed-02',
    resourceId: 'res-blr-102',
    clientName: 'Zenith Media Plan',
    startDate: '2026-10-01',
    endDate: '2026-10-20',
  },
  // res-del-103: 100% Fully Occupied in Oct (01 Oct - 31 Oct) -> Success color (Emerald)
  {
    id: 'bkg-seed-03',
    resourceId: 'res-del-103',
    clientName: 'Titan Consumer Brands',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  },
  // res-del-104: 16 days out of 31 in Oct (10 Oct - 25 Oct, 52%) -> Warning color (Amber)
  {
    id: 'bkg-seed-04',
    resourceId: 'res-del-104',
    clientName: 'Apex Retail Group',
    startDate: '2026-10-10',
    endDate: '2026-10-25',
  },
  // res-hyd-105: 7 days out of 31 in Oct (01 Oct - 07 Oct, 23% < 30%) -> Danger color (Rose)
  {
    id: 'bkg-seed-05',
    resourceId: 'res-hyd-105',
    clientName: 'Metro Health Care',
    startDate: '2026-10-01',
    endDate: '2026-10-07',
  },
  // res-chn-106: 0 days in Oct (100% Available)
  // res-pun-107: 0 days in Oct (100% Available)
  // res-ahm-108: 8 days out of 31 in Oct (05 Oct - 12 Oct, 26% < 30%) -> Danger color (Rose)
  {
    id: 'bkg-seed-06',
    resourceId: 'res-ahm-108',
    clientName: 'Gujarat FMCG Regional',
    startDate: '2026-10-05',
    endDate: '2026-10-12',
  },
  // res-kol-109: 0 days in Oct (100% Available)
  // res-kol-110: 100% Fully Occupied in Oct (01 Oct - 31 Oct) -> Success color (Emerald)
  {
    id: 'bkg-seed-07',
    resourceId: 'res-kol-110',
    clientName: 'National Telecom West Bengal',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  },
];

export interface OccupationCalculationResult {
  totalDays: number;
  bookedDays: number;
  freeDays: number;
  occupancyPercent: number; // 0 - 100
  status: 'AVAILABLE' | 'PARTIALLY_OCCUPIED' | 'FULLY_OCCUPIED';
  colorConfig: {
    barBg: string;
    text: string;
    bg: string;
    border: string;
    label: string;
    tier: 'danger' | 'warning' | 'success' | 'available';
  };
  freeSlotHint: string;
}

/**
 * Calculates occupation details for a specific resource over a given date range [startDate, endDate].
 * Respects:
 * - Danger color under 30%
 * - Warning color between 30% and 99%
 * - Success color at 100%
 */
export function calculateResourceOccupation(
  resourceId: string,
  startDateStr: string,
  endDateStr: string,
  extraBookings: BookingRecord[] = []
): OccupationCalculationResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const diffTime = end.getTime() - start.getTime();
  const totalDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Combine baseline seed bookings with provider-created bookings from storage
  const allIntervals: { start: Date; end: Date; client?: string }[] = [];

  BASELINE_RESOURCE_BOOKINGS.filter((b) => b.resourceId === resourceId).forEach((b) => {
    allIntervals.push({
      start: new Date(b.startDate),
      end: new Date(b.endDate),
      client: b.clientName,
    });
  });

  extraBookings
    .filter((b) => b.resourceId === resourceId && b.status !== 'CANCELLED' && b.status !== 'DECLINED')
    .forEach((b) => {
      allIntervals.push({
        start: new Date(b.startDate),
        end: new Date(b.endDate),
        client: b.companyName,
      });
    });

  // Calculate day-by-day booked mask within [start, end]
  let bookedDays = 0;
  const cursor = new Date(start);
  const bookedSet = new Set<string>();

  while (cursor <= end) {
    const curTime = cursor.getTime();
    const curIso = cursor.toISOString().split('T')[0];

    const isBooked = allIntervals.some((interval) => {
      return curTime >= interval.start.getTime() && curTime <= interval.end.getTime();
    });

    if (isBooked) {
      bookedDays += 1;
      bookedSet.add(curIso);
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  const freeDays = Math.max(0, totalDays - bookedDays);
  const occupancyPercent = Math.min(100, Math.round((bookedDays / totalDays) * 100));

  let status: 'AVAILABLE' | 'PARTIALLY_OCCUPIED' | 'FULLY_OCCUPIED' = 'AVAILABLE';
  if (bookedDays === 0) {
    status = 'AVAILABLE';
  } else if (bookedDays >= totalDays) {
    status = 'FULLY_OCCUPIED';
  } else {
    status = 'PARTIALLY_OCCUPIED';
  }

  // Color rules per user requirements:
  // - under 30%: danger color (rose-500)
  // - above 30% and below 100%: warning color (amber-500)
  // - 100%: success color (emerald-600)
  let colorConfig: OccupationCalculationResult['colorConfig'];

  if (occupancyPercent === 100) {
    colorConfig = {
      barBg: 'bg-emerald-600',
      text: 'text-emerald-800',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      label: '100% Booked',
      tier: 'success',
    };
  } else if (occupancyPercent >= 30) {
    colorConfig = {
      barBg: 'bg-amber-500',
      text: 'text-amber-800',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: `${occupancyPercent}% Booked`,
      tier: 'warning',
    };
  } else if (occupancyPercent > 0) {
    colorConfig = {
      barBg: 'bg-rose-500',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      label: `${occupancyPercent}% Booked`,
      tier: 'danger',
    };
  } else {
    colorConfig = {
      barBg: 'bg-[#E5E5E5]',
      text: 'text-emerald-800',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      label: 'Available',
      tier: 'available',
    };
  }

  // Next slot hint
  let freeSlotHint = '100% Free for Period';
  if (status === 'FULLY_OCCUPIED') {
    const endNext = new Date(end);
    endNext.setDate(endNext.getDate() + 1);
    const dayStr = endNext.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    freeSlotHint = `Booked through ${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • Next free ${dayStr}`;
  } else if (status === 'PARTIALLY_OCCUPIED') {
    // Find the first free date block
    const scan = new Date(start);
    let firstFree: Date | null = null;
    while (scan <= end) {
      const iso = scan.toISOString().split('T')[0];
      if (!bookedSet.has(iso)) {
        firstFree = new Date(scan);
        break;
      }
      scan.setDate(scan.getDate() + 1);
    }

    if (firstFree) {
      const freeStr = firstFree.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      freeSlotHint = `Free from ${freeStr} (${freeDays} days open to sell)`;
    } else {
      freeSlotHint = `${freeDays} days open to sell`;
    }
  }

  return {
    totalDays,
    bookedDays,
    freeDays,
    occupancyPercent,
    status,
    colorConfig,
    freeSlotHint,
  };
}
