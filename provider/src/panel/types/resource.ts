export type StaticResourceType =
  | 'Hoardings'
  | 'Billboards'
  | 'Unipoles'
  | 'Gantries'
  | 'Bus Shelters'
  | 'Pole Ads'
  | 'Wall Mounts'
  | 'Rooftops'
  | 'Bridge Panels'
  | 'Other Static Advertising Assets';

export const APPROVED_RESOURCE_TYPES: StaticResourceType[] = [
  'Hoardings',
  'Billboards',
  'Unipoles',
  'Gantries',
  'Bus Shelters',
  'Pole Ads',
  'Wall Mounts',
  'Rooftops',
  'Bridge Panels',
  'Other Static Advertising Assets',
];

export type ResourceStatus = 'Active' | 'Inactive' | 'Archived';

export type IlluminationType = 'Front-lit' | 'Back-lit' | 'Non-lit' | 'Ambient / Lit';

export const APPROVED_ILLUMINATION_TYPES: IlluminationType[] = [
  'Front-lit',
  'Back-lit',
  'Non-lit',
  'Ambient / Lit',
];

export const INDIAN_STATES: string[] = [
  'Maharashtra',
  'Karnataka',
  'Telangana',
  'Delhi NCR',
  'Haryana',
  'Uttar Pradesh',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Kerala',
  'Punjab',
];

export const COMMON_TRANSIT_ROUTES: Record<string, string[]> = {
  Mumbai: [
    'Western Express Highway (WEH)',
    'Eastern Express Highway (EEH)',
    'S.V. Road Corridor',
    'Linking Road & Turner Road',
    'Bandra-Worli Sea Link Promenade',
    'JVLR (Jogeshwari-Vikhroli Link Road)',
    'Eastern Freeway Corridor',
    'SCLR (Santacruz-Chembur Link Road)',
    'Palm Beach Road Corridor',
    'Ghodbunder Road Arterial',
  ],
  Bengaluru: [
    'Outer Ring Road (ORR - Silk Board to Marathahalli)',
    'Airport Expressway (Bellary Road)',
    'Old Madras Road Corridor',
    'Hosur Road Elevated Expressway',
    'MG Road & Brigade Road Core',
    'Sarjapur Main Road',
    'Bannerghatta Road Corridor',
  ],
  Hyderabad: [
    'PVNR Elevated Expressway',
    'Outer Ring Road (ORR - Gachibowli to Airport)',
    'Hitec City - Madhapur Arterial',
    'Jubilee Hills Checkpost Arterial',
    'Banjara Hills Road No. 1 & 12',
    'Begumpet - Secunderabad Corridor',
  ],
  'New Delhi': [
    'Inner Ring Road Corridor',
    'Outer Ring Road Core',
    'Barakhamba & Connaught Radial',
    'Delhi-Noida Direct (DND) Flyway',
    'Mathura Road Corridor',
    'Aerocity Arterial Reach',
  ],
  Gurugram: [
    'Delhi-Gurgaon Expressway (NH-48)',
    'Cyber City Rapid Metro Corridor',
    'Golf Course Road Arterial',
    'Golf Course Extension Road',
    'Sohna Elevated Corridor',
  ],
  Noida: [
    'DND Flyway Expressway',
    'Noida-Greater Noida Expressway',
    'Sector 18 Commercial Core',
    'FNG Expressway Corridor',
  ],
  Vijayawada: [
    'Bandar Road (MG Road Corridor)',
    'Eluru Road Main Arterial',
    'NH-16 Chennai-Kolkata Highway Corridor',
    'Benz Circle to Ramavarappadu Ring Road',
  ],
  Pune: [
    'Pune-Mumbai Expressway Bypass',
    'Senapati Bapat Road Arterial',
    'Kalyani Nagar - Viman Nagar Corridor',
    'Hinjawadi IT Park Main Road',
  ],
};

export interface LocationMetadata {
  id: string;
  name: string;
  state: string;
  city: string;
  area: string;
  routeName?: string;
  landmark?: string;
  latitude?: string;
  longitude?: string;
}

export interface AdvertisingResource {
  id: string;
  name: string;
  type: StaticResourceType;
  location: LocationMetadata;
  widthFt: number;
  heightFt: number;
  totalSqFt: number;
  orientation: string;
  illumination: IlluminationType;
  visibilityFacing: string;
  customerPrice: number | null;
  sodaarsPrice: number | null;
  printingRatePerSqFt?: number | null;
  mountingRatePerSqFt?: number | null;
  customCreativeFee?: number | null;
  marketplaceParticipation: boolean;
  status: ResourceStatus;
  mediaUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFilterState {
  searchQuery: string;
  type: string;
  status: string;
  marketplace: string;
  state: string;
  city: string;
  area: string;
  routeName: string;
}
