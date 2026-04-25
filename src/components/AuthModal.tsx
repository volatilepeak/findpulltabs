'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass rounded-2xl p-8 shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal-400 hover:text-cream-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="font-display font-bold text-charcoal-900 text-lg">FP</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-cream-200">
            {sent ? 'Check your email' : 'Sign in'}
          </h2>
          <p className="text-sm text-charcoal-400 mt-2">
            {sent
              ? `We sent a magic link to ${email}`
              : 'Save your favorite pull tab locations'}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gold-300/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-charcoal-300">
              Click the link in the email to sign in. You can close this window.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 text-sm font-medium text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-cream-200 placeholder-charcoal-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-gold-300/50 transition-all text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-charcoal-900 bg-gold-300 hover:bg-gold-400 disabled:opacity-50 rounded-lg transition-colors"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>

            <p className="text-xs text-center text-charcoal-500">
              No password needed. We&apos;ll send you a sign-in link.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
