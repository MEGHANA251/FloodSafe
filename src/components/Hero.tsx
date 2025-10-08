"use client";
import { CitySelector } from '@/components/cities/CitySelector';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-10 md:py-12">
        <div className="rounded-2xl glass p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">LIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              FloodSafe India
            </h1>
            <p className="text-sm sm:text-base text-gray-700 max-w-prose">
              Real-time rainfall, flood risk layers, and safe routing for Indian cities like Mumbai, Chennai, and Guwahati.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <p className="text-xs text-gray-600">Choose a city from the top bar to preview mock data.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

