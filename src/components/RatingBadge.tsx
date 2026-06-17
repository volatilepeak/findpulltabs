'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  stateKey: string;
  citySlug: string;
  venueSlug: string;
}

export function RatingBadge({ stateKey, citySlug, venueSlug }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<number>(0);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('venue_details')
        .select('rating, review_count')
        .eq('state_key', stateKey)
        .eq('city_slug', citySlug)
        .eq('venue_slug', venueSlug)
        .single();
      if (data) {
        setRating(data.rating);
        setReviews(data.review_count || 0);
      }
    }
    fetch();
  }, [stateKey, citySlug, venueSlug]);

  if (!rating) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="text-gold-300">★</span>
      <span className="text-cream-200 font-semibold">{rating}</span>
      {reviews > 0 && (
        <span className="text-charcoal-400">({reviews})</span>
      )}
    </span>
  );
}
