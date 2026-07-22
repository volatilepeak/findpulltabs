import Link from 'next/link';
import { STATES } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-gold-300/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center">
                <span className="font-display font-bold text-charcoal-900 text-xs">FP</span>
              </div>
              <span className="font-display font-semibold text-gold-300">FindPullTabs</span>
            </Link>
            <p className="text-sm text-charcoal-400 leading-relaxed">
              The most comprehensive pull tab location directory. Find 3,300+ venues across four states.
            </p>
          </div>

          {/* States */}
          <div>
            <h3 className="font-display font-semibold text-cream-300 text-sm mb-3">States</h3>
            <ul className="space-y-2">
              {Object.entries(STATES).map(([key, state]) => (
                <li key={key}>
                  <Link
                    href={`/states/${key}`}
                    className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-cream-300 text-sm mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/what-are-pull-tabs"
                  className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors"
                >
                  What Are Pull Tabs?
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/best-pull-tab-strategies"
                  className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors"
                >
                  Pull Tab Strategies
                </Link>
              </li>
            </ul>
          </div>

          {/* Site */}
          <div>
            <h3 className="font-display font-semibold text-cream-300 text-sm mb-3">Site</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/submit" className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors">
                  Submit a Location
                </Link>
              </li>
              <li>
                <a
                  href="mailto:badtabits@gmail.com"
                  className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors"
                >
                  Contact Us
                </a>
              </li>
		<li>
  <Link href="/creators" className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors">
    Creators
  		</Link>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal-500">
            &copy; {new Date().getFullYear()} FindPullTabs. All rights reserved.
          </p>
          <p className="text-xs text-charcoal-600">
            Pull tab gaming supports charitable organizations in your community.
          </p>
	<p className="text-xs text-charcoal-500 mt-4">
  If you or someone you know has a gambling problem, call <a href="tel:1-800-522-4700" className="text-charcoal-400 hover:text-gold-300">1-800-522-4700</a> (confidential).
	</p>
	</li>
        </div>
      </div>
    </footer>
  );
}
