import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, getLocationsByState, getCitiesForState, getStateCounts } from '@/lib/data';
import { StateMapClient } from './StateMapClient';

interface PageProps {
  params: { state: string };
}

export function generateStaticParams() {
  return Object.keys(STATES).map((state) => ({ state }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const stateInfo = STATES[params.state];
  if (!stateInfo) return {};
  const count = getLocationsByState(stateInfo.abbr).length;
  const abbr = stateInfo.abbr;
  return {
    title: `Pull Tabs in ${stateInfo.name} — ${count} Pull Tab, E-Tab & Bingo Locations`,
    description: `${stateInfo.name} has ${count} pull tab locations. Find pull tabs, e-tabs, bingo, and charitable gambling near you in ${abbr}. Browse bars, VFW posts, American Legion halls, Eagles clubs, and more by city with directions.`,
    keywords: [
      `pull tabs ${stateInfo.name}`,
      `pull tabs near me ${abbr}`,
      `e-tabs ${stateInfo.name}`,
      `bingo ${stateInfo.name}`,
      `charitable gambling ${stateInfo.name}`,
      `${stateInfo.name} pull tab locations`,
      `find pull tabs ${abbr}`,
      `VFW pull tabs ${abbr}`,
    ],
    openGraph: {
      title: `Pull Tabs in ${stateInfo.name} — ${count} Locations | FindPullTabs`,
      description: `Find ${count} pull tab, e-tab, and bingo locations in ${stateInfo.name}. Browse by city with directions.`,
    },
  };
}

export default function StatePage({ params }: PageProps) {
  const stateInfo = STATES[params.state];
  if (!stateInfo) notFound();

  const stateLocations = getLocationsByState(stateInfo.abbr);
  const cities = getCitiesForState(stateInfo.abbr);
  const stateCounts = getStateCounts();

  const typeCounts: Record<string, number> = {};
  stateLocations.forEach((l) => {
    typeCounts[l.type] = (typeCounts[l.type] || 0) + 1;
  });

  const etabCount = stateLocations.filter((l) => l.hasBingo).length;

  // Top cities by location count
  const topCities = [...cities].sort((a, b) => b.count - a.count).slice(0, 12);

  // Other states for cross-linking
  const otherStates = Object.entries(STATES).filter(([key]) => key !== params.state);

  return (
    <div>
      {/* Hero map */}
      <StateMapClient
        locations={stateLocations}
        center={stateInfo.center}
        zoom={stateInfo.zoom}
        stateName={stateInfo.name}
        count={stateLocations.length}
        stateKey={params.state}
      />

      {/* Popular Cities */}
      {topCities.length > 0 && (
        <section className="bg-charcoal-900 py-12 border-b border-charcoal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-cream-200 mb-2">
              Popular Cities for Pull Tabs in {stateInfo.name}
            </h2>
            <p className="text-charcoal-400 text-sm mb-6">
              Top cities with the most pull tab locations in {stateInfo.abbr}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {topCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/states/${params.state}/${city.slug}`}
                  className="glass rounded-xl p-4 text-center card-premium group"
                >
                  <p className="text-sm font-medium text-cream-200 group-hover:text-gold-300 transition-colors">
                    {city.name}
                  </p>
                  <p className="text-gold-300 text-lg font-bold mt-1">{city.count}</p>
                  <p className="text-[11px] text-charcoal-500">locations</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Cities directory */}
      <section className="bg-charcoal-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream-200 mb-2">
            All Cities in {stateInfo.name}
          </h2>
          <p className="text-charcoal-400 mb-8">
            {cities.length} cities with pull tab, e-tab, and bingo locations
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/states/${params.state}/${city.slug}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-charcoal-900/50 border border-charcoal-800 hover:border-gold-300/30 hover:bg-charcoal-800/50 transition-all group"
              >
                <span className="text-sm text-cream-300 group-hover:text-gold-300 transition-colors truncate">
                  {city.name}
                </span>
                <span className="text-xs text-charcoal-500 ml-2 flex-shrink-0">
                  {city.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-state links */}
      <section className="bg-charcoal-900 py-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold text-cream-200 mb-4">
            Pull Tabs in Other States
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {otherStates.map(([key, state]) => (
              <Link
                key={key}
                href={`/states/${key}`}
                className="flex items-center justify-between px-5 py-4 rounded-xl bg-charcoal-800/50 border border-charcoal-700 hover:border-gold-300/30 transition-all group"
              >
                <div>
                  <p className="text-sm font-medium text-cream-200 group-hover:text-gold-300 transition-colors">
                    {state.name}
                  </p>
                  <p className="text-xs text-charcoal-400">
                    {stateCounts[key] || 0} pull tab locations
                  </p>
                </div>
                <svg className="w-4 h-4 text-charcoal-500 group-hover:text-gold-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content with blog links */}
      <section className="bg-charcoal-950 py-16 border-t border-charcoal-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-cream-200 mb-4">
            Pull Tabs &amp; Charitable Gambling in {stateInfo.name}
          </h2>
          <div className="prose prose-invert prose-gold max-w-none text-charcoal-300 space-y-4 text-sm leading-relaxed">
            <p>
              {stateInfo.name} has {stateLocations.length.toLocaleString()} known pull tab locations
              across {cities.length} cities, making it one of the most active charitable gaming states in the country.
              {etabCount > 0 && ` Of these, ${etabCount} venues offer electronic pull tabs (e-tabs) for a modern gaming experience.`}
            </p>
            <p>
              Common venue types include{' '}
              {Object.entries(typeCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([type, count], i, arr) => {
                  const labels: Record<string, string> = {
                    'bar-restaurant': 'bars and restaurants',
                    'vfw': 'VFW posts',
                    'american-legion': 'American Legion halls',
                    'eagles': 'Eagles clubs',
                    'lions-club': 'Lions clubs',
                    'other': 'other venues',
                  };
                  const label = labels[type] || type;
                  if (i === arr.length - 1) return `and ${label} (${count})`;
                  return `${label} (${count})`;
                })
                .join(', ')}
              . Pull tab proceeds support local nonprofits, veterans&apos; organizations, youth sports, and community programs.
            </p>
            <p>
              New to pull tabs? Check out our guide on{' '}
              <Link href="/blog/what-are-pull-tabs" className="text-gold-300 hover:text-gold-200 underline">
                what pull tabs are and how they work
              </Link>
              , or read our{' '}
              <Link href="/blog/best-pull-tab-strategies" className="text-gold-300 hover:text-gold-200 underline">
                tips from experienced players
              </Link>
              . You can also learn about{' '}
              <Link href="/blog/electronic-pull-tabs-explained" className="text-gold-300 hover:text-gold-200 underline">
                electronic pull tabs (e-tabs)
              </Link>
              {' '}and how they&apos;re modernizing charitable gaming.
            </p>
            <p>
              Use the map above to find pull tab locations near you in {stateInfo.name}, or browse
              the city directory to explore specific areas. Each venue page includes address, directions,
              games available, and the option to{' '}
              <Link href="/submit" className="text-gold-300 hover:text-gold-200 underline">
                submit updates or new locations
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
