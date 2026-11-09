import { MarketplaceResource, IlluminationType } from '@/types/marketplace';

const CITIES_CORRIDORS = [
  { city: 'Mumbai', state: 'Maharashtra', areas: ['Western Express • Bandra', 'BKC • Bandra Kurla Complex', 'Worli Sea Face Entry', 'Andheri East Metro Line', 'Eastern Freeway Hub', 'Thane Majiwada Flyover'] },
  { city: 'Delhi NCR', state: 'Delhi / Haryana', areas: ['DND Flyway • Noida Gateway', 'Cyber City • Golf Course Road', 'Connaught Place Outer Circle', 'Noida Expressway Sector 18', 'AIIMS Flyover South Ext', 'MG Road Gurgaon'] },
  { city: 'Bengaluru', state: 'Karnataka', areas: ['Outer Ring Road • Bellandur', 'Indiranagar • 100ft Road', 'Electronic City Elevated Flyover', 'Hebbal Flyover Airport Corridor', 'Whitefield ITPL Main Road', 'MG Road Trinity Circle'] },
  { city: 'Hyderabad', state: 'Telangana', areas: ['HITEC City • Cyber Towers', 'Jubilee Hills Check Post', 'Gachibowli Financial District', 'Banjara Hills Road No 1', 'Begumpet Airport Road', 'Madhapur Inorbit Mall Road'] },
  { city: 'Pune', state: 'Maharashtra', areas: ['Hinjewadi IT Park Phase 1', 'Senapati Bapat Road', 'Koregaon Park Main Road', 'Pune-Mumbai Expressway Wakad', 'Shivajinagar Simla Office', 'Viman Nagar Airport Road'] },
  { city: 'Chennai', state: 'Tamil Nadu', areas: ['OMR IT Expressway • Tidel Park', 'Anna Salai • Mount Road', 'Kathipara Junction Flyover', 'T. Nagar Panagal Park', 'Guindy Industrial Estate', 'Poonamallee High Road'] },
];

const FORMAT_TYPES: Array<MarketplaceResource['type']> = [
  'Billboards',
  'Unipoles',
  'Gantries',
  'DOOH Screens',
  'Bus Shelters',
];

const PHOTOS = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
];

export function generateSampleHoardings(count: number = 50): MarketplaceResource[] {
  const generated: MarketplaceResource[] = [];

  for (let i = 1; i <= count; i++) {
    const cityObj = CITIES_CORRIDORS[(i - 1) % CITIES_CORRIDORS.length];
    const area = cityObj.areas[(i - 1) % cityObj.areas.length];
    const type = FORMAT_TYPES[(i - 1) % FORMAT_TYPES.length];
    const photo = PHOTOS[(i - 1) % PHOTOS.length];

    const widths = [30, 40, 50, 60, 25];
    const heights = [15, 20, 25, 12, 10];
    const widthFt = widths[(i - 1) % widths.length];
    const heightFt = heights[(i - 1) % heights.length];
    const totalSqFt = widthFt * heightFt;

    // Prices between 65,000 and 3,20,000
    const priceBases = [85000, 110000, 145000, 190000, 220000, 280000, 320000];
    const marketplacePrice = priceBases[(i - 1) % priceBases.length];
    const regularPrice = Math.round(marketplacePrice * 1.15);

    const padId = String(i).padStart(3, '0');
    const id = `MKT-PLAN-${padId}`;
    const slug = `prime-ooh-asset-${cityObj.city.toLowerCase().replace(/\s+/g, '-')}-${padId}`;

    const illumination: IlluminationType = 
      type === 'DOOH Screens' ? 'Digital LED' : (i % 3 === 0 ? 'Back-lit' : 'Front-lit');

    generated.push({
      id,
      slug,
      name: `${area.split('•')[0].trim()} Premium ${type}`,
      type,
      location: {
        id: `loc-${padId}`,
        name: `${area}, ${cityObj.city}`,
        city: cityObj.city,
        state: cityObj.state,
        area,
        routeName: `${area.split('•')[0].trim()} Corridor`,
        landmark: `Next to ${cityObj.city} Metro Station / Flyover Exit`,
        latitude: '19.0760',
        longitude: '72.8777',
      },
      widthFt,
      heightFt,
      totalSqFt,
      orientation: i % 2 === 0 ? 'Facing North' : 'Facing South / Commuter Flow',
      illumination,
      visibilityFacing: 'Direct Center Unobstructed High-Dwell',
      trafficDwellDaily: `${(120000 + (i * 3500)).toLocaleString('en-IN')}+ Vehicles / Day`,
      regularPrice,
      marketplacePrice,
      printingRatePerSqFt: 14,
      mountingRatePerSqFt: 6,
      providerDisplayBadge: 'Verified Partner',
      verifiedCity: `${cityObj.city} Metro Hub`,
      rating: parseFloat((4.85 + ((i % 15) * 0.01)).toFixed(2)),
      reviewCount: 12 + (i % 20),
      description: `High-impact ${type} media asset situated along prime vehicular arterial corridor in ${cityObj.city}.`,
      keyFeatures: [
        'Audited Daily Traffic Counts',
        'Direct Unobstructed Viewing Distance',
        '100% Escrow Protected'
      ],
      bookedRanges: [],
      status: 'Available',
      primaryPhotoUrl: photo,
      nightPhotoUrl: photo,
      updatedAt: '2026-11-01',
    });
  }

  return generated;
}
