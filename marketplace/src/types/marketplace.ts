export type StaticResourceType =
  | 'Hoardings'
  | 'Billboards'
  | 'Unipoles'
  | 'Gantries'
  | 'DOOH Screens'
  | 'Bus Shelters'
  | 'Foot Overbridge (FOB)'
  | 'Rooftops'
  | 'Bridge Panels';

export type IlluminationType = 'Front-lit' | 'Back-lit' | 'Digital LED' | 'Non-lit' | 'Ambient / Lit';

export interface LocationMetadata {
  id: string;
  name: string;
  city: string;
  state: string;
  area: string;
  routeName?: string;
  landmark?: string;
  latitude: string;
  longitude: string;
}

export interface MarketplaceResource {
  id: string;
  slug: string;
  name: string;
  type: StaticResourceType;
  location: LocationMetadata;
  widthFt: number;
  heightFt: number;
  totalSqFt: number;
  orientation: string;
  illumination: IlluminationType;
  visibilityFacing: string;
  trafficDwellDaily: string; // e.g. "2,40,000+ Vehicles / Day"
  regularPrice: number;      // Standard retail card rate
  marketplacePrice: number;  // SODAARS Net + configured markup price
  printingRatePerSqFt: number;
  mountingRatePerSqFt: number;
  providerDisplayBadge: string; // e.g. "Verified Partner"
  verifiedCity: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  primaryPhotoUrl: string;
  nightPhotoUrl?: string;
  approachPhotoUrl?: string;
  description: string;
  keyFeatures: string[];
  bookedRanges: Array<{ start: string; end: string }>;
  status: 'Available' | 'Fast Filling' | 'Limited Slots';
  updatedAt: string;
}

export interface MarketplaceFilterState {
  searchQuery: string;
  city: string;
  type: string;
  illumination: string;
  minPrice: number;
  maxPrice: number;
  minSqFt: number;
  maxSqFt: number;
  startDate?: string;
  endDate?: string;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'size_large' | 'rating';
}

export interface GuestBookingRequest {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  locationArea: string;
  city: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  brandName: string;
  campaignTitle: string;
  buyerType: 'Brand / Direct Advertiser' | 'Advertising Agency' | 'Local Enterprise';
  artworkStatus: 'Ready to Print' | 'Need Design & Creative Support' | 'Re-use Existing Flex';
  includePrintingMounting: boolean;
  includePrinting?: boolean;
  rentalAmount: number;
  mountingAmount?: number;
  printingAmount?: number;
  printingMountingAmount: number;
  estimatedGst: number;
  totalEstimatedAmount: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyName: string;
  gstin?: string;
  createdAt: string;
  status: 'Under Review' | 'Confirmed' | 'In Discussion';
}

