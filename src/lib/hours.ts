// Gambling hours data - keyed by "state/city-slug/venue-slug"
// These are PULL TAB / GAMBLING hours, not bar hours
// Add entries as they're submitted or verified

export interface VenueHours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
  notes?: string;
  sellerType?: 'booth' | 'bar' | 'unknown';
  lastUpdated?: string;
}

// Key format: "state/city-slug/venue-slug"
export const HOURS_DATA: Record<string, VenueHours> = {
  'mn/maple-grove/chanticlear-pizza': {
    mon: '11:00 AM - 11:00 PM',
    tue: '11:00 AM - 11:00 PM',
    wed: '11:00 AM - 11:00 PM',
    thu: '11:00 AM - 11:00 PM',
    fri: '11:00 AM - 11:00 PM',
    sat: '11:00 AM - 11:00 PM',
    sun: '11:00 AM - 11:00 PM',
    sellerType: 'bar',
    lastUpdated: '2026-05-14',
  },

  'mn/shakopee/eagles-aerie-4120': {
    mon: '10:00 AM - 12:30 AM',
    tue: '10:00 AM - 12:30 AM',
    wed: '10:00 AM - 12:30 AM',
    thu: '10:00 AM - 12:30 AM',
    fri: '10:00 AM - 12:30 AM',
    sat: '9:00 AM - 12:30 AM',
    sun: '9:00 AM - 10:30 PM',
    notes: '$1, $2, and $5 boxes available',
    sellerType: 'bar',
    lastUpdated: '2026-06-08',
  },
};

export function getVenueHours(stateKey: string, citySlug: string, venueSlug: string): VenueHours | null {
  const key = `${stateKey}/${citySlug}/${venueSlug}`;
  return HOURS_DATA[key] || null;
}

export const DAY_LABELS: { key: keyof VenueHours; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];
