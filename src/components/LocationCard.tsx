'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { getTypeIcon, getTypeLabel, slugify, getDirectionsUrl } from '@/lib/data';
import type { Location } from '@/lib/data';

interface LocationCardProps {
  location: Location;
  compact?: boolean;
}

export function LocationCard({ location, compact = false }: LocationCardProps) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const faved = isFavorite(location.id);

  const stateSlug = location.state.toLowerCase();
  const citySlug = slugify(location.city);
  const venueSlugStr = slugify(location.name);
  const venueUrl = `/states/${stateSlug}/${citySlug}/${venueSlugStr}`;

  if (compact) {
    return (
      <Link
        href={venueUrl}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
      >
        <span className="text-base">{getTypeIcon(location.type)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-cream-200 group-hover:text-gold-300 truncate transition-colors">
            {location.name}
          </p>
          <p className="text-xs text-charcoal-400 truncate">{location.city}, {location.state}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="glass rounded-xl p-5 card-premium">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Link href={venueUrl} className="group">
            <h3 className="font-display text-lg font-semibold text-cream-200 group-hover:text-gold-300 transition-colors truncate">
              {location.name}
            </h3>
          </Link>
          <span className="inline-flex items-center gap-1 text-xs text-charcoal-400 mt-1">
            {getTypeIcon(location.type)} {getTypeLabel(location.type)}
          </span>
        </div>

        {user && (
          <button
            onClick={() => toggleFavorite(location.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              faved ? 'text-gold-300' : 'text-charcoal-500 hover:text-gold-300'
            }`}
            title={faved ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={faved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-sm text-charcoal-300 mb-4">{location.address}</p>

      <div className="flex gap-2">
        <Link
          href={venueUrl}
          className="flex-1 text-center py-2 text-sm font-medium bg-gold-300 hover:bg-gold-400 text-charcoal-900 rounded-lg transition-colors"
        >
          View Details
        </Link>
        <a
          href={getDirectionsUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium text-gold-300 border border-gold-300/30 hover:border-gold-300/60 rounded-lg transition-colors"
        >
          Directions
        </a>
      </div>
    </div>
  );
}
