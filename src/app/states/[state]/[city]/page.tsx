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
  const abbr = stateInfo.abbr;
  const etabCount = locs.filter((l) => l.hasBingo).length;
  return {
    title: `Pull Tabs in ${cityName}, ${abbr} — ${locs.length} Pull Tab & E-Tab Locations`,
    description: `${cityName}, ${stateInfo.name} has ${locs.length} pull tab locations${etabCount > 0 ? ` including ${etabCount} with e-tabs` : ''}. Find pull tabs, e-tabs, and bingo near you. Browse bars, VFW posts, American Legion halls, and more with directions.`,
    alternates: { canonical: `https://findpulltabs.com/states/${params.state}/${params.city}` },
    keywords: [
      `pull tabs ${cityName} ${abbr}`,
      `pull tabs near me ${cityName}`,
      `e-tabs ${cityName}`,
      `bingo ${cityName} ${abbr}`,
      `charitable gambling ${cityName}`,
      `bars with pull tabs ${cityName}`,
    ],
    openGraph: {
      title: `Pull Tabs in ${cityName}, ${abbr} — ${locs.length} Locations | FindPullTabs`,
      description: `Find ${locs.length} pull tab and e-tab locations in ${cityName}, ${stateInfo.name} with directions.`,
    },
  };
}

export default function CityPage({ params }: PageProps) {
  const stateInfo = STATES[params.state];
  if (!stateInfo) notFound();

  const cityLocations = getLocationsForCity(stateInfo.abbr, params.city);
  if (cityLocations.length === 0) notFound();

  const cityName = cityLocations[0].city;
  const etabCount = cityLocations.filter((l) => l.hasBingo).length;

  const avgLat = cityLocations.reduce((s, l) => s + l.lat, 0) / cityLocations.length;
  const avgLng = cityLocations.reduce((s, l) => s + l.lng, 0) / cityLocations.length;

  const allCities = getCitiesForState(stateInfo.abbr);
  const nearbyCities = allCities
    .filter((c) => c.slug !== params.city)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div>
      <div className="bg-charcoal-950 pt-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/states/${params.state}`} className="hover:text-gold-300 transition-colors">{stateInfo.name}</Link>
            <span>/</span>
            <span className="text-cream-300">{cityName}</span>
          </nav>
        </div>
      </div>

      <div className="bg-charcoal-950 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-1">
            Pull Tabs in {cityName}, {stateInfo.abbr}
          </h1>
          <p className="text-charcoal-400">
            {cityLocations.length} location{cityLocations.length !== 1 ? 's' : ''} with pull tabs
            {etabCount > 0 && ` · ${etabCount} with e-tabs`}
          </p>
        </div>
      </div>

      <CityMapClient locations={cityLocations} center={[avgLat, avgLng]} />

      <section className="bg-charcoal-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityLocations.map((loc) => {
              const venueUrl = `/states/${params.state}/${params.city}/${slugify(loc.name)}`;
              return (
                <div key={loc.id} className="glass rounded-xl p-5 card-premium">
                  <Link href={venueUrl} className="group">
                    <h3 className="font-display text-lg font-semibold text-cream-200 group-hover:text-gold-300 transition-colors mb-1">{loc.name}</h3>
                  </Link>
                  <span className="inline-flex items-center gap-1 text-xs text-charcoal-400 mb-2">
                    {getTypeIcon(loc.type)} {getTypeLabel(loc.type)}
                  </span>
                  <div className="flex gap-1.5 mb-3">
                    {loc.hasPullTabs && <span className="text-[11px] bg-gold-300/10 text-gold-300 px-1.5 py-0.5 rounded">Pull Tabs</span>}
                    {loc.hasBingo && <span className="text-[11px] bg-blue-400/10 text-blue-400 px-1.5 py-0.5 rounded">E-Tabs</span>}
                  </div>
                  <p className="text-sm text-charcoal-300 mb-4">{loc.address}</p>
                  <div className="flex gap-2">
                    <Link href={venueUrl} className="flex-1 text-center py-2 text-sm font-medium bg-gold-300 hover:bg-gold-400 text-charcoal-900 rounded-lg transition-colors">View Details</Link>
                    <a href={getDirectionsUrl(loc)} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-gold-300 border border-gold-300/30 hover:border-gold-300/60 rounded-lg transition-colors">Directions</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {nearbyCities.length > 0 && (
        <section className="bg-charcoal-900 py-12 border-t border-charcoal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-xl font-bold text-cream-200 mb-4">More Pull Tab Cities in {stateInfo.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {nearbyCities.map((city) => (
                <Link key={city.slug} href={`/states/${params.state}/${city.slug}`} className="flex items-center justify-between px-4 py-3 rounded-lg bg-charcoal-800/50 border border-charcoal-700 hover:border-gold-300/30 transition-all group">
                  <span className="text-sm text-cream-300 group-hover:text-gold-300 transition-colors truncate">{city.name}</span>
                  <span className="text-xs text-charcoal-500 ml-2 flex-shrink-0">{city.count}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/states/${params.state}`} className="text-sm text-gold-400 hover:text-gold-300 transition-colors">View all cities in {stateInfo.name} →</Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-charcoal-950 py-12 border-t border-charcoal-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold text-cream-200 mb-3">Pull Tabs, E-Tabs &amp; Bingo in {cityName}, {stateInfo.abbr}</h2>
          <div className="text-charcoal-300 text-sm leading-relaxed space-y-3">
            <p>
              {cityName}, {stateInfo.name} has {cityLocations.length} pull tab
              {cityLocations.length !== 1 ? ' locations' : ' location'} listed on FindPullTabs
              {etabCount > 0 && `, including ${etabCount} venue${etabCount !== 1 ? 's' : ''} with electronic pull tabs (e-tabs)`}.
              Find pull tabs, e-tabs, bingo, and other charitable gambling games at bars, VFW posts, American Legion halls, Eagles clubs, and other venues in {cityName}.
            </p>
            <p>
              Pull tabs are a form of charitable gaming regulated by the{' '}
              <Link href={`/states/${params.state}`} className="text-gold-300 hover:text-gold-200 underline">{stateInfo.name}</Link>{' '}
              Gambling Control Board. When you play pull tabs in {cityName}, proceeds support local nonprofits, veterans&apos; organizations, youth sports, and community programs.
            </p>
            <p>
              New to pull tabs? Learn{' '}
              <Link href="/blog/what-are-pull-tabs" className="text-gold-300 hover:text-gold-200 underline">what pull tabs are</Link>
              {' '}or read{' '}
              <Link href="/blog/best-pull-tab-strategies" className="text-gold-300 hover:text-gold-200 underline">tips from experienced players</Link>
              . Interested in electronic gaming? Check out our guide to{' '}
              <Link href="/blog/electronic-pull-tabs-explained" className="text-gold-300 hover:text-gold-200 underline">e-tabs and how they work</Link>.
            </p>
            <p>
              Know of a pull tab location in {cityName} that&apos;s not listed?{' '}
              <Link href="/submit" className="text-gold-300 hover:text-gold-200 underline">Submit it here</Link>
              {' '}and we&apos;ll add it after verification.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
