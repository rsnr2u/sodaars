// Generator script to produce 450 AdvertisingResources across all 10 approved categories
// and 45 rich location hubs across major Indian cities, plus synchronized baseline bookings.

const fs = require('fs');
const path = require('path');

const LOCATIONS = [
  // Mumbai
  { id: 'loc-mum-01', name: 'BKC Diamond Bourse Junction', city: 'Mumbai', area: 'Bandra Kurla Complex (BKC)', landmark: 'Opposite Bharat Diamond Bourse', latitude: '19.0657', longitude: '72.8687' },
  { id: 'loc-mum-02', name: 'WEH Andheri Southbound Flyover', city: 'Mumbai', area: 'Andheri East', landmark: 'Near Gundavali Metro Station', latitude: '19.1172', longitude: '72.8592' },
  { id: 'loc-mum-03', name: 'Worli Sea Link Southern Promenade', city: 'Mumbai', area: 'Worli', landmark: 'Bandra-Worli Sea Link Toll Approach', latitude: '19.0178', longitude: '72.8154' },
  { id: 'loc-mum-04', name: 'JVLR Hubtown Solaris Overpass', city: 'Mumbai', area: 'Andheri East', landmark: 'WEH Intersection Overpass', latitude: '19.1247', longitude: '72.8682' },
  { id: 'loc-mum-05', name: 'Lower Parel Kamala Mills Hub', city: 'Mumbai', area: 'Lower Parel', landmark: 'Senapati Bapat Marg Entrance', latitude: '18.9953', longitude: '72.8248' },
  { id: 'loc-mum-06', name: 'Dadar TT Circle Arterial Junction', city: 'Mumbai', area: 'Dadar', landmark: 'Dr. Ambedkar Road Transit Core', latitude: '19.0176', longitude: '72.8436' },
  { id: 'loc-mum-07', name: 'Juhu Tara Road Coastal Arc', city: 'Mumbai', area: 'Juhu', landmark: 'Near JW Marriott Promenade', latitude: '19.1009', longitude: '72.8267' },
  { id: 'loc-mum-08', name: 'Thane Majiwada Flyover Triangle', city: 'Mumbai', area: 'Thane West', landmark: 'Eastern Express Highway & Ghodbunder Link', latitude: '19.2183', longitude: '72.9781' },
  { id: 'loc-mum-09', name: 'Vashi Palm Beach Corridor', city: 'Mumbai', area: 'Navi Mumbai', landmark: 'Near Inorbit Mall Vashi', latitude: '19.0664', longitude: '72.9986' },
  { id: 'loc-mum-10', name: 'Eastern Freeway Chembur Exit', city: 'Mumbai', area: 'Chembur', landmark: 'Panjarpol Junction Elevated Span', latitude: '19.0522', longitude: '72.9005' },

  // Delhi / NCR
  { id: 'loc-del-01', name: 'Connaught Place Radial 3 Outer Circle', city: 'New Delhi', area: 'Connaught Place', landmark: 'Facing Barakhamba Road Exit', latitude: '28.6315', longitude: '77.2167' },
  { id: 'loc-del-02', name: 'Cyber City Rapid Metro Pillar 42', city: 'Gurugram', area: 'DLF Phase 2', landmark: 'Gateway Tower Entry Corridor', latitude: '28.4906', longitude: '77.0901' },
  { id: 'loc-del-03', name: 'Golf Course Road Horizon Center', city: 'Gurugram', area: 'DLF Phase 5', landmark: 'Opposite One Horizon Center', latitude: '28.4552', longitude: '77.0998' },
  { id: 'loc-del-04', name: 'DND Flyway Major Expressway Toll', city: 'Noida', area: 'Sector 15A', landmark: 'Yamuna River Bridge Toll Plaza', latitude: '28.5823', longitude: '77.3021' },
  { id: 'loc-del-05', name: 'Noida Sector 18 Commercial Arc', city: 'Noida', area: 'Sector 18', landmark: 'Atta Market Metro Station Plaza', latitude: '28.5708', longitude: '77.3219' },
  { id: 'loc-del-06', name: 'South Extension Ring Road Flyover', city: 'New Delhi', area: 'South Extension', landmark: 'Near AIIMS - Ring Road Connector', latitude: '28.5684', longitude: '77.2215' },
  { id: 'loc-del-07', name: 'Aerocity Hospitality District Gateway', city: 'New Delhi', area: 'IGI Airport Aerocity', landmark: 'Near Worldmark 1 & 2 Portals', latitude: '28.5522', longitude: '77.1216' },
  { id: 'loc-del-08', name: 'Nehru Place Outer Ring Expressway', city: 'New Delhi', area: 'Nehru Place', landmark: 'Eros Corporate Tower Corridor', latitude: '28.5492', longitude: '77.2524' },

  // Bengaluru
  { id: 'loc-blr-01', name: 'Outer Ring Road Bellandur EcoSpace', city: 'Bengaluru', area: 'Bellandur', landmark: 'Pritech Park & EcoSpace Entry Corridor', latitude: '12.9255', longitude: '77.6835' },
  { id: 'loc-blr-02', name: 'Marathahalli Multiplex Junction Span', city: 'Bengaluru', area: 'Marathahalli', landmark: 'Innovative Multiplex Crossing', latitude: '12.9562', longitude: '77.7011' },
  { id: 'loc-blr-03', name: 'Indiranagar 100 Feet Road Commercial', city: 'Bengaluru', area: 'Indiranagar', landmark: 'Near CMH Road Intersection', latitude: '12.9784', longitude: '77.6408' },
  { id: 'loc-blr-04', name: 'Koramangala 80ft Road Sony Signal', city: 'Bengaluru', area: 'Koramangala', landmark: '4th Block Lifestyle Corridor', latitude: '12.9352', longitude: '77.6245' },
  { id: 'loc-blr-05', name: 'MG Road Trinity Circle Metro Pier', city: 'Bengaluru', area: 'Central Business District', landmark: 'Opposite Taj MG Road', latitude: '12.9738', longitude: '77.6206' },
  { id: 'loc-blr-06', name: 'Electronic City Elevated Tollway Span', city: 'Bengaluru', area: 'Electronic City', landmark: 'Phase 1 Infosys Gate 1 Corridor', latitude: '12.8452', longitude: '77.6602' },
  { id: 'loc-blr-07', name: 'Hebbal Flyover Airport Expressway', city: 'Bengaluru', area: 'Hebbal', landmark: 'Bellary Road International Airport Connect', latitude: '13.0358', longitude: '77.5970' },

  // Hyderabad
  { id: 'loc-hyd-01', name: 'HITEC City Mindspace Rotary', city: 'Hyderabad', area: 'Madhapur', landmark: 'Inorbit Mall & Knowledge City Corridor', latitude: '17.4375', longitude: '78.3820' },
  { id: 'loc-hyd-02', name: 'Cyber Towers Flyover Gantry East', city: 'Hyderabad', area: 'Madhapur', landmark: 'HITEC City Central Overpass', latitude: '17.4504', longitude: '78.3808' },
  { id: 'loc-hyd-03', name: 'Jubilee Hills Checkpost Road 36', city: 'Hyderabad', area: 'Jubilee Hills', landmark: 'Metro Pillar 1400 Commercial Node', latitude: '17.4312', longitude: '78.4075' },
  { id: 'loc-hyd-04', name: 'Banjara Hills Road No 12 City Centre', city: 'Hyderabad', area: 'Banjara Hills', landmark: 'Near Taj Krishna Corridor', latitude: '17.4156', longitude: '78.4382' },
  { id: 'loc-hyd-05', name: 'Gachibowli Outer Ring Road Interchange', city: 'Hyderabad', area: 'Gachibowli', landmark: 'Near IIIT Hyderabad & Wipro Junction', latitude: '17.4401', longitude: '78.3489' },

  // Chennai
  { id: 'loc-chn-01', name: 'Anna Salai Express Corridor', city: 'Chennai', area: 'Thousand Lights', landmark: 'Opposite Spencer Plaza Commercial Complex', latitude: '13.0604', longitude: '80.2608' },
  { id: 'loc-chn-02', name: 'OMR IT Expressway Perungudi Toll', city: 'Chennai', area: 'Perungudi', landmark: 'TIDEL Park & Ascendas IT Park Connect', latitude: '12.9654', longitude: '80.2461' },
  { id: 'loc-chn-03', name: 'Kathipara Cloverleaf Flyover Span', city: 'Chennai', area: 'Guindy', landmark: 'Near Chennai International Airport Highway', latitude: '13.0067', longitude: '80.2012' },
  { id: 'loc-chn-04', name: 'T Nagar Panagal Park Retail Epicenter', city: 'Chennai', area: 'T Nagar', landmark: 'Pondy Bazaar Entry Point', latitude: '13.0405', longitude: '80.2337' },

  // Pune
  { id: 'loc-pun-01', name: 'FC Road Deccan Gymkhana Gateway', city: 'Pune', area: 'Shivajinagar', landmark: 'Near Goodluck Cafe Junction', latitude: '18.5204', longitude: '73.8415' },
  { id: 'loc-pun-02', name: 'MG Road Heritage Arcade Facade', city: 'Pune', area: 'Pune Camp', landmark: 'Near Aurora Towers Main Commercial Road', latitude: '18.5144', longitude: '73.8794' },
  { id: 'loc-pun-03', name: 'Koregaon Park North Main Road', city: 'Pune', area: 'Koregaon Park', landmark: 'Near Burning Ghat Road Crossing', latitude: '18.5362', longitude: '73.8940' },
  { id: 'loc-pun-04', name: 'Hinjawadi Phase 1 IT Hub Portal', city: 'Pune', area: 'Hinjawadi', landmark: 'Wipro Circle & Embassy TechZone Entry', latitude: '18.5912', longitude: '73.7389' },
  { id: 'loc-pun-05', name: 'Viman Nagar Airport Road Flyover', city: 'Pune', area: 'Viman Nagar', landmark: 'Phoenix Marketcity Retail Span', latitude: '18.5679', longitude: '73.9143' },

  // Ahmedabad
  { id: 'loc-ahm-01', name: 'SG Highway Iscon Cross Road Overpass', city: 'Ahmedabad', area: 'Satellite', landmark: 'Near Iscon Mega Mall & BRTS Corridor', latitude: '23.0284', longitude: '72.5068' },
  { id: 'loc-ahm-02', name: 'Prahlad Nagar Corporate Road Hub', city: 'Ahmedabad', area: 'Prahlad Nagar', landmark: 'Opposite Titanium Square', latitude: '23.0125', longitude: '72.5134' },
  { id: 'loc-ahm-03', name: 'Sindhu Bhavan Road (SBR) Prime Arc', city: 'Ahmedabad', area: 'Bodakdev', landmark: 'High-end Dining & Retail Avenue', latitude: '23.0468', longitude: '72.5012' },

  // Kolkata
  { id: 'loc-kol-01', name: 'Park Street Camac Street Crossing', city: 'Kolkata', area: 'Park Street', landmark: 'Central Dining & Lifestyle Boulevard', latitude: '22.5518', longitude: '88.3524' },
  { id: 'loc-kol-02', name: 'Sector V Webel More IT Corridor', city: 'Kolkata', area: 'Salt Lake', landmark: 'Near Webel Bhavan & RDB Boulevard', latitude: '22.5735', longitude: '88.4331' },
  { id: 'loc-kol-03', name: 'New Town Action Area 1 Major Arterial', city: 'Kolkata', area: 'New Town', landmark: 'Near Biswa Bangla Gate & Axis Mall', latitude: '22.5855', longitude: '88.4552' },
  { id: 'loc-kol-04', name: 'EM Bypass Ruby Crossing Elevated Arc', city: 'Kolkata', area: 'Kasba', landmark: 'Ruby General Hospital Connector', latitude: '22.5126', longitude: '88.3995' }
];

