import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About FindPullTabs — The Largest Pull Tab Directory',
  description: 'FindPullTabs is the most comprehensive pull tab, e-tab, and charitable gambling location directory covering Minnesota, Alaska, Iowa, and Wisconsin.',
  alternates: { canonical: 'https://findpulltabs.com/about' },
};

export default function AboutPage() {
  return (
    <div className="bg-charcoal-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
          <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-cream-300">About</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-6">
          About FindPullTabs
        </h1>

        <div className="text-charcoal-300 text-sm leading-relaxed space-y-6">
          <section>
            <p className="text-base text-cream-200 leading-relaxed">
              FindPullTabs is the most comprehensive pull tab and charitable gambling location directory
              in the Midwest. We help players find pull tabs, electronic pull tabs (e-tabs), bingo,
              and other charitable gaming venues across Minnesota, Alaska, Iowa, and Wisconsin.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-cream-200 mb-3">By the Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gold-300 text-2xl font-bold">3,682+</p>
                <p className="text-xs text-charcoal-400 mt-1">Locations</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gold-300 text-2xl font-bold">4</p>
                <p className="text-xs text-charcoal-400 mt-1">States</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gold-300 text-2xl font-bold">1,190+</p>
                <p className="text-xs text-charcoal-400 mt-1">Cities</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gold-300 text-2xl font-bold">394</p>
                <p className="text-xs text-charcoal-400 mt-1">E-Tab Venues</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-cream-200 mb-3">Our Mission</h2>
            <p>
              Pull tabs are more than a game — they&apos;re a vital funding source for local nonprofits,
              veterans&apos; organizations, youth sports leagues, fire departments, and community programs
              across the Midwest. In Minnesota alone, charitable gambling generates over $2 billion
              annually, with proceeds going directly back into communities.
            </p>
            <p className="mt-3">
              We built FindPullTabs to make it easy for players to find venues near them, discover
              new spots, and support the charitable organizations that make our communities better.
              Every time you play pull tabs, you&apos;re contributing to something bigger.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-cream-200 mb-3">What We Offer</h2>
            <div className="space-y-3">
              <div className="glass rounded-xl p-4">
                <p className="text-cream-200 font-medium mb-1">🗺️ Interactive Map</p>
                <p className="text-charcoal-400 text-xs">
                  Browse all 3,682+ locations on a dark-themed map with marker clustering.
                  Filter by venue type, search by city or ZIP, and get directions instantly.
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-cream-200 font-medium mb-1">🎰 E-Tab Tracking</p>
                <p className="text-charcoal-400 text-xs">
                  394 venues confirmed to have electronic pull tabs. Filter the map to show only
                  e-tab locations so you can find the modern gaming experience.
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-cream-200 font-medium mb-1">🕐 Gambling Hours</p>
                <p className="text-charcoal-400 text-xs">
                  Community-submitted gambling hours for venues so you know when the booth or
                  bar is running games. Know the hours at your spot?{' '}
                  <Link href="/submit" className="text-gold-300 hover:text-gold-200 underline">Submit them</Link>.
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-cream-200 font-medium mb-1">❤️ Favorites</p>
                <p className="text-charcoal-400 text-xs">
                  Create a free account to save your go-to pull tab spots. Your favorites are
                  always one click away.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-cream-200 mb-3">States We Cover</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/states/mn" className="glass rounded-xl p-4 group">
                <p className="text-cream-200 font-medium group-hover:text-gold-300 transition-colors">🏛️ Minnesota</p>
                <p className="text-charcoal-400 text-xs mt-1">2,975 locations across 891 cities</p>
              </Link>
              <Link href="/states/ia" className="glass rounded-xl p-4 group">
                <p className="text-cream-200 font-medium group-hover:text-gold-300 transition-colors">🌽 Iowa</p>
                <p className="text-charcoal-400 text-xs mt-1">393 locations across 176 cities</p>
              </Link>
              <Link href="/states/wi" className="glass rounded-xl p-4 group">
                <p className="text-cream-200 font-medium group-hover:text-gold-300 transition-colors">🧀 Wisconsin</p>
                <p className="text-charcoal-400 text-xs mt-1">236 locations across 136 cities</p>
              </Link>
              <Link href="/states/ak" className="glass rounded-xl p-4 group">
                <p className="text-cream-200 font-medium group-hover:text-gold-300 transition-colors">🏔️ Alaska</p>
                <p className="text-charcoal-400 text-xs mt-1">78 locations across 14 cities</p>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-cream-200 mb-3">Help Us Grow</h2>
            <p>
              Our database is community-powered. If you know of a pull tab location that&apos;s not
              on our map, or if you have updated hours or information for a venue,
              we&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                href="/submit"
                className="px-6 py-3 text-sm font-semibold text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-xl transition-colors text-center"
              >
                Submit a Location
              </Link>
              <a
                href="mailto:badtabits@gmail.com"
                className="px-6 py-3 text-sm font-semibold text-gold-300 border border-gold-300/30 hover:border-gold-300/60 rounded-xl transition-colors text-center"
              >
                Contact Us
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-cream-200 mb-3">Learn More</h2>
            <p>
              New to pull tabs? Check out our{' '}
              <Link href="/blog" className="text-gold-300 hover:text-gold-200 underline">blog</Link>
              {' '}for guides, tips, and news about charitable gaming:
            </p>
            <div className="mt-3 space-y-2">
              <Link href="/blog/what-are-pull-tabs" className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-gold-300 transition-colors">
                <svg className="w-3.5 h-3.5 text-charcoal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                What Are Pull Tabs? A Complete Guide
              </Link>
              <Link href="/blog/best-pull-tab-strategies" className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-gold-300 transition-colors">
                <svg className="w-3.5 h-3.5 text-charcoal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                Pull Tab Strategies &amp; Tips
              </Link>
              <Link href="/blog/electronic-pull-tabs-explained" className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-gold-300 transition-colors">
                <svg className="w-3.5 h-3.5 text-charcoal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                Electronic Pull Tabs Explained
              </Link>
              <Link href="/blog/minnesota-charitable-gaming-guide" className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-gold-300 transition-colors">
                <svg className="w-3.5 h-3.5 text-charcoal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                Minnesota Charitable Gaming Guide
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
