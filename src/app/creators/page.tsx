import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Pull Tab Creators to Follow | FindPullTabs.com',
  description:
    'A curated list of the best pull tab creators, communities, and personalities to follow on Facebook, YouTube, TikTok, and Instagram.',
  alternates: { canonical: 'https://findpulltabs.com/creators' },
};

type Socials = {
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  instagram?: string;
};

type Creator = {
  slug: string;
  name: string;
  handle: string;
  image: string;
  blurb: string;
  socials: Socials;
  featured?: boolean;
};

const creators: Creator[] = [
  {
    slug: 'tab-club',
    name: 'The Tab Club',
    handle: '@TheTabClubAndMore',
    image: '/creators/tab-club.png',
    blurb:
      'For the thrill. Charitable fun, good times and supporting local along the way.',
    socials: {
      facebook: 'https://www.facebook.com/TheTabClubAndMore/',
      youtube: 'https://www.youtube.com/@TheTabClub',
    },
    featured: true,
  },
  {
    slug: 'mn-pulltab-chic',
    name: 'Minnesota Pulltab Chic',
    handle: '@mnpulltabchic',
    image: '/creators/mn-pulltab-chic.jpg',
    blurb:
      'Veteran, pull tab enthusiast, and charitable gaming at its finest. Live events, rips, bingo, e-tabs, and Minnesota adventures.',
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=61582940405191',
      tiktok: 'https://www.tiktok.com/@mnpulltabchic',
      youtube: 'https://www.youtube.com/@MNPulltabchic',
      instagram: 'https://www.instagram.com/mnpulltabchic',
    },
  },
  {
    slug: 'wsopt',
    name: 'World Series of Pull Tabs',
    handle: '@worldseriesofpulltabs',
    image: '/creators/wsopt.jpg',
    blurb:
      'Livestreams, community wins, and a page that celebrates players everywhere. Send in your winners and get put on the map.',
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=61578075728136',
      tiktok: 'https://www.tiktok.com/@worldseriesofpulltabs',
    },
  },
  {
    slug: 'onlytabs',
    name: 'OnlyTabs',
    handle: 'Facebook Page',
    image: '/creators/onlytabs.jpg',
    blurb:
      'Rip em if ya got em. One of the biggest pull tab pages on Facebook with nonstop ripping content.',
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=61577600641249',
    },
  },
  {
    slug: 'twogirlsonehabit',
    name: 'Two Girls One Habit',
    handle: '@twogirlsonehabit',
    image: '/creators/twogirlsonehabit.jpg',
    blurb:
      'Two Minnesota natives looking for luck, chasing boxes, and finding lines. Charity starts local. Also on YouTube and Instagram.',
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=61586225740386',
      instagram: 'https://www.instagram.com/twogirlsonehabit',
      tiktok: 'https://www.tiktok.com/@twogirlsonehabit',
      youtube: 'https://www.youtube.com/@twogirlsonehabit-1',
    },
  },
  {
    slug: 'two-chicks',
    name: '2 Chicks Doing Lines',
    handle: '@2Chicksdoinglines',
    image: '/creators/two-chicks.jpg',
    blurb:
      'Two longtime friends chasing dopamine via charitable gaming. If you have ever said just one more box, you will fit right in.',
    socials: {
      facebook: 'https://www.facebook.com/2Chicksdoinglines',
      instagram: 'https://www.instagram.com/twochicksdoinglines',
    },
  },
];

// Icon components — inline SVGs so no extra deps
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.1z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

type SocialKey = keyof Socials;

const socialConfig: Record<
  SocialKey,
  { label: string; Icon: () => JSX.Element }
> = {
  facebook: { label: 'Facebook', Icon: FacebookIcon },
  instagram: { label: 'Instagram', Icon: InstagramIcon },
  tiktok: { label: 'TikTok', Icon: TikTokIcon },
  youtube: { label: 'YouTube', Icon: YouTubeIcon },
};

const socialOrder: SocialKey[] = ['facebook', 'instagram', 'tiktok', 'youtube'];

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
            The people, pages, and personalities keeping pull tab culture alive on Facebook, YouTube, TikTok, and Instagram.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {creators.map((c) => (
            <div
              key={c.slug}
              className={`group relative !bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col ${
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

              {/* Text — locked to black regardless of site theme */}
              <div className="p-6 md:p-7 !bg-white flex flex-col flex-1">
                <h2 className="font-playfair text-2xl !text-black leading-tight mb-1">
                  {c.name}
                </h2>
                <p className="font-outfit text-sm !text-black/60 mb-4">{c.handle}</p>
                <p className="font-outfit !text-black leading-relaxed text-[15px] mb-6 flex-1">
                  {c.blurb}
                </p>

                {/* Socials row */}
                <div className="flex items-center gap-2 pt-4 border-t border-black/10">
                  {socialOrder
                    .filter((key) => c.socials[key])
                    .map((key) => {
                      const { label, Icon } = socialConfig[key];
                      return (
                        <a
                          key={key}
                          href={c.socials[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${c.name} on ${label}`}
                          title={label}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full !bg-black/5 !text-black hover:!bg-black hover:!text-white transition-colors"
                        >
                          <Icon />
                        </a>
                      );
                    })}
                </div>
              </div>
            </div>
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