// 10 Approved Categories with requested total count = 450
const CATEGORIES_PLAN = [
  { type: 'Hoardings', count: 60, prefix: 'HOARD' },
  { type: 'Billboards', count: 60, prefix: 'BILL' },
  { type: 'Unipoles', count: 50, prefix: 'UNI' },
  { type: 'Gantries', count: 45, prefix: 'GAN' },
  { type: 'Bus Shelters', count: 50, prefix: 'BQS' },
  { type: 'Pole Ads', count: 45, prefix: 'POLE' },
  { type: 'Wall Mounts', count: 40, prefix: 'WALL' },
  { type: 'Rooftops', count: 40, prefix: 'ROOF' },
  { type: 'Bridge Panels', count: 35, prefix: 'BRG' },
  { type: 'Other Static Advertising Assets', count: 25, prefix: 'STAT' },
];

const CURATED_MEDIA_PHOTOS = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
];

const DIMENSION_PROFILES = {
  'Hoardings': [
    { w: 40, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 50, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Right Hand Side (RHS)' },
    { w: 60, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 50, h: 25, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
    { w: 30, h: 15, ill: 'Back-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 18, h: 18, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Right Hand Side (RHS)' },
  ],
  'Billboards': [
    { w: 30, h: 15, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 40, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Right Hand Side (RHS)' },
    { w: 25, h: 12, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 20, h: 10, ill: 'Back-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
  ],
  'Unipoles': [
    { w: 40, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 50, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Right Hand Side (RHS)' },
    { w: 35, h: 15, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 30, h: 15, ill: 'Back-lit', face: 'Both Directions', pos: 'Overhead / Cantilever' },
  ],
  'Gantries': [
    { w: 60, h: 15, ill: 'Back-lit', face: 'Both Directions', pos: 'Overhead / Cantilever' },
    { w: 80, h: 15, ill: 'Back-lit', face: 'Both Directions', pos: 'Overhead / Cantilever' },
    { w: 50, h: 12, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
    { w: 60, h: 12, ill: 'Back-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
  ],
  'Bus Shelters': [
    { w: 20, h: 6, ill: 'Back-lit', face: 'Parallel to Road', pos: 'Left Hand Side (LHS)' },
    { w: 20, h: 5, ill: 'Back-lit', face: 'Parallel to Road', pos: 'Left Hand Side (LHS)' },
    { w: 15, h: 5, ill: 'Back-lit', face: 'Parallel to Road', pos: 'Left Hand Side (LHS)' },
    { w: 24, h: 6, ill: 'Back-lit', face: 'Parallel to Road', pos: 'Left Hand Side (LHS)' },
  ],
  'Pole Ads': [
    { w: 10, h: 4, ill: 'Ambient / Lit', face: 'Both Directions', pos: 'Both Directions (Median)' },
    { w: 8, h: 3, ill: 'Ambient / Lit', face: 'Both Directions', pos: 'Both Directions (Median)' },
    { w: 12, h: 4, ill: 'Ambient / Lit', face: 'Both Directions', pos: 'Both Directions (Median)' },
  ],
  'Wall Mounts': [
    { w: 35, h: 20, ill: 'Non-lit', face: 'Facing Traffic', pos: 'Right Hand Side (RHS)' },
    { w: 40, h: 25, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 30, h: 15, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Right Hand Side (RHS)' },
  ],
  'Rooftops': [
    { w: 40, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
    { w: 50, h: 20, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
    { w: 60, h: 25, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
  ],
  'Bridge Panels': [
    { w: 45, h: 12, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
    { w: 50, h: 12, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
    { w: 40, h: 10, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Overhead / Cantilever' },
  ],
  'Other Static Advertising Assets': [
    { w: 25, h: 12, ill: 'Front-lit', face: 'Facing Traffic', pos: 'Left Hand Side (LHS)' },
    { w: 30, h: 10, ill: 'Ambient / Lit', face: 'Facing Traffic', pos: 'Right Hand Side (RHS)' },
    { w: 20, h: 10, ill: 'Back-lit', face: 'Parallel to Road', pos: 'Left Hand Side (LHS)' },
  ],
};

const BASE_PRICE_RANGES = {
  'Hoardings': [160000, 340000],
  'Billboards': [95000, 220000],
  'Unipoles': [150000, 290000],
  'Gantries': [220000, 480000],
  'Bus Shelters': [45000, 85000],
  'Pole Ads': [25000, 50000],
  'Wall Mounts': [75000, 160000],
  'Rooftops': [140000, 260000],
  'Bridge Panels': [110000, 195000],
  'Other Static Advertising Assets': [55000, 115000],
};

const TOP_ADVERTISERS = [
  'Tata Motors Passenger Vehicles',
  'Samsung India Electronics',
  'Kalyan Jewellers Commercial',
  'HDFC Bank Home Loans',
  'Reliance Jio 5G Unlimited',
  'Titan Watch Retail Campaign',
  'Amazon Prime Video Originals',
  'Cadbury Celebrations Festive',
  'Maruti Suzuki Arena Network',
  'Asian Paints Royale Glitz',
  'Zomato Food Express',
  'OnePlus India Flagship Launch',
  'Flipkart Big Billion Days',
  'Tanishq Festive Collection',
  'LIC of India Public Offer',
  'Amul Fresh Products Dairy',
];

let globalIndex = 1;
const allResources = [];
const baselineBookings = [];

CATEGORIES_PLAN.forEach((category) => {
  const profileList = DIMENSION_PROFILES[category.type];
  const [minPrice, maxPrice] = BASE_PRICE_RANGES[category.type];

  for (let i = 1; i <= category.count; i++) {
    const locIndex = (globalIndex - 1) % LOCATIONS.length;
    const location = LOCATIONS[locIndex];
    const profile = profileList[(i - 1) % profileList.length];

    const padNum = String(globalIndex).padStart(3, '0');
    const id = `res-${location.city.substring(0, 3).toLowerCase()}-${category.prefix.toLowerCase()}-${padNum}`;

    // Price calculation with realistic variability
    const step = (maxPrice - minPrice) / (category.count || 1);
    const rawCustPrice = Math.round((minPrice + step * (i % 8)) / 5000) * 5000;
    const rawSodaarsPrice = Math.round((rawCustPrice * 0.85) / 5000) * 5000;

    // Status: 88% Active, 8% Inactive, 4% Archived
    let status = 'Active';
    if (globalIndex % 25 === 0) {
      status = 'Archived';
    } else if (globalIndex % 12 === 0) {
      status = 'Inactive';
    }

    const totalSqFt = profile.w * profile.h;
    const photo = CURATED_MEDIA_PHOTOS[(globalIndex - 1) % CURATED_MEDIA_PHOTOS.length];

    const resource = {
      id,
      name: `${location.area} ${category.type.slice(0, -1)} Face ${String.fromCharCode(65 + ((i - 1) % 4))}`,
      type: category.type,
      location,
      widthFt: profile.w,
      heightFt: profile.h,
      totalSqFt,
      orientation: profile.face,
      illumination: profile.ill,
      visibilityFacing: profile.pos,
      customerPrice: rawCustPrice,
      sodaarsPrice: rawSodaarsPrice,
      printingRatePerSqFt: 12,
      mountingRatePerSqFt: 5,
      customCreativeFee: 3000,
      marketplaceParticipation: globalIndex % 10 !== 0, // 90% marketplace enabled
      status,
      mediaUrl: photo,
      description: `High impact ${category.type.toLowerCase().slice(0, -1)} delivering prominent dwell-time brand visibility across ${location.area}, ${location.city}.`,
      createdAt: '2026-08-15T10:00:00Z',
      updatedAt: '2026-10-01T12:00:00Z',
    };

    allResources.push(resource);

    // Synchronize baseline bookings for active resources
    if (status === 'Active') {
      const client = TOP_ADVERTISERS[(globalIndex - 1) % TOP_ADVERTISERS.length];
      if (globalIndex % 3 === 0) {
        // 100% Fully Occupied in Oct
        baselineBookings.push({
          id: `bkg-seed-${globalIndex}`,
          resourceId: id,
          clientName: client,
          startDate: '2026-10-01',
          endDate: '2026-10-31',
        });
      } else if (globalIndex % 3 === 1) {
        // Partially Occupied in Oct (e.g. 1st to 18th)
        baselineBookings.push({
          id: `bkg-seed-${globalIndex}`,
          resourceId: id,
          clientName: client,
          startDate: '2026-10-01',
          endDate: '2026-10-18',
        });
      }
      // If % 3 === 2, leave completely Available (0 days booked)
    }

    globalIndex++;
  }
});

console.log(`Generated ${allResources.length} total resources across ${LOCATIONS.length} locations.`);
console.log(`Generated ${baselineBookings.length} seed intervals for realistic occupancy.`);

// 1. Write sampleInventory.ts
const invFilePath = path.join(__dirname, '../src/panel/data/sampleInventory.ts');
const invFileContent = `import { AdvertisingResource, LocationMetadata } from '../types/resource';

export const SAMPLE_LOCATIONS: LocationMetadata[] = ${JSON.stringify(LOCATIONS, null, 2)};

export const SAMPLE_RESOURCES: AdvertisingResource[] = ${JSON.stringify(allResources, null, 2)};
`;
fs.writeFileSync(invFilePath, invFileContent, 'utf8');
console.log(`Saved successfully to ${invFilePath}`);

// 2. Write sampleResourceBookings.ts
const bookingsFilePath = path.join(__dirname, '../src/panel/data/sampleResourceBookings.ts');
const bookingsFileContent = `import { BookingRecord } from '../types/booking';

export interface ResourceBookingInterval {
  id: string;
  resourceId: string;
  clientName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

// Baseline sample bookings for realistic October - November 2026 demonstration
export const BASELINE_RESOURCE_BOOKINGS: ResourceBookingInterval[] = ${JSON.stringify(baselineBookings, null, 2)};

export interface OccupationCalculationResult {
  totalDays: number;
  bookedDays: number;
  freeDays: number;
  occupancyPercent: number;
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
      label: \`\${occupancyPercent}% Booked\`,
      tier: 'warning',
    };
  } else if (occupancyPercent > 0) {
    colorConfig = {
      barBg: 'bg-rose-500',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      label: \`\${occupancyPercent}% Booked\`,
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
    freeSlotHint = \`Booked through \${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • Next free \${dayStr}\`;
  } else if (status === 'PARTIALLY_OCCUPIED') {
    // Find the first free date block
    const scan = new Date(start);
    let firstFree = null;
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
      freeSlotHint = \`Free from \${freeStr} (\${freeDays} days open to sell)\`;
    } else {
      freeSlotHint = \`\${freeDays} days open to sell\`;
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
`;
fs.writeFileSync(bookingsFilePath, bookingsFileContent, 'utf8');
console.log(`Saved successfully to ${bookingsFilePath}`);
