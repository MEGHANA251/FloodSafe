"use client";
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useMemo, useState } from 'react';
import { getRegion } from '@/config/regions';

export function Sidebar() {
  const isOpen = useAppStore((s) => s.isSidebarOpen);
  const toggle = useAppStore((s) => s.toggleSidebar);
  const showDirections = useAppStore((s) => s.showDirections);
  const toggleDirections = useAppStore((s) => s.toggleDirections);
  const userLocation = useAppStore((s) => s.userLocation);
  const destination = useAppStore((s) => s.destination);
  const setUserLocation = useAppStore((s) => s.setUserLocation);
  const setDestination = useAppStore((s) => s.setDestination);
  const city = useAppStore((s) => s.city);
  const bboxFromStore = useAppStore((s) => s.bbox);

  const [originQuery, setOriginQuery] = useState('');
  const [endpointType, setEndpointType] = useState<'shelter' | 'hospital' | 'police' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Report modal states
  const reportModalOpen = useAppStore((s) => s.reportModalOpen);
  const setReportModalOpen = useAppStore((s) => s.setReportModalOpen);
  const addReport = useAppStore((s) => s.addReport);
  const setLayer = useAppStore((s) => s.setLayer);
  const [reportType, setReportType] = useState<'flood'|'blockage'>('flood');
  const [reportLocationQuery, setReportLocationQuery] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const region = useMemo(() => getRegion(city), [city]);
  const bbox = useMemo(() => bboxFromStore ?? region?.bbox, [bboxFromStore, region]);

  // Geocode origin location
  async function geocodeOrigin(query: string) {
    setError(null);
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) throw new Error('Location not found');
      const { lat, lon } = json[0];
      setUserLocation([Number(lat), Number(lon)]);
    } catch (e: any) {
      setError(e?.message || 'Failed to resolve your location');
    } finally {
      setLoading(false);
    }
  }

  // Use device geolocation
  async function useDeviceLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not available');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      (err) => {
        setError('Unable to get device location');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Calculate distance between two coordinates
  function distanceKm(a: [number, number], b: [number, number]) {
    const toRad = (n: number) => (n * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Find and set nearest destination
  async function chooseDestination() {
    setError(null);
    if (!endpointType) {
      setError('Please select an endpoint category');
      return;
    }
    if (!userLocation) {
      setError('Please set your current location first');
      return;
    }
    
    const [lat, lon] = userLocation;
    const dLat = 0.2; // ~22 km
    const dLon = 0.2; // ~22 km
    const minLon = lon - dLon, minLat = lat - dLat, maxLon = lon + dLon, maxLat = lat + dLat;

    try {
      const res = await fetch(`/api/osm-pois?bbox=${minLon},${minLat},${maxLon},${maxLat}`);
      const json = await res.json();
      const pois = Array.isArray(json?.data) ? json.data : [];
      const candidates = pois.filter((p: any) => p.type === endpointType);
      
      if (candidates.length === 0) {
        setError('No endpoints found nearby');
        return;
      }
      
      const nearest = candidates.reduce((best: any, cur: any) => {
        const d = distanceKm([lat, lon], [cur.location[0], cur.location[1]]);
        return !best || d < best.dist ? { ...cur, dist: d } : best;
      }, null);
      
      setDestination([nearest.location[0], nearest.location[1]]);
    } catch (err) {
      setError('Failed to fetch nearby endpoints');
    }
  }

  // Toggle directions display
  const handleShowDirections = () => {
    toggleDirections(!showDirections);
  };

  // Geocode report location
  async function geocodeReport(query: string): Promise<[number,number] | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) return null;
      const { lat, lon } = json[0];
      return [Number(lat), Number(lon)];
    } catch { 
      return null; 
    }
  }

  // Submit incident report
  async function submitReport() {
    setError(null);
    setReportSubmitting(true);
    try {
      let loc: [number, number] | null = null;
      if (reportLocationQuery.trim()) {
        loc = await geocodeReport(reportLocationQuery.trim());
      } else if (userLocation) {
        loc = [userLocation[0], userLocation[1]];
      }
      
      if (!loc) {
        setError('Please provide a location (text) or set your device location.');
        return;
      }
      
      addReport({ type: reportType, description: reportDesc, location: loc });
      setLayer('blockedRoads', true);
      setReportModalOpen(false);
      setReportLocationQuery('');
      setReportDesc('');
    } catch (err) {
      setError('Failed to submit report');
    } finally { 
      setReportSubmitting(false); 
    }
  }

  return (
    <aside
      className={
        `pointer-events-auto glass fixed right-4 top-24 z-[1100] w-80 max-w-[calc(100%-2rem)] rounded-2xl p-4 shadow-soft transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]'
        }`
      }
      aria-label="Route suggestions and tools"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Routes & Tools</h2>
        <button onClick={toggle} className="text-sm focus-ring rounded px-2 py-1">
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      
      <div className="mt-3 space-y-3 text-sm">
        <p className="text-gray-700">Set your current location and choose an endpoint.</p>

        {/* Origin controls */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Your Location</label>
          <div className="flex gap-2">
            <input
              value={originQuery}
              onChange={(e) => setOriginQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && originQuery.trim() && geocodeOrigin(originQuery.trim())}
              placeholder="Enter address, area, city/state"
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus-ring"
            />
            <button
              onClick={() => originQuery.trim() && geocodeOrigin(originQuery.trim())}
              className="rounded-md bg-brand-blue px-2 py-1 text-xs text-white focus-ring"
            >
              Resolve
            </button>
          </div>
          {userLocation ? (
            <div className="text-xs text-gray-600">
              Origin set: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
            </div>
          ) : null}
          <button
            onClick={useDeviceLocation}
            className="rounded-md bg-gray-700 px-2 py-1 text-xs text-white focus-ring"
          >
            Use my device location
          </button>
        </div>

        {/* Endpoint selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Endpoint</label>
          <select
            value={endpointType}
            onChange={(e) => setEndpointType(e.target.value as any)}
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus-ring"
          >
            <option value="">Select</option>
            <option value="shelter">Flood relief / Emergency camp</option>
            <option value="hospital">Hospital</option>
            <option value="police">Police station</option>
          </select>
          {destination ? (
            <div className="text-xs text-gray-600">
              Endpoint set: {destination[0]?.toFixed(4)}, {destination[1]?.toFixed(4)}
            </div>
          ) : null}
          <div className="flex gap-2">
            <button
              onClick={chooseDestination}
              className="flex-1 rounded-md bg-brand-blue px-3 py-2 text-white shadow-soft focus-ring"
            >
              Find nearest endpoint
            </button>
            <button
              onClick={() => setDestination(null)}
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus-ring"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleShowDirections}
            disabled={!userLocation || !destination}
            className={`w-full rounded-md px-3 py-2 text-white shadow-soft focus-ring ${
              showDirections
                ? 'bg-red-500 hover:bg-red-600'
                : (!userLocation || !destination)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-blue hover:bg-blue-600'
            }`}
          >
            {showDirections ? 'Hide Directions' : 'Show Directions'}
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="w-full rounded-md bg-gray-700 px-3 py-2 text-white shadow-soft focus-ring"
          >
            Report flood/blockage
          </button>
        </div>

        {/* Report Modal */}
        {reportModalOpen && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[1200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setReportModalOpen(false)} />
            <div className="relative glass w-[28rem] max-w-[calc(100%-2rem)] rounded-2xl p-4">
              <h3 className="text-sm font-semibold mb-3">Report Flood / Blocked Road</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <label className="text-xs font-medium">Type</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1 text-xs">
                      <input 
                        type="radio" 
                        checked={reportType === 'flood'} 
                        onChange={() => setReportType('flood')} 
                      /> 
                      Flood
                    </label>
                    <label className="flex items-center gap-1 text-xs">
                      <input 
                        type="radio" 
                        checked={reportType === 'blockage'} 
                        onChange={() => setReportType('blockage')} 
                      /> 
                      Blocked road
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Location</label>
                  <input
                    value={reportLocationQuery}
                    onChange={(e) => setReportLocationQuery(e.target.value)}
                    placeholder="Address/area/city (or leave blank to use your location)"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus-ring"
                  />
                  <p className="text-[11px] text-gray-600">Tip: leave blank to use your resolved origin</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Description</label>
                  <textarea
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus-ring"
                    placeholder="Optional details (severity, nearby landmarks)"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={submitReport}
                    disabled={reportSubmitting}
                    className="flex-1 rounded-md bg-brand-blue px-3 py-2 text-white focus-ring disabled:bg-gray-400"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit report'}
                  </button>
                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus-ring"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Errors/Loading */}
        {error ? <div className="text-xs text-red-600">{error}</div> : null}
        {loading ? <div className="text-xs text-gray-600">Loading…</div> : null}
      </div>
    </aside>
  );
}