"use client";
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useRef, useState } from 'react';

export function CitySelector() {
  const router = useRouter();
  const city = useAppStore((s) => s.city);
  const setCity = useAppStore((s) => s.setCity);
  const setBbox = useAppStore((s) => s.setBbox);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => { setQuery(city); }, [city]);

  async function resolvePlace(q: string) {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/region?q=${encodeURIComponent(q)}`);
      const j = await res.json();
      if (j?.ok) {
        setBbox(j.data.bbox);
        setCity(q);
        router.push(`/?city=${encodeURIComponent(q)}`);
      } else {
        setError(j?.error || 'Not found');
      }
    } catch (e: any) {
      setError('Failed to resolve place');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor="city" className="text-sm font-medium">Region</label>
      <div className="relative">
        <input
          id="city"
          className="focus-ring w-64 sm:w-80 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-soft"
          placeholder="Search state, city, district in India..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) resolvePlace(query.trim()); }}
        />
        <button
          onClick={() => query.trim() && resolvePlace(query.trim())}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-brand-blue px-2 py-1 text-xs text-white shadow-soft"
          aria-label="Search region"
        >
          {loading ? '...' : 'Go'}
        </button>
      </div>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}

