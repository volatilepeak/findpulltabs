'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FilterPills } from '@/components/FilterPills';
import { slugify, getTypeIcon } from '@/lib/data';
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
  stateKey: string;
}

export function StateMapClient({ locations, center, zoom, stateName, count, stateKey }: Props) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = locations.filter((l) => {
    if (typeFilter !== 'all') {
      if (typeFilter === 'etabs') {
        if (!l.hasBingo) return false;
      } else if (l.type !== typeFilter) return false;
    }
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
    if (l.hasBingo) typeCounts['etabs'] = (typeCounts['etabs'] || 0) + 1;
  });

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.length >= 2) {
      const q = value.toLowerCase();
      const found = locations
        .filter((l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
        )
        .slice(0, 8);
      setSearchResults(found);
      setShowDropdown(found.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }

  return (
    <section>
      {/* Header + Search + Filters — above the map */}
      <div className="bg-charcoal-950 px-4 sm:px-6 py-6 border-b border-gold-300/10">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-1">
            {stateName}
          </h1>
          <p className="text-charcoal-400 mb-4">
            {count.toLocaleString()} pull tab locations
          </p>

          {/* Search */}
          <div className="relative mb-3">
            <div className="flex items-center bg-charcoal-800 border border-charcoal-700 rounded-xl overflow-hidden">
              <div className="pl-3 text-charcoal-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder={`Search in ${stateName}…`}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-cream-200 placeholder-charcoal-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setSearchResults([]); setShowDropdown(false); }}
                  className="px-3 text-charcoal-400 hover:text-cream-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="px-4 py-3 bg-gold-300 hover:bg-gold-400 text-charcoal-900 text-sm font-semibold transition-colors"
              >
                Search
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto custom-scrollbar z-50 animate-slide-down">
                {searchResults.map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/states/${stateKey}/${slugify(loc.city)}/${slugify(loc.name)}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors border-b border-charcoal-800/50 last:border-0"
                  >
                    <span className="text-base mt-0.5">{getTypeIcon(loc.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cream-200 truncate">{loc.name}</p>
                      <p className="text-xs text-charcoal-300 truncate">
                        {loc.city} · {loc.address}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          <FilterPills activeFilter={typeFilter} onChange={setTypeFilter} counts={typeCounts} />
        </div>
      </div>

      {/* Map — clean, no overlays */}
      <div className="h-[50vh] min-h-[350px]">
        <LeafletMap
          locations={filtered}
          center={center}
          zoom={zoom}
          height="100%"
        />
      </div>
    </section>
  );
}
