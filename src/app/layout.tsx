import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { DarkModeProvider } from '@/components/DarkModeProvider';

export const metadata: Metadata = {
  title: {
    default: 'Find Pull Tabs Near You — Pull Tabs, E-Tabs & Bingo Locations | FindPullTabs',
    template: '%s | FindPullTabs',
  },
  description:
    'Find pull tabs, e-tabs, bingo, and charitable gambling locations near you in Minnesota, Alaska, Iowa, and Wisconsin. 3,600+ bars, VFW posts, American Legion halls, and more with directions.',
  keywords: [
    'pull tabs',
    'pull tabs near me',
    'pulltabs',
    'e-tabs',
    'electronic pull tabs',
    'etabs',
    'bingo near me',
    'charitable gaming',
    'charitable gambling',
    'Minnesota pull tabs',
    'Alaska pull tabs',
    'Iowa pull tabs',
    'Wisconsin pull tabs',
    'find pull tabs',
    'pull tab locations',
    'VFW pull tabs',
    'American Legion pull tabs',
    'Eagles club pull tabs',
    'bar pull tabs',
    'pull tab bars near me',
  ],
  metadataBase: new URL('https://findpulltabs.com'),
  openGraph: {
    title: 'Find Pull Tabs, E-Tabs & Bingo Locations Near You | FindPullTabs',
    description: 'Find pull tabs, e-tabs, bingo, and charitable gambling locations near you. 3,600+ locations mapped across MN, AK, IA, and WI with directions.',
    url: 'https://findpulltabs.com',
    siteName: 'FindPullTabs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Pull Tabs, E-Tabs & Bingo Near You | FindPullTabs',
    description: 'Find pull tabs, e-tabs, bingo, and charitable gambling locations near you. 3,600+ locations across 4 states.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="google-adsense-account" content="ca-pub-1079322354247858" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        />
      </head>
      <body className="min-h-screen flex flex-col font-body antialiased">
        <DarkModeProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
