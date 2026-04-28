'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FilterPills } from '@/components/FilterPills';
import { LocationCard } from '@/components/LocationCard';
import { locations, STATES, getStateCounts, searchLocations, slugify, getTypeIcon } from '@/lib/data';
import type { Location } from '@/lib/data';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap').then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-charcoal-900 animate-pulse" /> }
);

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const stateCounts = getStateCounts();

  // Map center based on state selection
  const mapCenter: [number, number] = useMemo(() => {
    if (stateFilter !== 'all' && STATES[stateFilter]) {
      return STATES[stateFilter].center;
    }
    return [44.5, -93.0];
  }, [stateFilter]);

  const mapZoom = useMemo(() => {
    if (stateFilter !== 'all' && STATES[stateFilter]) {
      return STATES[stateFilter].zoom;
    }
    return 6;
  }, [stateFilter]);

  const filteredLocations = useMemo(() => {
    return searchLocations(query, stateFilter, typeFilter);
  }, [query, stateFilter, typeFilter]);

  const typeCounts = useMemo(() => {
    const base = searchLocations(query, stateFilter);
    const counts: Record<string, number> = { all: base.length };
    base.forEach((l) => {
      counts[l.type] = (counts[l.type] || 0) + 1;
      if (l.hasBingo) counts['etabs'] = (counts['etabs'] || 0) + 1;
    });
    return counts;
  }, [query, stateFilter]);

  const visibleLocations = useMemo(() => {
    if (!mapBounds) return filteredLocations.slice(0, 50);
    return filteredLocations
      .filter((l) => {
        try { return mapBounds.contains([l.lat, l.lng]); } catch { return false; }
      })
      .slice(0, 50);
  }, [filteredLocations, mapBounds]);

  const handleBoundsChange = useCallback((bounds: any) => {
    setMapBounds(bounds);
  }, []);

  // Autocomplete search
  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.length >= 2) {
      const found = searchLocations(value, stateFilter).slice(0, 8);
      setSearchResults(found);
      setShowDropdown(found.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }

  return (
    <div className="relative">
      {/* Search + State Selector Bar — ABOVE the map */}
      <section className="bg-charcoal-950 border-b border-gold-300/10 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          {/* Top row: tagline */}
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cream-200 mb-3 text-center">
            Find Pulltabs Near You
          </h1>

          {/* Search row */}
          <div className="flex gap-2 mb-3 relative">
            {/* State selector */}
            <select
              value={stateFilter}
              onChange={(e) => { setStateFilter(e.target.value); setQuery(''); setShowDropdown(false); }}
              className="w-28 sm:w-36 px-3 py-3 rounded-xl bg-charcoal-800 border border-charcoal-700 text-cream-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23A0A0A0' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              <option value="all">All States</option>
              {Object.entries(STATES).map(([key, state]) => (
                <option key={key} value={key}>
                  {state.name} ({stateCounts[key] || 0})
                </option>
              ))}
            </select>

            {/* Search input */}
            <div className="flex-1 relative">
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
                  placeholder="Search city, ZIP, or venue…"
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
                      href={`/states/${loc.state.toLowerCase()}/${slugify(loc.city)}/${slugify(loc.name)}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors border-b border-charcoal-800/50 last:border-0"
                    >
                      <span className="text-base mt-0.5">{getTypeIcon(loc.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream-200 truncate">{loc.name}</p>
                        <p className="text-xs text-charcoal-300 truncate">
                          {loc.city}, {loc.state} · {loc.address}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-gold-300 bg-gold-300/10 px-1.5 py-0.5 rounded mt-1 flex-shrink-0">
                        {loc.state}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter pills */}
          <FilterPills
            activeFilter={typeFilter}
            onChange={setTypeFilter}
            counts={typeCounts}
          />
        </div>
      </section>

      {/* Map Section — no overlays, clean */}
      <section className="relative h-[70vh] min-h-[400px]">
        <LeafletMap
          locations={filteredLocations}
          center={mapCenter}
          zoom={mapZoom}
          height="100%"
          onBoundsChange={handleBoundsChange}
        />

        {/* Sidebar toggle (mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-4 right-4 z-[40] glass px-4 py-2.5 rounded-xl text-sm font-medium text-gold-300 hover:text-gold-200 transition-colors md:hidden"
        >
          {sidebarOpen ? 'Hide List' : `List (${filteredLocations.length})`}
        </button>

        {/* Floating sidebar — desktop only */}
        <div className="absolute top-4 right-4 bottom-4 w-80 z-[30] glass rounded-xl overflow-hidden hidden md:flex flex-col">
          <div className="px-4 py-3 border-b border-gold-300/10 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-gold-300">
              Nearby
              <span className="text-charcoal-400 font-body font-normal ml-1.5">
                {visibleLocations.length} shown
              </span>
            </h2>
            <span className="text-xs text-charcoal-500">
              {filteredLocations.length.toLocaleString()} total
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {visibleLocations.map((loc) => (
              <LocationCard key={loc.id} location={loc} compact />
            ))}
            {visibleLocations.length === 0 && (
              <p className="text-sm text-charcoal-500 text-center py-8">
                No locations in this area. Try zooming out.
              </p>
            )}
          </div>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="absolute inset-x-0 bottom-0 top-0 z-[35] glass md:hidden overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full text-center py-2 text-sm text-gold-300 border-b border-charcoal-800 mb-2"
              >
                ← Back to Map
              </button>
              {visibleLocations.map((loc) => (
                <LocationCard key={loc.id} location={loc} compact />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* States Section */}
      <section className="bg-charcoal-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-3">
              Browse by State
            </h2>
            <p className="text-charcoal-400 max-w-xl mx-auto">
              {locations.length.toLocaleString()} pull tab locations across four states. Select a state to explore.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(STATES).map(([key, state]) => (
              <Link
                key={key}
                href={`/states/${key}`}
                className="glass rounded-xl p-6 text-center card-premium group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {key === 'mn' ? '🏛️' : key === 'ak' ? '🏔️' : key === 'ia' ? '🌽' : '🧀'}
                </div>
                <h3 className="font-display text-lg font-semibold text-cream-200 group-hover:text-gold-300 transition-colors">
                  {state.name}
                </h3>
                <p className="text-gold-300 text-2xl font-bold mt-1">
                  {(stateCounts[key] || 0).toLocaleString()}
                </p>
                <p className="text-xs text-charcoal-400 mt-1">locations</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA Section */}
      <section className="bg-charcoal-900 py-20 border-t border-gold-300/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-4">
            Supporting Local Communities
          </h2>
          <p className="text-charcoal-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Every pull tab you play supports charitable organizations in your community — from youth sports leagues
            to veterans&apos; programs. FindPullTabs helps you find where to play.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="px-8 py-3 text-sm font-semibold text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-xl transition-colors shadow-lg"
            >
              Submit a Location
            </Link>
            <Link
              href="/blog/what-are-pull-tabs"
              className="px-8 py-3 text-sm font-semibold text-gold-300 border border-gold-300/30 hover:border-gold-300/60 rounded-xl transition-colors"
            >
              Learn About Pull Tabs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
