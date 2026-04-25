import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  STATES,
  getLocationsForCity,
  getCitiesForState,
  slugify,
  venueSlug as getVenueSlug,
  getTypeIcon,
  getTypeLabel,
  formatAddress,
  getDirectionsUrl,
} from '@/lib/data';
import { VenueClient } from './VenueClient';
import { VenueMapClient } from './VenueMapClient';

interface PageProps {
  params: { state: string; city: string; venue: string };
}

export function generateStaticParams() {
  const params: { state: string; city: string; venue: string }[] = [];
  Object.keys(STATES).forEach((stateKey) => {
    const stateInfo = STATES[stateKey];
    const cities = getCitiesForState(stateInfo.abbr);
    cities.forEach((city) => {
      const locs = getLocationsForCity(stateInfo.abbr, city.slug);
      locs.forEach((loc) => {
        params.push({
          state: stateKey,
          city: city.slug,
          venue: getVenueSlug(loc),
        });
      });
    });
  });
  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const stateInfo = STATES[params.state];
  if (!stateInfo) return {};
  const locs = getLocationsForCity(stateInfo.abbr, params.city);
  const loc = locs.find((l) => getVenueSlug(l) === params.venue);
  if (!loc) return {};
  return {
    title: `${loc.name} — Pull Tabs in ${loc.city}, ${stateInfo.abbr}`,
    description: `${loc.name} at ${loc.address}. Find pull tabs, get directions, and save to favorites. ${getTypeLabel(loc.type)} in ${loc.city}, ${stateInfo.name}.`,
  };
}

export default function VenuePage({ params }: PageProps) {
  const stateInfo = STATES[params.state];
  if (!stateInfo) notFound();

  const locs = getLocationsForCity(stateInfo.abbr, params.city);
  const location = locs.find((l) => getVenueSlug(l) === params.venue);
  if (!location) notFound();

  const nearby = locs.filter((l) => l.id !== location.id).slice(0, 6);

  return (
    <div className="bg-charcoal-950 min-h-screen">
      <div className="pt-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-charcoal-400 flex-wrap">
            <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/states/${params.state}`} className="hover:text-gold-300 transition-colors">{stateInfo.name}</Link>
            <span>/</span>
            <Link href={`/states/${params.state}/${params.city}`} className="hover:text-gold-300 transition-colors">{location.city}</Link>
            <span>/</span>
            <span className="text-cream-300 truncate max-w-[200px]">{location.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-2xl">{getTypeIcon(location.type)}</span>
                <span className="text-sm font-medium text-gold-300 bg-gold-300/10 px-2.5 py-0.5 rounded-full">{getTypeLabel(location.type)}</span>
                {location.verified && (
                  <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Verified
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-2">{location.name}</h1>
              {location.organization && location.organization !== location.name && (
                <p className="text-charcoal-400 text-sm">Operated by {location.organization}</p>
              )}
            </div>

            <div className="glass rounded-xl p-6 mb-6 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <p className="text-sm font-medium text-cream-200">Address</p>
                  <p className="text-sm text-charcoal-300">{formatAddress(location)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                <div>
                  <p className="text-sm font-medium text-cream-200">Location</p>
                  <p className="text-sm text-charcoal-300">{location.city}, {stateInfo.name}{location.county ? ` · ${location.county} County` : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                <div>
                  <p className="text-sm font-medium text-cream-200">Games Available</p>
                  <div className="flex gap-2 mt-1">
                    {location.hasPullTabs && <span className="text-xs bg-gold-300/10 text-gold-300 px-2 py-0.5 rounded-full">Pull Tabs</span>}
                    {location.hasBingo && <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded-full">Bingo</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <a href={getDirectionsUrl(location)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gold-300 hover:bg-gold-400 text-charcoal-900 rounded-xl transition-colors shadow-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                Get Directions
              </a>
              <VenueClient locationId={location.id} />
            </div>

            <div className="glass rounded-xl p-6 border border-gold-300/20">
              <h3 className="font-display text-lg font-semibold text-cream-200 mb-2">Is this your venue?</h3>
              <p className="text-sm text-charcoal-400 mb-4">Claim this listing to update hours, add photos, and manage your venue&apos;s profile on FindPullTabs.</p>
              <a
                href={`mailto:badtabits@gmail.com?subject=Claim: ${encodeURIComponent(location.name)}&body=I'd like to claim the listing for ${encodeURIComponent(location.name)} at ${encodeURIComponent(location.address)}.`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gold-300 border border-gold-300/30 hover:border-gold-300/60 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Claim This Location
              </a>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass rounded-xl overflow-hidden h-64">
              <VenueMapClient lat={location.lat} lng={location.lng} name={location.name} />
            </div>

            {nearby.length > 0 && (
              <div className="glass rounded-xl p-5">
                <h3 className="font-display text-sm font-semibold text-gold-300 mb-3">More in {location.city}</h3>
                <div className="space-y-2">
                  {nearby.map((loc) => (
                    <Link key={loc.id} href={`/states/${params.state}/${params.city}/${slugify(loc.name)}`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
                      <span className="text-sm">{getTypeIcon(loc.type)}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-cream-200 group-hover:text-gold-300 transition-colors truncate">{loc.name}</p>
                        <p className="text-xs text-charcoal-500 truncate">{getTypeLabel(loc.type)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: location.name,
        address: { '@type': 'PostalAddress', streetAddress: location.address, addressLocality: location.city, addressRegion: location.state, postalCode: location.zip || undefined },
        geo: { '@type': 'GeoCoordinates', latitude: location.lat, longitude: location.lng },
      }) }} />
    </div>
  );
}
