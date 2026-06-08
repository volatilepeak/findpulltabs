import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FindPullTabs privacy policy. Learn how we collect, use, and protect your information.',
  alternates: { canonical: 'https://findpulltabs.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="bg-charcoal-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
          <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-cream-300">Privacy Policy</span>
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-2">
          Privacy Policy
        </h1>
        <p className="text-charcoal-400 text-sm mb-10">
          Last updated: June 8, 2026
        </p>

        <div className="text-charcoal-300 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Overview</h2>
            <p>
              FindPullTabs (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website findpulltabs.com. This Privacy Policy explains how we collect, use, and protect information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Information We Collect</h2>
            <p className="mb-3">
              <strong className="text-cream-200">Account Information:</strong> If you create an account using our magic link sign-in, we collect your email address. This is stored securely through our authentication provider, Supabase.
            </p>
            <p className="mb-3">
              <strong className="text-cream-200">Usage Data:</strong> We automatically collect certain information when you visit our site, including your IP address, browser type, device type, pages visited, and the date and time of your visit. This data helps us understand how visitors use our site and improve the experience.
            </p>
            <p className="mb-3">
              <strong className="text-cream-200">Favorites:</strong> If you are signed in, we store which locations you save as favorites. This data is associated with your account and is used solely to provide the favorites feature.
            </p>
            <p>
              <strong className="text-cream-200">Submitted Information:</strong> If you submit a location, hours, or claim a venue, the information you provide (venue name, address, hours, your email) is sent to us via email for review.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Cookies and Tracking Technologies</h2>
            <p className="mb-3">
              We use cookies and similar technologies to operate our website, maintain your sign-in session, remember your preferences (such as dark mode), and analyze site traffic.
            </p>
            <p className="mb-3">
              <strong className="text-cream-200">Third-Party Advertising:</strong> We use Google AdSense to display advertisements on our site. Google and its advertising partners may use cookies and similar technologies to serve ads based on your prior visits to our website and other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your browsing activity. You can opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:text-gold-200 underline">
                Google Ads Settings
              </a>.
            </p>
            <p>
              <strong className="text-cream-200">Analytics:</strong> We may use third-party analytics services (such as Google Analytics) to collect and analyze usage data. These services may use cookies and similar technologies to track and report on website activity.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">How We Use Your Information</h2>
            <p>
              We use the information we collect to operate and improve our website, provide the favorites and account features, process location submissions and venue claims, display relevant advertisements, analyze site usage and trends, and communicate with you when necessary (such as responding to a venue claim or submission).
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share information with service providers who help us operate the website (such as Supabase for authentication and Vercel for hosting), advertising partners (such as Google AdSense), and law enforcement if required by law. Favorite counts are visible publicly (the number of users who have favorited a location) but individual user favorites are private.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Data Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. Account authentication is handled through Supabase with industry-standard security practices. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Your Choices</h2>
            <p>
              You can delete your account and associated data by contacting us at{' '}
              <a href="mailto:badtabits@gmail.com" className="text-gold-300 hover:text-gold-200 underline">badtabits@gmail.com</a>.
              You can clear cookies through your browser settings. You can opt out of personalized ads through Google&apos;s ad settings. You do not need an account to browse locations on our site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under 18. Pull tabs and charitable gambling are age-restricted activities. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post any changes on this page and update the &quot;Last updated&quot; date. Your continued use of the site after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-cream-200 mb-2">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{' '}
              <a href="mailto:badtabits@gmail.com" className="text-gold-300 hover:text-gold-200 underline">badtabits@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
