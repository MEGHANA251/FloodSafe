import dynamic from 'next/dynamic';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { AlertBanner } from '@/components/AlertBanner';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <AlertBanner />
      <Hero />
      <div className="relative flex-1">
        <MapView />
      </div>
    </main>
  );
}

