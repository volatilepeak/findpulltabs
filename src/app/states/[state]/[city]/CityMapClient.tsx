'use client';

import dynamic from 'next/dynamic';
import type { Location } from '@/lib/data';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap').then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-[40vh] bg-charcoal-900 animate-pulse" /> }
);

interface Props {
  locations: Location[];
  center: [number, number];
}

export function CityMapClient({ locations, center }: Props) {
  return (
    <div className="h-[40vh] min-h-[280px]">
      <LeafletMap
        locations={locations}
        center={center}
        zoom={13}
        height="100%"
      />
    </div>
  );
}
