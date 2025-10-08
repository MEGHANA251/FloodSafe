"use client";
import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  return (
    <div className="pointer-events-auto glass rounded-xl px-3 py-2 shadow-soft">
      <label htmlFor="search" className="sr-only">Search address or place</label>
      <input
        id="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search address, hospital, police station..."
        className="w-72 sm:w-96 bg-transparent outline-none text-sm"
        aria-label="Search address or place"
      />
    </div>
  );
}

