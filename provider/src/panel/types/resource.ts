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

export interface LocationMetadata {
  id: string;
  name: string;
  city: string;
  area: string;
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
  city: string;
}
