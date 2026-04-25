import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-charcoal-950 min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-6xl mb-4">🎰</p>
        <h1 className="font-display text-4xl font-bold text-cream-200 mb-3">Page Not Found</h1>
        <p className="text-charcoal-400 mb-8 max-w-md mx-auto">
          Looks like this tab didn&apos;t have a winner. Let&apos;s get you back to the map.
        </p>
        <Link
          href="/"
          className="inline-flex px-8 py-3 text-sm font-semibold text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-xl transition-colors shadow-lg"
        >
          Back to FindPullTabs
        </Link>
      </div>
    </div>
  );
}
