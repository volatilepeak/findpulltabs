import locationsData from '@/data/locations.json';

export interface Location {
  id: number;
  name: string;
  organization: string;
  address: string;
  city: string;
  state: string;
  county: string;
  zip: string;
  type: string;
  lat: number;
  lng: number;
  verified: boolean;
  confirmations: number;
  hasBingo: boolean;
  hasPullTabs: boolean;
}

export const STATES: Record<string, { name: string; abbr: string; center: [number, number]; zoom: number }> = {
  mn: { name: 'Minnesota', abbr: 'MN', center: [46.7296, -94.6859], zoom: 7 },
  ak: { name: 'Alaska', abbr: 'AK', center: [64.2008, -152.4937], zoom: 5 },
  ia: { name: 'Iowa', abbr: 'IA', center: [41.8780, -93.0977], zoom: 7 },
  wi: { name: 'Wisconsin', abbr: 'WI', center: [43.7844, -88.7879], zoom: 7 },
};

export const VENUE_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  'bar-restaurant': { label: 'Bars & Restaurants', icon: '🍺', color: '#D4C5A3' },
  'vfw': { label: 'VFW', icon: '⭐', color: '#7B8CDE' },
  'american-legion': { label: 'American Legion', icon: '🦅', color: '#C17B5E' },
  'eagles': { label: 'Eagles', icon: '🏛️', color: '#8BC7A3' },
  'lions-club': { label: 'Lions Club', icon: '🦁', color: '#E8C547' },
  'bingo-hall': { label: 'Bingo Halls', icon: '🎱', color: '#D47BA3' },
  'pulltab-only': { label: 'Pulltab Only', icon: '🎰', color: '#7BCCD4' },
  'other': { label: 'Other', icon: '📍', color: '#B0B0B0' },
};

export const FILTER_PILLS = [
  { key: 'all', label: 'All', icon: '📍' },
  { key: 'bar-restaurant', label: 'Bars', icon: '🍺' },
  { key: 'vfw', label: 'VFW', icon: '⭐' },
  { key: 'american-legion', label: 'Am. Legion', icon: '🦅' },
  { key: 'eagles', label: 'Eagles', icon: '🏛️' },
  { key: 'lions-club', label: 'Lions Club', icon: '🦁' },
  { key: 'other', label: 'Other', icon: '📌' },
];

// All locations typed
export const locations: Location[] = locationsData as Location[];

// Helper: slugify
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: venue slug (unique per city)
export function venueSlug(loc: Location): string {
  return slugify(loc.name);
}

// Get locations by state
export function getLocationsByState(stateAbbr: string): Location[] {
  return locations.filter((l) => l.state.toLowerCase() === stateAbbr.toLowerCase());
}

// Get unique cities for a state
export function getCitiesForState(stateAbbr: string): { name: string; slug: string; count: number }[] {
  const locs = getLocationsByState(stateAbbr);
  const cityMap = new Map<string, { name: string; count: number }>();

  locs.forEach((l) => {
    const slug = slugify(l.city);
    const existing = cityMap.get(slug);
    if (existing) {
      existing.count++;
    } else {
      cityMap.set(slug, { name: l.city, count: 1 });
    }
  });

  return Array.from(cityMap.entries())
    .map(([slug, data]) => ({ slug, name: data.name, count: data.count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get locations for a specific city in a state
export function getLocationsForCity(stateAbbr: string, citySlug: string): Location[] {
  return locations.filter(
    (l) => l.state.toLowerCase() === stateAbbr.toLowerCase() && slugify(l.city) === citySlug
  );
}

// Get a single location
export function getLocation(stateAbbr: string, citySlug: string, venueSlugStr: string): Location | undefined {
  const cityLocs = getLocationsForCity(stateAbbr, citySlug);
  return cityLocs.find((l) => venueSlug(l) === venueSlugStr);
}

// Search locations
export function searchLocations(query: string, stateFilter?: string, typeFilter?: string): Location[] {
  const q = query.toLowerCase().trim();
  let results = locations;

  if (stateFilter && stateFilter !== 'all') {
    results = results.filter((l) => l.state.toLowerCase() === stateFilter.toLowerCase());
  }

  if (typeFilter && typeFilter !== 'all') {
    results = results.filter((l) => l.type === typeFilter);
  }

  if (q) {
    results = results.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.organization.toLowerCase().includes(q) ||
        l.zip.includes(q)
    );
  }

  return results;
}

// Get type label
export function getTypeLabel(type: string): string {
  return VENUE_TYPES[type]?.label || 'Other';
}

// Get type icon
export function getTypeIcon(type: string): string {
  return VENUE_TYPES[type]?.icon || '📍';
}

// Format address for display
export function formatAddress(loc: Location): string {
  const parts = [loc.address];
  if (!loc.address.includes(loc.city)) {
    parts.push(`${loc.city}, ${loc.state}`);
  }
  if (loc.zip) parts.push(loc.zip);
  return parts.join(', ').replace(/,\s*,/g, ',');
}

// Get Google Maps direction URL
export function getDirectionsUrl(loc: Location): string {
  const addr = encodeURIComponent(`${loc.name}, ${loc.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
}

// State counts
export function getStateCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  locations.forEach((l) => {
    const key = l.state.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}
