# FloodSafe India — `src` Overview

This directory contains application logic, UI, data models, and API routes for a Next.js app that visualizes flood risk and safe directions.

## Architecture
- **Next.js App**: Pages under `src/app` with client components for interactive map.
- **Map Stack**: Leaflet + react-leaflet for map rendering; OSM tiles.
- **Routing**: OSRM for on-map directions; OpenRouteService for route suggestions.
- **State**: Zustand store (`src/store/useAppStore.ts`).
- **Config**: Region centers and bounding boxes (`src/config/regions.ts`).
- **Types**: Shared domain types (`src/types`).
- **API Routes**: Serverless endpoints (`src/app/api`) for POIs, routes, region info, and rainfall/tweets.

## Key Flows
- **Set Origin**: Sidebar resolves address via Nominatim or uses device geolocation.
- **Choose Endpoint**: User picks category (shelter/hospital/police); nearest POI found within a bbox centered on origin.
- **Show Directions**: When both points exist, `DirectionsLayer` renders an OSRM route without A/B markers.
- **Overlays**: Additional polylines/markers show infrastructure and reports controlled by `LayerToggles`.

## Files
- `app/page.tsx`: Top-level composition of navbar, banners, hero, and `MapView`.
- `app/layout.tsx`: App shell and metadata.s
- `components/*`: Map layers, overlays, and UI controls.
- `store/useAppStore.ts`: Global state and actions.
- `utils/api/*`: Client helpers to call external or internal APIs.
- `types/index.ts`: Types like `Coordinate`, `RouteSuggestion`, POIs.

## Configuration
- `src/config/regions.ts` defines supported cities with `center` and `bbox`.
- `ROUTING_API_KEY` required for `OpenRouteService` (`fetchRoutes`).

## Development
- Start the dev server:

```bash
npm run dev
```

- Common pitfalls:
  - Ensure `useMap` and `useMapEvents` are imported where used.
  - Disable routing markers via `createMarker: () => null` to avoid A/B pins.
  - When origin changes, recenter the map and recompute endpoint bbox.

## Accessibility & Performance
- Keyboard-focus styles via `focus-ring` utility classes.
- Map performance improved by limiting routing redraws and hiding draggable markers.

## Sidebar Toggle & Overlay
- The Sidebar is toggled via a button that switches its label between `Hide` and `Show` based on `isOpen` from the store.
- Render the Sidebar outside the Leaflet `MapContainer` and set a high z-index like `z-[1100]` to ensure it overlays map markers/tooltips.
- Keep `pointer-events-auto` on the container so interactions work over the map.

Example toggle and container (excerpt from `components/Sidebar.tsx`):

```tsx
<button onClick={toggle} className="text-sm focus-ring rounded px-2 py-1">
  {isOpen ? 'Hide' : 'Show'}
</button>

<aside
  className={
    `pointer-events-auto glass fixed right-4 top-24 z-[1100] w-80 max-w-[calc(100%-2rem)] rounded-2xl p-4 shadow-soft transition-transform ${
      isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]'
    }`
  }
  aria-label="Route suggestions and tools"
>
```

## Origin & Endpoint Selection
- Resolve origin by address input or use device geolocation.
- Pick an endpoint category (shelter/hospital/police) and compute nearest POI.
- Show/hide OSRM directions when both origin and destination are set.

Helpers: `geocodeOrigin`, `useDeviceLocation`, `chooseDestination`, `handleShowDirections` (see `components/Sidebar.tsx`).

## Reports Overlay
- Users can submit flood or blocked-road reports; markers render when `layers.blockedRoads` is enabled.
- Defaults: `reports` is an empty array; the report modal is closed on load.
- Tweets with geocoded coordinates also display as markers under blocked roads.