import type { Metadata, Viewport } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'KHOJ | खोज · Hyperlocal Discovery & Urban Transit Engine',
  description:
    'Discover 610+ verified hidden sanctuaries, transit corridors, and dining flagships across the Mumbai Metropolitan Region with real-time transit proximity.',
  keywords: [
    'Mumbai',
    'Khoj Mumbai',
    'Geospatial App',
    'Mumbai Local Train Routes',
    'Metro 3 Mumbai',
    'Hidden Gems Mumbai',
    'Fast Food Corridors',
    'Urban Mobility',
    'Next.js 14',
    'PostGIS',
  ],
  authors: [{ name: 'Om Kamble' }],
  creator: 'Om Kamble',
  openGraph: {
    title: 'KHOJ | खोज · Mumbai Discovery & Transit Engine',
    description:
      'Explore 610+ verified hidden sanctuaries, local train corridors, and fast-food flagships across Mumbai with zero hallucinations and real-time station proximity.',
    url: 'https://khoj-mumbai.vercel.app',
    siteName: 'KHOJ Mumbai',
    images: [
      {
        url: '/images/mumbai_art_and_culture_banner_hd.png',
        width: 1200,
        height: 630,
        alt: 'KHOJ Mumbai - Discover Hidden Sanctuaries and Transit Corridors',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KHOJ | खोज · Mumbai Discovery & Transit Engine',
    description:
      'Explore 610+ verified hidden sanctuaries, local train corridors, and fast-food flagships across Mumbai.',
    images: ['/images/mumbai_art_and_culture_banner_hd.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#faf6ee',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-wabi text-sumi font-sans selection:bg-vermilion selection:text-white">
        {children}
      </body>
    </html>
  );
}

