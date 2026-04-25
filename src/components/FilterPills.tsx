'use client';

import { FILTER_PILLS } from '@/lib/data';

interface FilterPillsProps {
  activeFilter: string;
  onChange: (filter: string) => void;
  counts?: Record<string, number>;
  className?: string;
}

export function FilterPills({ activeFilter, onChange, counts, className = '' }: FilterPillsProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      {FILTER_PILLS.map((pill) => {
        const isActive = activeFilter === pill.key;
        const count = counts?.[pill.key];
        return (
          <button
            key={pill.key}
            onClick={() => onChange(pill.key)}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-200 border
              ${
                isActive
                  ? 'filter-pill-active'
                  : 'bg-charcoal-800/80 text-charcoal-300 border-charcoal-700 hover:border-gold-300/30 hover:text-cream-200'
              }
            `}
          >
            <span className="text-sm">{pill.icon}</span>
            <span>{pill.label}</span>
            {count !== undefined && (
              <span className={`text-xs ${isActive ? 'text-charcoal-700' : 'text-charcoal-500'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
