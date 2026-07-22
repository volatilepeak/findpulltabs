'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDarkMode } from './DarkModeProvider';
import { useAuth } from './AuthProvider';
import { AuthModal } from './AuthModal';
import { STATES } from '@/lib/data';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { dark, toggle } = useDarkMode();
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="font-display font-bold text-charcoal-900 text-sm">FP</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-semibold text-gold-300 text-lg tracking-tight">
                  FindPullTabs
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-cream-300 hover:text-gold-300 transition-colors rounded-lg hover:bg-white/5"
              >
                Map
              </Link>
              {Object.entries(STATES).map(([key, state]) => (
                <Link
                  key={key}
                  href={`/states/${key}`}
                  className="px-3 py-2 text-sm font-medium text-cream-300 hover:text-gold-300 transition-colors rounded-lg hover:bg-white/5"
                >
                  {state.abbr}
                </Link>
              ))}
              <Link
                href="/blog"
                className="px-3 py-2 text-sm font-medium text-cream-300 hover:text-gold-300 transition-colors rounded-lg hover:bg-white/5"
              >
                Blog
              </Link>
              <Link
                href="/submit"
                className="px-3 py-2 text-sm font-medium text-cream-300 hover:text-gold-300 transition-colors rounded-lg hover:bg-white/5"
              >
                Submit
              </Link>
		<Link
                href="/creators"
                className="px-3 py-2 text-sm font-medium text-cream-300 hover:text-gold-300 transition-colors rounded-lg hover:bg-white/5"
              >
                Creators
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-cream-300 hover:text-gold-300 hover:bg-white/5 transition-all"
                aria-label="Toggle dark mode"
              >
                {dark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Auth button */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-charcoal-400 truncate max-w-[120px]">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden sm:block px-3 py-1.5 text-sm font-medium text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-lg transition-colors"
                >
                  Sign in
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-cream-300 hover:text-gold-300 hover:bg-white/5 transition-all"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-gold-300/10 animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-cream-200 hover:text-gold-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                🗺️ Map
              </Link>
              {Object.entries(STATES).map(([key, state]) => (
                <Link
                  key={key}
                  href={`/states/${key}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-cream-200 hover:text-gold-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {state.name}
                </Link>
              ))}
              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-cream-200 hover:text-gold-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                📖 Blog
              </Link>
              <Link
                href="/submit"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-cream-200 hover:text-gold-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                ➕ Submit a Location
              </Link>
		<Link
                href="/creators"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-cream-200 hover:text-gold-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Creators
              </Link>
              <div className="pt-2 border-t border-gold-300/10">
                {user ? (
                  <div className="px-3 py-2.5">
                    <p className="text-xs text-charcoal-400 mb-1">{user.email}</p>
                    <button
                      onClick={() => { signOut(); setMenuOpen(false); }}
                      className="text-sm text-gold-400 hover:text-gold-300"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAuthOpen(true); setMenuOpen(false); }}
                    className="w-full px-3 py-2.5 text-sm font-medium text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-lg transition-colors"
                  >
                    Sign in to save favorites
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
