import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, getLocationsForCity, getCitiesForState, slugify, getTypeIcon, getTypeLabel, getDirectionsUrl } from '@/lib/data';
import { CityMapClient } from './CityMapClient';

interface PageProps {
  params: { state: string; city: string };
}

export function generateStaticParams() {
  const params: { state: string; city: string }[] = [];
  Object.keys(STATES).forEach((stateKey) => {
    const cities = getCitiesForState(STATES[stateKey].abbr);
    cities.forEach((city) => {
      params.push({ state: stateKey, city: city.slug });
    });
  });
  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const stateInfo = STATES[params.state];
  if (!stateInfo) return {};
  const locs = getLocationsForCity(stateInfo.abbr, params.city);
  if (locs.length === 0) return {};
  const cityName = locs[0].city;
  return {
    title: `Pull Tabs in ${cityName}, ${stateInfo.abbr} — ${locs.length} Locations`,
    description: `Find ${locs.length} pull tab locations in ${cityName}, ${stateInfo.name}. Bars, VFW posts, American Legion halls, and more.`,
  };
}

export default function CityPage({ params }: PageProps) {
  const stateInfo = STATES[params.state];
  if (!stateInfo) notFound();

  const cityLocations = getLocationsForCity(stateInfo.abbr, params.city);
  if (cityLocations.length === 0) notFound();

  const cityName = cityLocations[0].city;

  // Compute center from locations
  const avgLat = cityLocations.reduce((s, l) => s + l.lat, 0) / cityLocations.length;
  const avgLng = cityLocations.reduce((s, l) => s + l.lng, 0) / cityLocations.length;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-charcoal-950 pt-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/states/${params.state}`} className="hover:text-gold-300 transition-colors">
              {stateInfo.name}
            </Link>
            <span>/</span>
            <span className="text-cream-300">{cityName}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-charcoal-950 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-1">
            Pull Tabs in {cityName}, {stateInfo.abbr}
          </h1>
          <p className="text-charcoal-400">
            {cityLocations.length} location{cityLocations.length !== 1 ? 's' : ''} with pull tabs
          </p>
        </div>
      </div>

      {/* Map */}
      <CityMapClient
        locations={cityLocations}
        center={[avgLat, avgLng]}
      />

      {/* Venue List */}
      <section className="bg-charcoal-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityLocations.map((loc) => {
              const venueUrl = `/states/${params.state}/${params.city}/${slugify(loc.name)}`;
              return (
                <div key={loc.id} className="glass rounded-xl p-5 card-premium">
                  <Link href={venueUrl} className="group">
                    <h3 className="font-display text-lg font-semibold text-cream-200 group-hover:text-gold-300 transition-colors mb-1">
                      {loc.name}
                    </h3>
                  </Link>
                  <span className="inline-flex items-center gap-1 text-xs text-charcoal-400 mb-3">
                    {getTypeIcon(loc.type)} {getTypeLabel(loc.type)}
                  </span>
                  <p className="text-sm text-charcoal-300 mb-4">{loc.address}</p>
                  <div className="flex gap-2">
                    <Link
                      href={venueUrl}
                      className="flex-1 text-center py-2 text-sm font-medium bg-gold-300 hover:bg-gold-400 text-charcoal-900 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={getDirectionsUrl(loc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-gold-300 border border-gold-300/30 hover:border-gold-300/60 rounded-lg transition-colors"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="bg-charcoal-900 py-12 border-t border-charcoal-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold text-cream-200 mb-3">
            About Pull Tabs in {cityName}
          </h2>
          <p className="text-charcoal-300 text-sm leading-relaxed">
            {cityName}, {stateInfo.name} has {cityLocations.length} pull tab{' '}
            {cityLocations.length !== 1 ? 'locations' : 'location'} listed on FindPullTabs.
            Pull tabs are a form of charitable gaming where proceeds support local nonprofits and community organizations.
            Visit any of the venues listed above to play pull tabs and support charitable causes in {cityName}.
          </p>
        </div>
      </section>
    </div>
  );
}
