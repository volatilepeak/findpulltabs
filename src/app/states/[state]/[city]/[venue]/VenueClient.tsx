'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { AuthModal } from '@/components/AuthModal';

export function VenueClient({ locationId }: { locationId: number }) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const faved = isFavorite(locationId);

  function handleFavorite() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    toggleFavorite(locationId);
  }

  return (
    <>
      <button
        onClick={handleFavorite}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-all ${
          faved
            ? 'bg-gold-300/20 text-gold-300 border border-gold-300/40'
            : 'text-gold-300 border border-gold-300/30 hover:border-gold-300/60'
        }`}
      >
        <svg className="w-4 h-4" fill={faved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {faved ? 'Saved' : 'Save to Favorites'}
      </button>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
