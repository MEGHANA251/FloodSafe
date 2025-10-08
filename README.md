# FloodSafe India — Next.js + TypeScript + Tailwind

Crisp, modern, mobile-first web app to visualize live rainfall, flood-prone zones, blocked roads, and safe routes for Indian cities. Built for speed, clarity, and easy extensibility.

## Tech Stack
- Next.js (App Router)
- TypeScript everywhere
- Tailwind CSS
- React Leaflet (MapLibre compatible if preferred)
- Zustand for state
- Lucide/Heroicons for icons (optional)

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Create a local env file
```bash
copy .env.example .env.local  # Windows
# or
cp .env.example .env.local    # macOS/Linux
```

3. Fill in API keys (optional for demo)
- NASA_API_KEY — GPM/IMERG
- ACCUWEATHER_API_KEY — AccuWeather alerts
- TWITTER_BEARER_TOKEN — for tweets
- MAP_TILES_API_KEY — if using a paid tiles provider
- ROUTING_API_KEY — OpenRouteService/OSRM/etc.

4. Run dev server
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure (src/)
```
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    AlertBanner.tsx
    Hero.tsx
    Legend.tsx
    MapOverlays.tsx
    MapView.tsx
    SearchBar.tsx
    cities/
      CitySelector.tsx
    ui/
      index.ts
  data/
    mumbai.mock.ts
  store/
    useAppStore.ts
  types/
    index.ts
  utils/
    api/
      imd.ts
      nasa.ts
      osm.ts
      twitter.ts
```

## Architectural Notes
- UI components are small, composable, and stateless where possible.
- State is colocated in `store/useAppStore.ts` with clear actions and toggles.
- Map is client-only via dynamic import and layered through React Leaflet primitives.
- Data fetching is isolated in `utils/api/*` and returns typed results for easy plug-in of real APIs.
- Mock data lives in `data/*` (Mumbai demo) to ensure immediate visual output.

## Extending APIs
- `utils/api/nasa.ts` — Replace `fetchGpmRainfall` with real NASA GPM/IMERG calls.
- `utils/api/accuweather.ts` — Replace `fetchAccuAlerts` with AccuWeather endpoints.
- `utils/api/osm.ts` — Replace `fetchRoutes` with OpenRouteService/OSRM/Valhalla; consider risk-weighted costing.
- `utils/api/twitter.ts` — Replace sample with geofenced keyword search.

Each util should:
- Accept typed inputs (coords, city, bbox, time windows).
- Return typed, UI-ready data objects (see `types/index.ts`).
- Handle errors and empty states gracefully.

## Styling System
- Tailwind with a small set of extended colors in `tailwind.config.ts` using an Indian palette.
- Reusable utility classes: `.glass`, `.focus-ring` for consistent affordances.
- High contrast, clear focus states, mobile-first layout.

## First-Run UX
- Users land on the hero with a LIVE banner and city selector (defaults to Mumbai).
- Persistent search bar overlays the map for address/POI lookup.
- Left/bottom legend clarifies color semantics (risk, rainfall).
- Right-side sidebar (or bottom sheet on mobile) shows route suggestions and tools, including "Report flood/blockage".
- Map shows flood polygons, blocked roads, POIs, and at least one safe route.

## Accessibility
- Keyboard navigable: form controls and buttons include `.focus-ring`.
- Sufficient color contrast and minimal reliance on color alone (labels, tooltips).
- `aria-label` and `sr-only` are used for non-text inputs.

## Adding New Cities
1. Create `{city}.mock.ts` in `src/data/` following `mumbai.mock.ts` structure.
2. Add city to `components/cities/CitySelector.tsx`.
3. Adjust default center in `components/MapView.tsx` or make it reactive to store.

## Suggested Next Steps (for contributors)
- Replace mocks with live APIs and add caching.
- Add layer toggles (rainfall, flood zones, roads) bound to `useAppStore`.
- Implement geocoding for search (Nominatim/Mapbox/etc.).
- Add routing panel with alternatives and per-segment risk explanation.
- Add basic report form and persistence (serverless function or Firestore).

## License
MIT

## Common pitfalls:

- Sidebar not visible over the map:
  - Render `<Sidebar />` outside `<MapContainer>` to avoid Leaflet’s stacking context.
  - Set a high z-index on the sidebar container, e.g. `z-[1100]`.
  - Keep it interactive with `pointer-events-auto`, and ensure no parent has `pointer-events-none`.

Example (in `src/components/Sidebar.tsx`):

```tsx
<aside
  className={
    `pointer-events-auto glass fixed right-4 top-24 z-[1100] w-80 max-w-[calc(100%-2rem)] rounded-2xl p-4 shadow-soft transition-transform ${
      isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]'
    }`
  }
/>
```
# FloodSafe
