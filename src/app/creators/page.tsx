import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Pull Tab Creators to Follow | FindPullTabs.com',
  description:
    'A curated list of the best pull tab creators, communities, and personalities to follow on Facebook. Big wins, bar stories, and pull tab culture.',
  alternates: { canonical: 'https://findpulltabs.com/creators' },
};

type Creator = {
  slug: string;
  name: string;
  handle: string;
  url: string;
  image: string;
  blurb: string;
  featured?: boolean;
};

const creators: Creator[] = [
  {
    slug: 'tab-club',
    name: 'The Tab Club',
    handle: '@TheTabClubAndMore',
    url: 'https://www.facebook.com/TheTabClubAndMore/',
    image: '/creators/tab-club.png',
    blurb:
      'For the thrill. Charitable fun, good times and supporting local along the way.',
    featured: true,
  },
  {
    slug: 'mn-pulltab-chic',
    name: 'Minnesota Pulltab Chic',
    handle: 'Facebook Page',
    url: 'https://www.facebook.com/profile.php?id=61582940405191',
    image: '/creators/mn-pulltab-chic.jpg',
    blurb:
      'Veteran, pull tab enthusiast, and charitable gaming at its finest. Live events, rips, bingo, e-tabs, and Minnesota adventures.',
  },
  {
    slug: 'wsopt',
    name: 'World Series of Pull Tabs',
    handle: 'Facebook Page',
    url: 'https://www.facebook.com/profile.php?id=61578075728136',
    image: '/creators/wsopt.jpg',
    blurb:
      'Livestreams, community wins, and a page that celebrates players everywhere. Send in your winners and get put on the map.',
  },
  {
    slug: 'onlytabs',
    name: 'OnlyTabs',
    handle: 'Facebook Page',
    url: 'https://www.facebook.com/profile.php?id=61577600641249',
    image: '/creators/onlytabs.jpg',
    blurb:
      'Rip em if ya got em. One of the biggest pull tab pages on Facebook with nonstop ripping content.',
  },
  {
    slug: 'twogirlsonehabit',
    name: 'Two Girls One Habit',
    handle: 'Facebook Page',
    url: 'https://www.facebook.com/profile.php?id=61586225740386',
    image: '/creators/twogirlsonehabit.jpg',
    blurb:
      'Two Minnesota natives looking for luck, chasing boxes, and finding lines. Charity starts local. Also on YouTube and Instagram.',
  },
  {
    slug: 'two-chicks',
    name: '2 Chicks Doing Lines',
    handle: '@2Chicksdoinglines',
    url: 'https://www.facebook.com/2Chicksdoinglines',
    image: '/creators/two-chicks.jpg',
    blurb:
      'Two longtime friends chasing dopamine via charitable gaming. If you have ever said just one more box, you will fit right in.',
  },
];

export default function CreatorsPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-charcoal font-outfit mb-5">
            Community
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-charcoal leading-tight">
            Pull Tab Creators to Follow
          </h1>
          <div className="w-16 h-px bg-gold mx-auto my-8" />
          <p className="font-outfit text-charcoal text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The people, pages, and personalities keeping pull tab culture alive on Facebook.
            Big wins, bar finds, and the kind of content only real players make.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {creators.map((c) => (
            <a
              key={c.slug}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative !bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                c.featured
                  ? 'border-gold shadow-md ring-1 ring-gold/40'
                  : 'border-black/10 shadow-sm'
              }`}
            >
              {c.featured && (
                <div className="absolute top-3 right-3 z-10 bg-gold !text-black text-[10px] font-outfit font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
                  Our Page
                </div>
              )}

              {/* Photo */}
              <div className="relative aspect-square bg-black/5 overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text — locked to black regardless of light/dark site theme */}
              <div className="p-6 md:p-7 !bg-white">
                <h2 className="font-playfair text-2xl !text-black leading-tight mb-1">
                  {c.name}
                </h2>
                <p className="font-outfit text-sm !text-black/60 mb-4">{c.handle}</p>
                <p className="font-outfit !text-black leading-relaxed text-[15px] mb-5">
                  {c.blurb}
                </p>
                <span className="inline-flex items-center gap-2 font-outfit text-sm font-semibold !text-black group-hover:!text-[#B8A57A] transition-colors">
                  Follow on Facebook
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="border-t border-charcoal/10 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4">
            Know a creator we missed?
          </h2>
          <p className="font-outfit text-charcoal text-lg mb-8 leading-relaxed">
            We&apos;re always looking for pull tab pages, communities, and personalities to feature.
            If you make content worth watching, we want to know about it.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-charcoal text-cream font-outfit font-medium tracking-wide px-8 py-3.5 rounded-full hover:bg-gold hover:text-charcoal transition-colors"
          >
            Submit a Creator
          </Link>
        </div>
      </section>
    </div>
  );
}
