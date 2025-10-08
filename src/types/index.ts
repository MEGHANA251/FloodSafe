export type Coordinate = [number, number];

export type FloodZone = {
  id: string;
  name?: string;
  risk: 'low' | 'medium' | 'high';
  polygon: Coordinate[];
};

export type BlockedRoad = {
  id: string;
  coordinates: Coordinate[];
  reason?: string;
  reportedAt?: string;
  source?: 'crowd' | 'twitter' | 'manual';
};

export type InfrastructurePOI = {
  id: string;
  type: 'hospital' | 'shelter' | 'police';
  name: string;
  location: Coordinate;
};

export type RouteSuggestion = {
  id: string;
  summary: string;
  distanceKm: number;
  durationMin: number;
  geometry: Coordinate[];
  riskScore: number; // lower is safer
};

