import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pull Tab Creators — The Community Behind the Tabs | FindPullTabs',
  description: 'Meet the pull tab content creators keeping the charitable gaming community entertained. Follow them on Facebook for rips, wins, losses, and good times.',
  alternates: { canonical: 'https://findpulltabs.com/creators' },
};

const creators = [
  {
    name: 'The Tab Club',
    url: 'https://www.facebook.com/TheTabClubAndMore',
    description: 'For the thrill. Charitable fun, good times and supporting local along the way.',
    emoji: '👑',
  },
  {
    name: 'OnlyTabs',
    url: 'https://www.facebook.com/profile.php?id=61577600641249',
    description: 'Rip \'em if ya got \'em. One of the biggest pull tab pages on Facebook with nonstop ripping content.',
    emoji: '💰',
  },
  {
    name: 'World Series of Pull Tabs',
    url: 'https://www.facebook.com/profile.php?id=61578075728136',
    description: 'Livestreams, community wins, and a page that celebrates players everywhere. Send in your winners and they'll put you on the map.',
    emoji: '🏆',
  },
  {
    name: 'Twogirlsonehabit',
    url: 'https://www.facebook.com/profile.php?id=61586225740386',
    description: 'Two Minnesota natives looking for luck, chasing boxes, and finding lines. Charity starts local. Also on YouTube and Instagram.',
    emoji: '🎰',
  },
  {
    name: 'Two Chicks Doing Lines',
    url: 'https://www.facebook.com/2Chicksdoinglines',
    description: 'Two longtime friends chasing dopamine via charitable gaming. If you've ever said "just one more box," you'll fit right in.',
    emoji: '👯',
  },
  {
    name: 'Minnesota Pulltab Chic',
    url: 'https://www.facebook.com/profile.php?id=61582940405191',
    description: 'Veteran, pull tab enthusiast, and charitable gambling's biggest fan. Live events, rips, bingo, e-tabs, and Minnesota adventures.',
    emoji: '🎀',
  },
];

export default function CreatorsPage() {
  return (
    <div className="bg-charcoal-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
          <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-cream-300">Creators</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-3">
          Pull Tab Creators
        </h1>
        <p className="text-charcoal-300 text-sm leading-relaxed mb-10">
          The pull tab community on Facebook is growing fast. These creators are putting out
          great content — ripping tabs, sharing wins and losses, going live, and keeping the
          charitable gaming community entertained. Give them a follow.
        </p>

        <div className="space-y-4">
          {creators.map((creator) => (
            <a
              key={creator.name}
              href={creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass rounded-xl p-6 border border-charcoal-800 hover:border-gold-300/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-charcoal-800 flex items-center justify-center flex-shrink-0 text-2xl group-hover:bg-gold-300/10 transition-colors">
                  {creator.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-cream-200 group-hover:text-gold-300 transition-colors">
                      {creator.name}
                    </h2>
                    <svg className="w-4 h-4 text-charcoal-500 group-hover:text-gold-300 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-sm text-charcoal-400 leading-relaxed">{creator.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 glass rounded-xl p-6 border border-gold-300/15">
          <h3 className="font-display text-lg font-semibold text-cream-200 mb-2">Are you a pull tab creator?</h3>
          <p className="text-sm text-charcoal-400 mb-4">
            We&apos;re always looking to feature more creators in the pull tab community.
            If you run a page and want to be listed here, reach out.
          </p>
          <a
            href="mailto:badtabits@gmail.com?subject=Creator Feature Request"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-charcoal-900 bg-gold-300 hover:bg-gold-400 rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        </div>

        <div className="mt-8">
          <Link href="/about" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
            ← Back to About
          </Link>
        </div>
      </div>
    </div>
  );
}
