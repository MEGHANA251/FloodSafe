# Components Overview

High-level purpose of each component in `src/components`.

- **MapView**: Hosts the Leaflet map (`MapContainer`), tiles, and all overlays. Wires in search, legend, toggles, and the sidebar.
- **DirectionsLayer**: OSRM routing overlay reading endpoints from the store. Hides waypoint markers; draws primary and alternative routes.
- **Sidebar**: User controls for origin resolution (text or device) and endpoint selection. Chooses nearest POI and toggles directions.
- **MapOverlays**: Draws POIs, suggested routes, and flood tweets fetched by region bbox. Respects layer visibility toggles.
- **LayerToggles**: Small toolbar to switch overlays on/off; updates Zustand store.
- **Legend**: Visual legend for risk and layer meanings.
- **RainfallLayer**: Displays rainfall data overlay (when enabled by layers).
- **SearchBar**: Input surface placed above the map.
- **Navbar**: App header and the city selector.
- **cities/CitySelector**: Dropdown to choose a region (sets `city` in store).
- **AlertBanner**: Header banner to broadcast warnings or updates.

## State & Data
- **Store**: `useAppStore` keeps `city`, `bbox`, `layers`, `userLocation`, `destination`, `showDirections`.
- **Types**: `Coordinate`, `InfrastructurePOI`, `RouteSuggestion`.

## Routing Details
- OSRM (`leaflet-routing-machine`) is used for the on-map path between origin and destination.
- Alternative route styling is configured; markers suppressed via `createMarker`.

## POIs & Tweets
- Fetched from local API routes with current region bbox.
- Sidebar’s endpoint search builds a bbox around `userLocation` to work nationwide.

## Extensibility
- Add more endpoint categories by extending POI filtering and icon mapping.
- Integrate risk scoring into `RouteSuggestion` using rainfall and blocked roads.

## Sidebar — Toggle & Tools
- Toggle button text reflects `{isOpen ? 'Hide' : 'Show'}` and calls the store toggle.
- Keep the Sidebar outside `MapContainer`, with `z-[1100]` and `pointer-events-auto` so it overlays the map.
- Origin controls: address resolution and “Use my device location”.
- Endpoint controls: category select and “Find nearest endpoint”.
- Actions: “Show/Hide Directions” and “Report flood/blockage”.

### Reporting Markers
- Submitted reports appear on the map when `layers.blockedRoads` is true.
- Tweets with `lat`/`lon` are rendered as small markers with tooltips.

### Routing Layer
- OSRM-based directions are rendered without A/B markers and restyled via `leaflet-routing-machine` options.