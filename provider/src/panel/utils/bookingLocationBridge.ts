import { BookingRecord } from '../types/booking';
import { SAMPLE_RESOURCES, SAMPLE_LOCATIONS } from '../data/sampleInventory';

export interface ResolvedBookingLocation {
  state: string;
  city: string;
  area: string;
  routeName: string;
  displayLocation: string;
}

// Pre-indexed location map by normalized "city • area" key
const LOCATION_BY_CITY_AREA: Record<string, { state: string; city: string; area: string; routeName: string }> = {};

SAMPLE_LOCATIONS.forEach((loc) => {
  const key = `${loc.city.toLowerCase()} • ${loc.area.toLowerCase()}`;
  if (!LOCATION_BY_CITY_AREA[key]) {
    LOCATION_BY_CITY_AREA[key] = {
      state: loc.state || '',
      city: loc.city,
      area: loc.area,
      routeName: loc.routeName || '',
    };
  }
});

// Resource map by resource ID
const RESOURCE_MAP = new Map<string, (typeof SAMPLE_RESOURCES)[0]>();
SAMPLE_RESOURCES.forEach((r) => {
  RESOURCE_MAP.set(r.id.toLowerCase(), r);
});

// Fallback known dictionary for any standard test / seed locations
const CANONICAL_CITY_MAP: Record<string, { state: string; defaultRoute: string }> = {
  mumbai: { state: 'Maharashtra', defaultRoute: 'Western Express Highway (WEH)' },
  hyderabad: { state: 'Telangana', defaultRoute: 'Hitec City - Gachibowli Corridor' },
  'new delhi': { state: 'Delhi (NCT)', defaultRoute: 'Barakhamba & Radial Outer Circle' },
  delhi: { state: 'Delhi (NCT)', defaultRoute: 'Barakhamba & Radial Outer Circle' },
  bengaluru: { state: 'Karnataka', defaultRoute: 'Outer Ring Road (ORR)' },
  bangalore: { state: 'Karnataka', defaultRoute: 'Outer Ring Road (ORR)' },
  gurugram: { state: 'Haryana', defaultRoute: 'Delhi-Gurgaon Expressway (NH-48)' },
  gurgaon: { state: 'Haryana', defaultRoute: 'Delhi-Gurgaon Expressway (NH-48)' },
  ahmedabad: { state: 'Gujarat', defaultRoute: 'SG Highway Commercial Corridor' },
  chennai: { state: 'Tamil Nadu', defaultRoute: 'Anna Salai (Mount Road) Arterial' },
  pune: { state: 'Maharashtra', defaultRoute: 'MG Road & Camp Central Arterial' },
  kolkata: { state: 'West Bengal', defaultRoute: 'Park Street Cultural Corridor' },
  noida: { state: 'Uttar Pradesh', defaultRoute: 'Noida-Greater Noida Expressway' },
};

/**
 * Resolves full hierarchical location details (State, City, Area, Route Name)
 * for any given BookingRecord.
 */
export function getBookingLocation(booking: BookingRecord): ResolvedBookingLocation {
  // 1. Explicit properties on booking
  if (booking.state && booking.city && booking.area && booking.routeName) {
    return {
      state: booking.state,
      city: booking.city,
      area: booking.area,
      routeName: booking.routeName,
      displayLocation: `${booking.city} • ${booking.area}`,
    };
  }

  // 2. Resolve via linked resource if present
  if (booking.resourceId) {
    const resource = RESOURCE_MAP.get(booking.resourceId.toLowerCase());
    if (resource?.location) {
      return {
        state: booking.state || resource.location.state || '',
        city: booking.city || resource.location.city || '',
        area: booking.area || resource.location.area || '',
        routeName: booking.routeName || resource.location.routeName || '',
        displayLocation: `${resource.location.city} • ${resource.location.area}`,
      };
    }
  }

  // 3. Parse location string (e.g., "Mumbai • Andheri East" or "Gurugram • DLF Phase 2")
  const rawLoc = booking.location || '';
  const parts = rawLoc.split('•').map((p) => p.trim());
  const parsedCity = parts[0] || '';
  const parsedArea = parts[1] || parts[0] || '';

  // Match against indexed location catalog
  const key = `${parsedCity.toLowerCase()} • ${parsedArea.toLowerCase()}`;
  const catalogMatch = LOCATION_BY_CITY_AREA[key];
  if (catalogMatch) {
    return {
      state: booking.state || catalogMatch.state,
      city: booking.city || catalogMatch.city,
      area: booking.area || catalogMatch.area,
      routeName: booking.routeName || catalogMatch.routeName,
      displayLocation: rawLoc,
    };
  }

  // Match against canonical city map fallback
  const cityMeta = CANONICAL_CITY_MAP[parsedCity.toLowerCase()];
  return {
    state: booking.state || cityMeta?.state || 'Other',
    city: booking.city || parsedCity || 'Unspecified',
    area: booking.area || parsedArea || 'General',
    routeName: booking.routeName || cityMeta?.defaultRoute || '',
    displayLocation: rawLoc || 'Unspecified',
  };
}
