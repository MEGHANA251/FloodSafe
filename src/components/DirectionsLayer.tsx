"use client";
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';

// Define the missing types for TypeScript
declare global {
  interface Window {
    L: typeof L;
  }
}

// Add the missing Routing type to Leaflet
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options: any): any;
  }
}

// Import the leaflet-routing-machine CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Make sure to import the actual library
// This needs to be done after the type declarations
import 'leaflet-routing-machine';

export function DirectionsLayer() {
  const map = useMap();
  const userLocation = useAppStore((s) => s.userLocation);
  const destination = useAppStore((s) => s.destination);
  const showDirections = useAppStore((s) => s.showDirections);
  const [routingControl, setRoutingControl] = useState<any>(null);

  useEffect(() => {
    if (!showDirections || !userLocation || !destination) {
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
      }
      return;
    }

    // Create routing control if it doesn't exist
    if (!routingControl) {
      try {
        const newRoutingControl = L.Routing.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(destination[0], destination[1])
          ],
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving'
          }),
          routeWhileDragging: false,
          showAlternatives: false,
          lineOptions: {
            styles: [
              { color: '#168F6E', opacity: 0.8, weight: 6 },
              { color: '#ffffff', opacity: 0.3, weight: 4 }
            ]
          },
          altLineOptions: {
            styles: [
              { color: '#F77F00', opacity: 0.8, weight: 6 },
              { color: '#ffffff', opacity: 0.3, weight: 4 }
            ]
          },
          createMarker: function() { return null; }
        }).addTo(map);

        setRoutingControl(newRoutingControl);
      } catch (error) {
        console.error("Error creating routing control:", error);
      }
    } else {
      // Update waypoints if routing control exists
      routingControl.setWaypoints([
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ]);
    }
  }, [map, userLocation, destination, showDirections, routingControl]);

  return null;
}