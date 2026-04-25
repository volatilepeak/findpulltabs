'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SearchBar } from '@/components/SearchBar';
import { FilterPills } from '@/components/FilterPills';
import { LocationCard } from '@/components/LocationCard';
import { locations, STATES, getStateCounts, searchLocations } from '@/lib/data';
import type { Location } from '@/lib/data';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap').then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-charcoal-900 animate-pulse" /> }
);

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const stateCounts = getStateCounts();

  const filteredLocations = useMemo(() => {
    let results = searchLocations(query, 'all', typeFilter);
    return results;
  }, [query, typeFilter]);

  const typeCounts = useMemo(() => {
    const base = query ? searchLocations(query) : locations;
    const counts: Record<string, number> = { all: base.length };
    base.forEach((l) => {
      counts[l.type] = (counts[l.type] || 0) + 1;
    });
    return counts;
  }, [query]);

  // Locations visible in map bounds for sidebar
  const visibleLocations = useMemo(() => {
    if (!mapBounds) return filteredLocations.slice(0, 50);
    return filteredLocations
      .filter((l) => {
        try {
          return mapBounds.contains([l.lat, l.lng]);
        } catch {
          return false;
        }
      })
      .slice(0, 50);
  }, [filteredLocations, mapBounds]);

  const handleBoundsChange = useCallback((bounds: any) => {
    setMapBounds(bounds);
  }, []);

  return (
    <div className="relative">
      {/* Hero Map Section */}
      <section className="relative h-[85vh] min-h-[500px]">
        <LeafletMap
          locations={filteredLocations}
          center={[44.5, -93.0]}
          zoom={6}
          height="100%"
          onBoundsChange={handleBoundsChange}
        />

        {/* Floating search bar */}
        <SearchBar
          floating
          onSearch={setQuery}
          placeholder="Search by city, ZIP, or venue name…"
        />

        {/* Filter pills overlay */}
        <div className="absolute bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-[40]">
          <FilterPills
            activeFilter={typeFilter}
            onChange={setTypeFilter}
            counts={typeCounts}
          />
        </div>

        {/* Sidebar toggle (mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-20 right-4 z-[40] glass px-4 py-2.5 rounded-xl text-sm font-medium text-gold-300 hover:text-gold-200 transition-colors md:hidden"
        >
          {sidebarOpen ? 'Hide List' : `Show List (${filteredLocations.length})`}
        </button>

        {/* Floating sidebar */}
        <div
          className={`
            absolute top-16 right-4 bottom-20 w-80 z-[30]
            glass rounded-xl overflow-hidden
            transition-transform duration-300
            hidden md:flex flex-col
          `}
        >
          <div className="px-4 py-3 border-b border-gold-300/10">
            <h2 className="font-display text-sm font-semibold text-gold-300">
              Nearby Locations
              <span className="text-charcoal-400 font-body font-normal ml-2">
                {visibleLocations.length} shown
              </span>
            </h2>
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
          <div className="absolute inset-x-0 bottom-0 top-16 z-[35] glass md:hidden overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-2">
              {visibleLocations.map((loc) => (
                <LocationCard key={loc.id} location={loc} compact />
              ))}
            </div>
          </div>
        )}

        {/* Location count badge */}
        <div className="absolute top-[72px] right-4 z-[40] hidden md:block">
          <div className="glass px-3 py-1.5 rounded-lg">
            <span className="text-xs font-medium text-gold-300">
              {filteredLocations.length.toLocaleString()} locations
            </span>
          </div>
        </div>
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
