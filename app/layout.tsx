import type { Metadata, Viewport } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'KHOJ | खोज · Hidden & Quiet Places Near You',
  description:
    'Discover peaceful, scenic, and hidden local spots in Mumbai and beyond without the tourist crowds.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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

