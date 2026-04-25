'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchLocations, slugify, getTypeIcon } from '@/lib/data';
import type { Location } from '@/lib/data';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
  floating?: boolean;
}

export function SearchBar({
  onSearch,
  className = '',
  placeholder = 'Search by city, ZIP, or venue name…',
  floating = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const found = searchLocations(query).slice(0, 8);
      setResults(found);
      setShowResults(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSearch) onSearch(query);
    setShowResults(false);
  }

  const wrapperClass = floating
    ? 'absolute top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[520px] z-[40]'
    : '';

  return (
    <div ref={ref} className={`${wrapperClass} ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center ${floating ? 'glass' : 'bg-charcoal-800 border border-charcoal-700'} rounded-xl shadow-xl overflow-hidden`}>
          <div className="pl-4 text-charcoal-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-3 py-3.5 text-sm text-cream-200 placeholder-charcoal-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); if (onSearch) onSearch(''); }}
              className="px-3 text-charcoal-400 hover:text-cream-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-3.5 bg-gold-300 hover:bg-gold-400 text-charcoal-900 text-sm font-semibold transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Autocomplete results */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto custom-scrollbar animate-slide-down">
          {results.map((loc) => (
            <Link
              key={loc.id}
              href={`/states/${loc.state.toLowerCase()}/${slugify(loc.city)}/${slugify(loc.name)}`}
              onClick={() => setShowResults(false)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-charcoal-800/50 last:border-0"
            >
              <span className="text-lg mt-0.5">{getTypeIcon(loc.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cream-200 truncate">{loc.name}</p>
                <p className="text-xs text-charcoal-400 truncate">
                  {loc.city}, {loc.state} · {loc.address}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
