'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface HoursData {
  mon?: string; tue?: string; wed?: string; thu?: string;
  fri?: string; sat?: string; sun?: string;
  notes?: string; seller_type?: string; updated_at?: string;
}

interface VenueDetailsData {
  rating?: number;
  review_count?: number;
  photo_url?: string;
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
};
const DAY_FULL: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

interface Props {
  stateKey: string;
  citySlug: string;
  venueSlug: string;
  venueName: string;
  venueAddress: string;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-5 h-5 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {partial > 0 && (
        <div className="relative w-5 h-5">
          <svg className="absolute w-5 h-5 text-charcoal-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute overflow-hidden" style={{ width: `${partial * 100}%` }}>
            <svg className="w-5 h-5 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-5 h-5 text-charcoal-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function VenueHoursClaimed({ stateKey, citySlug, venueSlug, venueName, venueAddress }: Props) {
  const [hours, setHours] = useState<HoursData | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [claimedPhotos, setClaimedPhotos] = useState<string[]>([]);
  const [details, setDetails] = useState<VenueDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: hoursData } = await supabase
        .from('venue_hours').select('*')
        .eq('state_key', stateKey).eq('city_slug', citySlug).eq('venue_slug', venueSlug).single();
      if (hoursData) setHours(hoursData);

      const { data: claimData } = await supabase
        .from('claimed_venues').select('*')
        .eq('state_key', stateKey).eq('city_slug', citySlug).eq('venue_slug', venueSlug).single();
      if (claimData) {
        setClaimed(true);
        if (claimData.photos && claimData.photos.length > 0) setClaimedPhotos(claimData.photos);
      }

      const { data: detailsData } = await supabase
        .from('venue_details').select('rating, review_count, photo_url')
        .eq('state_key', stateKey).eq('city_slug', citySlug).eq('venue_slug', venueSlug).single();
      if (detailsData) setDetails(detailsData);

      setLoading(false);
    }
    fetchData();
  }, [stateKey, citySlug, venueSlug]);

  const photos = claimedPhotos.length > 0 ? claimedPhotos : details?.photo_url ? [details.photo_url] : [];
  const hasMultiplePhotos = photos.length > 1;

  const submitSubject = hours ? `Update Hours: ${venueName}` : `Submit Hours: ${venueName}`;
  const submitBody = `Venue: ${venueName}\nAddress: ${venueAddress}\n\nPull Tab / Gambling Hours:\nMonday: \nTuesday: \nWednesday: \nThursday: \nFriday: \nSaturday: \nSunday: \n\nSeller Type (Booth or Bar): \n\nAny notes: \n`;
  const mailtoUrl = `mailto:badtabits@gmail.com?subject=${encodeURIComponent(submitSubject)}&body=${encodeURIComponent(submitBody)}`;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-56 bg-charcoal-800 rounded-xl animate-pulse" />
        <div className="h-20 bg-charcoal-800 rounded-xl animate-pulse" />
        <div className="h-48 bg-charcoal-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Hero Photo */}
      {photos.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <div className="h-56 sm:h-72">
            <img
              src={photos[activePhoto]}
              alt={`${venueName}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Carousel controls */}
          {hasMultiplePhotos && (
            <>
              <button
                onClick={() => setActivePhoto((p) => (p === 0 ? photos.length - 1 : p - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white/90 flex items-center justify-center hover:bg-black/60 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => setActivePhoto((p) => (p === photos.length - 1 ? 0 : p + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white/90 flex items-center justify-center hover:bg-black/60 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, idx) => (
                  <button key={idx} onClick={() => setActivePhoto(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === activePhoto ? 'bg-gold-300 w-5' : 'bg-white/40 hover:bg-white/60'}`} />
                ))}
              </div>
            </>
          )}

          {/* Photo badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {claimedPhotos.length > 0 && (
              <span className="bg-gold-300 text-charcoal-900 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Owner Photo
              </span>
            )}
          </div>
          {hasMultiplePhotos && (
            <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white/90 text-[11px] px-2 py-1 rounded-lg">
              {activePhoto + 1}/{photos.length}
            </span>
          )}
        </div>
      )}

      {/* Rating + Claimed Row */}
      {(details?.rating || claimed) && (
        <div className="flex flex-wrap items-stretch gap-3">
          {/* Rating Card */}
          {details?.rating && (
            <div className="glass rounded-xl px-5 py-4 flex items-center gap-4 flex-1 min-w-[220px]">
              <div className="text-center">
                <p className="text-3xl font-bold text-cream-200">{details.rating}</p>
                <p className="text-[10px] text-charcoal-400 mt-0.5">out of 5</p>
              </div>
              <div className="border-l border-charcoal-700 pl-4">
                <StarRating rating={details.rating} />
                {details.review_count ? (
                  <p className="text-xs text-charcoal-400 mt-1">
                    Based on {details.review_count.toLocaleString()} review{details.review_count !== 1 ? 's' : ''}
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {/* Claimed Badge */}
          {claimed && (
            <div className="glass rounded-xl px-5 py-4 border border-gold-400/20 bg-gradient-to-br from-gold-300/5 via-transparent to-transparent flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-300/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gold-300">Claimed Venue</p>
                <p className="text-[11px] text-charcoal-400">Managed by the venue</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gambling Hours */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-charcoal-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-display text-base font-semibold text-cream-200">Gambling Hours</h2>
          {hours?.seller_type && hours.seller_type !== 'unknown' && (
            <span className="ml-auto text-[11px] font-medium text-charcoal-300 bg-charcoal-800 px-2.5 py-1 rounded-full">
              {hours.seller_type === 'booth' ? '🎪 Booth' : hours.seller_type === 'bar' ? '🍺 Bar' : hours.seller_type === 'both' ? '🍺 Bar & 🎪 Booth' : hours.seller_type}
            </span>
          )}
        </div>

        {hours ? (
          <div className="px-5 py-4">
            <div className="divide-y divide-charcoal-800/50">
              {DAY_KEYS.map((key) => {
                const value = hours[key];
                if (!value) return null;
                const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === DAY_FULL[key].toLowerCase();
                const isClosed = value.toLowerCase() === 'closed';
                return (
                  <div key={key} className={`flex items-center justify-between py-2.5 ${isToday ? '' : ''}`}>
                    <div className="flex items-center gap-2">
                      {isToday && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                      <span className={`text-sm ${isToday ? 'text-cream-200 font-semibold' : 'text-charcoal-300'}`}>
                        {DAY_FULL[key]}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isClosed ? 'text-charcoal-500' : isToday ? 'text-gold-300 font-semibold' : 'text-cream-200'}`}>
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>

            {hours.notes && (
              <div className="mt-4 pt-4 border-t border-charcoal-800">
                <p className="text-xs text-charcoal-300 leading-relaxed">
                  <span className="text-gold-300 font-medium">Note:</span> {hours.notes}
                </p>
              </div>
            )}

            {hours.updated_at && (
              <p className="text-[11px] text-charcoal-500 mt-3">
                Last updated {new Date(hours.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-charcoal-800">
              <a href={mailtoUrl} className="inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-gold-300 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Suggest an update to these hours
              </a>
            </div>
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-charcoal-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-charcoal-400 mb-1">Hours not listed yet</p>
            <p className="text-xs text-charcoal-500 mb-4">Know when they offer pull tabs?</p>
            <a href={mailtoUrl} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Submit Hours
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
