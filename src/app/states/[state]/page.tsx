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
  const typeCounts: Record<string, number> = {};
  stateLocations.forEach((l) => {
    typeCounts[l.type] = (typeCounts[l.type] || 0) + 1;
  });

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

      {/* City directory */}
      <section className="bg-charcoal-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream-200 mb-2">
            Cities in {stateInfo.name}
          </h2>
          <p className="text-charcoal-400 mb-8">
            {cities.length} cities with pull tab locations
          </p>

          {/* Alphabetical grid */}
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

      {/* SEO content */}
      <section className="bg-charcoal-900 py-16 border-t border-charcoal-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-cream-200 mb-4">
            Pull Tabs in {stateInfo.name}
          </h2>
          <div className="prose prose-invert prose-gold max-w-none text-charcoal-300 space-y-4">
            <p>
              {stateInfo.name} has {stateLocations.length.toLocaleString()} known pull tab locations
              across {cities.length} cities. Pull tabs are a form of charitable gaming where proceeds
              support local nonprofits, veterans&apos; organizations, and community programs.
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
              .
            </p>
            <p>
              Use the map above to find pull tab locations near you, or browse by city below.
              Each venue page includes address, directions, and the option to save to your favorites.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
