"use client";
import { CitySelector } from '@/components/cities/CitySelector';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 before:absolute before:-inset-1 before:animate-ping before:rounded-full before:bg-red-400/60" aria-hidden />
          <span className="text-sm font-semibold tracking-tight">FloodSafe India</span>
        </div>
        <div className="flex items-center gap-3">
          <CitySelector />
        </div>
      </div>
    </header>
  );
}

