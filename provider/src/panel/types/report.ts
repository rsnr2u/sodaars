export type ReportDateRangePreset =
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'LAST_30_DAYS'
  | 'CURRENT_QUARTER'
  | 'FINANCIAL_YEAR'
  | 'CUSTOM';

export interface DateRangeConfig {
  preset: ReportDateRangePreset;
  label: string;
  startDate: string;
  endDate: string;
}

export type ReportTabId =
  | 'occupancy'
  | 'revenue'
  | 'bookings'
  | 'campaigns'
  | 'operations';

export interface ReportTabMeta {
  id: ReportTabId;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
}

export const REPORT_TABS: ReportTabMeta[] = [
  {
    id: 'occupancy',
    label: 'Inventory Occupancy & Utilization',
    shortLabel: 'Occupancy & Utilization',
    description: 'Asset utilization percentages, occupied vs vacant display days, and idle inventory alerts.',
    iconName: 'BarChart2',
  },
  {
    id: 'revenue',
    label: 'Revenue & Commercial Yield',
    shortLabel: 'Revenue & Yield',
    description: 'Gross invoiced revenue, realization per square foot, and media format contribution.',
    iconName: 'TrendingUp',
  },
  {
    id: 'bookings',
    label: 'Booking Channels & Distribution',
    shortLabel: 'Booking Channels',
    description: 'Provider Direct vs Admin Placed vs Marketplace channel volume and average deal size.',
    iconName: 'PieChart',
  },
  {
    id: 'campaigns',
    label: 'Campaign & POP Compliance',
    shortLabel: 'Campaign & POP',
    description: 'Mounting turnaround hours, client photographic proof compliance, and inspection SLA.',
    iconName: 'CheckCircle2',
  },
  {
    id: 'operations',
    label: 'Operational Health & Maintenance',
    shortLabel: 'Maintenance & Uptime',
    description: 'Display uptime tracking, lighting/structural incidents, repair turnaround, and downtime.',
    iconName: 'ShieldAlert',
  },
];

export interface OccupancyMetricRecord {
  resourceId: string;
  resourceName: string;
  resourceType: 'Unipole' | 'Gantry' | 'Billboard' | 'Digital LED' | 'Bus Shelter';
  city: string;
  area: string;
  landmark: string;
  dimensions: string;
  sqftArea: number;
  totalDays: number;
  occupiedDays: number;
  vacantDays: number;
  utilizationPercent: number;
  revenueGenerated: number;
  ratePerSqFt: number;
  currentStatus: 'Occupied / Running' | 'Vacant / Idle' | 'Scheduled Next' | 'Under Maintenance';
}

export interface RevenueMonthlyRecord {
  month: string; // e.g. "Oct 2026"
  totalRevenue: number;
  directRevenue: number;
  adminRevenue: number;
  marketplaceRevenue: number;
  bookingCount: number;
  avgRatePerSqFt: number;
}

export interface TopRevenueLocationRecord {
  locationId: string;
  resourceName: string;
  city: string;
  type: string;
  revenue: number;
  occupancyPercent: number;
  clientCount: number;
}

export interface BookingChannelRecord {
  source: 'Provider' | 'Admin' | 'Marketplace';
  label: string;
  count: number;
  totalAmount: number;
  percentage: number;
  avgDealSize: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface CampaignComplianceRecord {
  campaignId: string;
  campaignName: string;
  customerName: string;
  companyName: string;
  resourceName: string;
  city: string;
  startDate: string;
  endDate: string;
  mountingTurnaroundHours: number; // SLA <= 24 hrs
  popSubmittedOnTime: boolean;
  popPhotosCount: number;
  hasNightIlluminationProof: boolean;
  clientVerified: boolean;
  executionStatus: 'In Execution' | 'Completed' | 'Proof Submitted' | 'Planned';
}

export interface OperationalIncidentRecord {
  incidentId: string;
  resourceId: string;
  resourceName: string;
  city: string;
  issueType: 'Electrical / Lighting' | 'Vinyl Tear / Damage' | 'Structural Inspection' | 'Digital LED Glitch';
  loggedDate: string;
  resolvedDate: string;
  downtimeHours: number;
  assignedCrew: string;
  costIncurred: number;
  status: 'Resolved' | 'In Progress' | 'Scheduled Maintenance';
  notes: string;
}

export interface ExecutiveReportSummary {
  portfolioOccupancyRate: number; // e.g. 78.5%
  totalBookedRevenue: number; // e.g. ₹24,80,000
  totalDisplayDaysBooked: number; // e.g. 342 days
  activeLiveFlights: number; // e.g. 4
  popComplianceRate: number; // e.g. 96.2%
  operationalUptimePercent: number; // e.g. 99.4%
  idleAssetsCount: number; // e.g. 2
}
