// Top imports
"use client";
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { SearchBar } from '@/components/SearchBar';
import { Sidebar } from '@/components/Sidebar';
import { Legend } from '@/components/Legend';
import { MapOverlays } from '@/components/MapOverlays';
import { RainfallLayer } from '@/components/RainfallLayer';
import { DirectionsLayer } from '@/components/DirectionsLayer';
import { useAppStore } from '@/store/useAppStore';
import { getRegion } from '@/config/regions';
import { LayerToggles } from '@/components/LayerToggles';
import { useEffect } from 'react';

// function LocationDetector()
function LocationDetector() {
  const setUserLocation = useAppStore((s) => s.setUserLocation);
  const setDestination = useAppStore((s) => s.setDestination);
  const map = useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      // Find nearest relief portal
      fetch(`/api/osm-pois?lat=${lat}&lng=${lng}`)
        .then(r => r.json())
        .then(j => {
          if (j.ok && j.data && j.data.length > 0) {
            // Find nearest portal
            const nearest = j.data.reduce(
              (prev: { location: [number, number] }, curr: { location: [number, number] }) => {
                const distPrev = Math.hypot(prev.location[0] - lat, prev.location[1] - lng);
                const distCurr = Math.hypot(curr.location[0] - lat, curr.location[1] - lng);
                return distCurr < distPrev ? curr : prev;
              }
            );
            setDestination(nearest.location);
          } else {
            setDestination([lat, lng]); // fallback to clicked point
          }
        });
    },
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to map center if geolocation fails
          const center = map.getCenter();
          setUserLocation([center.lat, center.lng]);
        }
      );
    }
  }, [map, setUserLocation]);

  return null;
}

// Add: Recenter on userLocation or selected city
function RecenterOnLocation() {
  const map = useMapEvents({});
  const userLocation = useAppStore((s) => s.userLocation);
  const city = useAppStore((s) => s.city);
  const region = getRegion(city);
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation as [number, number], map.getZoom(), { animate: true });
    } else if (region?.center) {
      map.setView(region.center as [number, number], map.getZoom(), { animate: true });
    }
  }, [userLocation, region?.center, map]);
  return null;
}
// export default function MapView()
export default function MapView() {
  const city = useAppStore((s) => s.city);
  const bbox = useAppStore((s) => s.bbox);
  const region = getRegion(city) ?? { center: [19.076, 72.8777] } as any;
  
  const userLocation = useAppStore((s) => s.userLocation);
  const destination = useAppStore((s) => s.destination);
  return (
    <div className="absolute inset-0">
      <div className="pointer-events-none absolute left-1/2 top-4 z-[1100] -translate-x-1/2">
        <SearchBar />
      </div>
      <div className="absolute left-4 bottom-4 z-[1100]">
        <Legend />
      </div>
      <div className="absolute left-4 top-4 z-[1100]">
        <LayerToggles />
      </div>
      <Sidebar />
      <MapContainer
        center={region.center as [number, number]}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RainfallLayer />
        <MapOverlays />
        <LocationDetector />
        <RecenterOnLocation />
        {/* Start and Drop Markers removed */}
        <DirectionsLayer />
      </MapContainer>
    </div>
  );
}

