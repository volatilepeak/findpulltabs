import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { DarkModeProvider } from '@/components/DarkModeProvider';

export const metadata: Metadata = {
  title: {
    default: 'FindPullTabs — Find Pulltabs Near You',
    template: '%s | FindPullTabs',
  },
  description:
    'Find pulltab locations across Minnesota, Alaska, Iowa, and Wisconsin. Search 3,300+ bars, VFW posts, American Legion halls, and more offering charitable gaming pulltabs.',
  keywords: [
    'pull tabs',
    'pulltabs',
    'charitable gaming',
    'Minnesota pull tabs',
    'find pull tabs near me',
    'VFW pull tabs',
    'American Legion',
    'e-tabs',
    'electronic pull tabs',
  ],
  metadataBase: new URL('https://findpulltabs.com'),
  openGraph: {
    title: 'FindPullTabs — Find Pulltabs Near You',
    description: 'Search 3,300+ pull tab locations across MN, AK, IA, and WI.',
    url: 'https://findpulltabs.com',
    siteName: 'FindPullTabs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindPullTabs — Find Pulltabs Near You',
    description: 'Search 3,300+ pull tab locations across MN, AK, IA, and WI.',
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
        <link rel="icon" href="/favicon.ico" />
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
