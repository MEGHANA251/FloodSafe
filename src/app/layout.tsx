import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FloodSafe India – Real-time Flood Risk & Safe Routes',
  description: 'Live rainfall, flood zones, blocked roads, safe routing for Indian cities.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

