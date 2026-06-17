'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface HoursData {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
  notes?: string;
  seller_type?: string;
  updated_at?: string;
}

interface VenueDetailsData {
  rating?: number;
  review_count?: number;
  photo_url?: string;
}

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABELS: Record<string, string> = {
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

export function VenueHoursClaimed({ stateKey, citySlug, venueSlug, venueName, venueAddress }: Props) {
  const [hours, setHours] = useState<HoursData | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [details, setDetails] = useState<VenueDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch hours
      const { data: hoursData } = await supabase
        .from('venue_hours')
        .select('*')
        .eq('state_key', stateKey)
        .eq('city_slug', citySlug)
        .eq('venue_slug', venueSlug)
        .single();
      if (hoursData) setHours(hoursData);

      // Fetch claimed status
      const { data: claimData } = await supabase
        .from('claimed_venues')
        .select('*')
        .eq('state_key', stateKey)
        .eq('city_slug', citySlug)
        .eq('venue_slug', venueSlug)
        .single();
      if (claimData) setClaimed(true);

      // Fetch Google details (rating, reviews, photo)
      const { data: detailsData } = await supabase
        .from('venue_details')
        .select('rating, review_count, photo_url')
        .eq('state_key', stateKey)
        .eq('city_slug', citySlug)
        .eq('venue_slug', venueSlug)
        .single();
      if (detailsData) setDetails(detailsData);

      setLoading(false);
    }
    fetchData();
  }, [stateKey, citySlug, venueSlug]);

  const submitSubject = hours ? `Update Hours: ${venueName}` : `Submit Hours: ${venueName}`;
  const submitBody = `Venue: ${venueName}\nAddress: ${venueAddress}\n\nPull Tab / Gambling Hours:\nMonday: \nTuesday: \nWednesday: \nThursday: \nFriday: \nSaturday: \nSunday: \n\nSeller Type (Booth or Bar): \n\nAny notes: \n`;
  const mailtoUrl = `mailto:badtabits@gmail.com?subject=${encodeURIComponent(submitSubject)}&body=${encodeURIComponent(submitBody)}`;

  return (
    <div className="space-y-6">
      {/* Photo */}
      {details?.photo_url && (
        <div className="rounded-xl overflow-hidden h-48 sm:h-64">
          <img
            src={details.photo_url}
            alt={`${venueName} photo`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Rating + Claimed badges row */}
      {(details?.rating || claimed) && (
        <div className="flex flex-wrap gap-3">
          {/* Rating badge */}
          {details?.rating && (
            <div className="glass rounded-xl px-4 py-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-gold-300 text-lg">★</span>
                <span className="text-cream-200 text-lg font-bold">{details.rating}</span>
              </div>
              {details.review_count ? (
                <span className="text-charcoal-400 text-sm">
                  ({details.review_count.toLocaleString()} review{details.review_count !== 1 ? 's' : ''})
                </span>
              ) : null}
            </div>
          )}

          {/* Claimed badge */}
          {claimed && (
            <div className="glass rounded-xl px-4 py-3 border border-gold-400/30 bg-gradient-to-r from-gold-300/5 to-transparent flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gold-300/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gold-300">Claimed Venue</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gambling Hours */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-display text-lg font-semibold text-cream-200">Gambling Hours</h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="w-20 h-4 bg-charcoal-800 rounded animate-pulse" />
                <div className="w-32 h-4 bg-charcoal-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : hours ? (
          <div>
            {hours.seller_type && hours.seller_type !== 'unknown' && (
              <div className="mb-3">
                <span className="text-xs font-medium text-charcoal-300 bg-charcoal-800 px-2 py-1 rounded">
                  Seller Type: {hours.seller_type === 'booth' ? '🎪 Booth' : hours.seller_type === 'bar' ? '🍺 Bar' : hours.seller_type === 'both' ? '🍺 Bar & 🎪 Booth' : hours.seller_type}
                </span>
              </div>
            )}
            <div className="space-y-1.5">
              {DAY_KEYS.map((key) => {
                const value = hours[key];
                return value ? (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-300 w-24">{DAY_LABELS[key]}</span>
                    <span className="text-cream-200 font-medium">{value}</span>
                  </div>
                ) : null;
              })}
            </div>
            {hours.notes && <p className="text-xs text-charcoal-400 mt-3 italic">{hours.notes}</p>}
            {hours.updated_at && (
              <p className="text-xs text-charcoal-500 mt-2">
                Last updated: {new Date(hours.updated_at).toLocaleDateString()}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-charcoal-800">
              <p className="text-xs text-charcoal-500 mb-2">Hours incorrect?</p>
              <a href={mailtoUrl} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gold-300 border border-gold-300/30 hover:border-gold-300/60 hover:bg-gold-300/5 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Updated Hours
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-charcoal-400 mb-3">Gambling hours not yet listed for this venue.</p>
            <a href={mailtoUrl} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gold-300 border border-gold-300/30 hover:border-gold-300/60 hover:bg-gold-300/5 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit Gambling Hours
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
