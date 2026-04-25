'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SearchBar } from '@/components/SearchBar';
import { FilterPills } from '@/components/FilterPills';
import type { Location } from '@/lib/data';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap').then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-[50vh] bg-charcoal-900 animate-pulse" /> }
);

interface Props {
  locations: Location[];
  center: [number, number];
  zoom: number;
  stateName: string;
  count: number;
}

export function StateMapClient({ locations, center, zoom, stateName, count }: Props) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = locations.filter((l) => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const typeCounts: Record<string, number> = { all: locations.length };
  locations.forEach((l) => {
    typeCounts[l.type] = (typeCounts[l.type] || 0) + 1;
  });

  return (
    <section className="relative">
      {/* State header */}
      <div className="bg-charcoal-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-1">
            {stateName}
          </h1>
          <p className="text-charcoal-400">
            {count.toLocaleString()} pull tab locations
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[50vh] min-h-[350px]">
        <LeafletMap
          locations={filtered}
          center={center}
          zoom={zoom}
          height="100%"
        />
        <SearchBar
          floating
          onSearch={setQuery}
          placeholder={`Search in ${stateName}…`}
        />
        <div className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-[40]">
          <FilterPills activeFilter={typeFilter} onChange={setTypeFilter} counts={typeCounts} />
        </div>
      </div>
    </section>
  );
}
