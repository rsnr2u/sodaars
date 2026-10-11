import { BookingSource } from './booking';

export type CampaignExecutionStatus =
  | 'Planned'
  | 'In Execution'
  | 'Proof Submitted'
  | 'Completed';

export const APPROVED_EXECUTION_STATUSES: CampaignExecutionStatus[] = [
  'Planned',
  'In Execution',
  'Proof Submitted',
  'Completed',
];

export interface ExecutionStatusMeta {
  status: CampaignExecutionStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  indicatorBg: string;
  description: string;
}

export const EXECUTION_STATUS_CONFIG: Record<CampaignExecutionStatus, ExecutionStatusMeta> = {
  Planned: {
    status: 'Planned',
    label: 'Planned',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-700',
    badgeBorder: 'border-stone-200',
    indicatorBg: 'bg-stone-400',
    description: 'Campaign execution is planned and scheduled for mounting.',
  },
  'In Execution': {
    status: 'In Execution',
    label: 'Running / In Execution',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    indicatorBg: 'bg-emerald-500',
    description: 'Campaign is actively running and live on media display.',
  },
  'Proof Submitted': {
    status: 'Proof Submitted',
    label: 'Proof Submitted',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-[#EA580C]',
    badgeBorder: 'border-orange-200',
    indicatorBg: 'bg-[#EA580C]',
    description: 'Mounting photo proof has been submitted for client verification.',
  },
  Completed: {
    status: 'Completed',
    label: 'Completed',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-600',
    badgeBorder: 'border-stone-300',
    indicatorBg: 'bg-stone-500',
    description: 'Campaign flighting duration has concluded and dismantled.',
  },
};

export type CampaignExecutionTab =
  | 'All'
  | 'Planned'
  | 'In Execution'
  | 'Proof Submitted'
  | 'Completed';

export const CAMPAIGN_EXECUTION_TABS: CampaignExecutionTab[] = [
  'All',
  'Planned',
  'In Execution',
  'Proof Submitted',
  'Completed',
];

export interface CreativeAssetRecord {
  id: string; // e.g. "CRV-2026-001"
  title: string;
  imageUrl?: string;
  format?: string; // e.g. "Flex Vinyl 380 GSM", "Backlit Fabric", "Digital LED MP4/JPG"
  dimensions?: string; // e.g. "40ft x 20ft (800 sq.ft)"
  uploadedAt?: string;
  version?: number;
  notes?: string;
}

export interface PhotoProofRecord {
  id: string; // e.g. "PRF-2026-001"
  imageUrl?: string;
  caption?: string;
  recordedAt?: string;
  proofType?: 'Day View' | 'Night Illumination' | 'Close-up Inspection' | 'Tear-down Proof';
  notes?: string;
}

export interface CampaignRecord {
  id: string; // e.g. "CMP-2026-001"
  campaignName: string;
  customerId?: string; // e.g. "CUST-2026-001"
  customerName: string;
  companyName?: string;
  bookingReference: string; // e.g. "BKG-2026-001"
  bookingSource?: BookingSource; // 'Provider' | 'Admin' | 'Marketplace'
  resourceId?: string; // e.g. "res-mum-101"
  resourceName: string;
  resourceType?: string; // 'Unipole', 'Gantry', 'Billboard', 'LED Screen', 'Bus Shelter'
  location: string;
  landmark?: string;
  dimensions?: string; // e.g. "40ft x 20ft (800 sq.ft)"
  illumination?: string; // 'Front-lit', 'Back-lit', 'Digital LED', 'Non-lit'
  bookedAmount?: string; // e.g. "185000"
  startDate: string;
  endDate: string;
  executionStatus: CampaignExecutionStatus;
  notes?: string;
  creatives?: CreativeAssetRecord[];
  activeCreative?: CreativeAssetRecord;
  photoProof?: PhotoProofRecord[];
  mountingTeam?: string;
  createdAt?: string;
}
