'use client';

export function FacebookBanner() {
  return (
    <a
      href="https://www.facebook.com/pulltabsandmore"
      target="_blank"
      rel="noopener noreferrer"
      className="block glass rounded-xl p-5 border border-gold-300/15 hover:border-gold-300/30 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-cream-200 group-hover:text-gold-300 transition-colors">
            Watch The Tab Club on Facebook
          </p>
          <p className="text-xs text-charcoal-400 mt-0.5">
            20K+ followers ripping tabs, celebrating wins, and supporting the community
          </p>
        </div>
        <svg className="w-5 h-5 text-charcoal-500 group-hover:text-gold-300 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
}
