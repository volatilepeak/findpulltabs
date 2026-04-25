'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });
  }, [router]);

  return (
    <div className="bg-charcoal-950 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
          <span className="font-display font-bold text-charcoal-900 text-lg">FP</span>
        </div>
        <p className="text-cream-200 font-display text-lg">Signing you in…</p>
        <p className="text-charcoal-400 text-sm mt-2">You&apos;ll be redirected shortly.</p>
      </div>
    </div>
  );
}
