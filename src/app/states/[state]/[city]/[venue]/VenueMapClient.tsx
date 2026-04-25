'use client';

import dynamic from 'next/dynamic';
import type { Location } from '@/lib/data';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap').then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-charcoal-900 animate-pulse" /> }
);

export function VenueMapClient({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const loc: Location = {
    id: 0, name, organization: '', address: '', city: '', state: '',
    county: '', zip: '', type: 'other', lat, lng, verified: false,
    confirmations: 0, hasBingo: false, hasPullTabs: true,
  };

  return (
    <LeafletMap
      locations={[loc]}
      center={[lat, lng]}
      zoom={15}
      height="100%"
    />
  );
}
