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
  // ---- Minnesota ----
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

  // Add more venues here as hours are submitted
  // Example:
  // 'mn/minnetonka/dukes-on-7': {
  //   mon: '3:00 PM - Last Call',
  //   tue: '3:00 PM - Last Call',
  //   wed: '3:00 PM - Last Call',
  //   thu: '3:00 PM - Last Call',
  //   fri: '2:00 PM - Last Call',
  //   sat: '2:00 PM - Last Call',
  //   sun: '11:00 AM - 6:00 PM',
  //   sellerType: 'booth',
  //   lastUpdated: '2026-05-14',
  // },
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
