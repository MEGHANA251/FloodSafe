export type Region = {
  id: string;
  name: string;
  center: [number, number]; // lat, lon
  bbox: [number, number, number, number]; // minLon, minLat, maxLon, maxLat
};

// Minimal list; extend to all 28 states + 8 UTs as needed
export const regions: Region[] = [
  { id: 'mumbai', name: 'Mumbai (MH)', center: [19.076, 72.8777], bbox: [72.77, 18.87, 73.1, 19.3] },
  { id: 'delhi', name: 'Delhi (NCT)', center: [28.6139, 77.209], bbox: [76.83, 28.4, 77.5, 28.9] },
  { id: 'kolkata', name: 'Kolkata (WB)', center: [22.5726, 88.3639], bbox: [88.2, 22.4, 88.6, 22.8] },
  { id: 'chennai', name: 'Chennai (TN)', center: [13.0827, 80.2707], bbox: [80.0, 12.9, 80.45, 13.3] },
  { id: 'bengaluru', name: 'Bengaluru (KA)', center: [12.9716, 77.5946], bbox: [77.3, 12.8, 77.8, 13.1] },
  { id: 'hyderabad', name: 'Hyderabad (TS)', center: [17.385, 78.4867], bbox: [78.3, 17.2, 78.7, 17.6] },
  { id: 'ahmedabad', name: 'Ahmedabad (GJ)', center: [23.0225, 72.5714], bbox: [72.4, 22.9, 72.8, 23.2] },
  { id: 'jaipur', name: 'Jaipur (RJ)', center: [26.9124, 75.7873], bbox: [75.5, 26.7, 76.0, 27.1] },
  { id: 'pune', name: 'Pune (MH)', center: [18.5204, 73.8567], bbox: [73.7, 18.4, 74.1, 18.8] },
  { id: 'lucknow', name: 'Lucknow (UP)', center: [26.8467, 80.9462], bbox: [80.7, 26.7, 81.1, 27.0] },
  { id: 'patna', name: 'Patna (BR)', center: [25.5941, 85.1376], bbox: [85.0, 25.4, 85.3, 25.8] },
  { id: 'bhopal', name: 'Bhopal (MP)', center: [23.2599, 77.4126], bbox: [77.25, 23.15, 77.55, 23.4] },
  { id: 'ranchi', name: 'Ranchi (JH)', center: [23.3441, 85.3096], bbox: [85.1, 23.2, 85.5, 23.5] },
  { id: 'guwahati', name: 'Guwahati (AS)', center: [26.1445, 91.7362], bbox: [91.5, 26.0, 92.0, 26.3] },
  { id: 'srinagar', name: 'Srinagar (JK)', center: [34.0837, 74.7973], bbox: [74.6, 33.95, 75.0, 34.2] },
  { id: 'shimla', name: 'Shimla (HP)', center: [31.1048, 77.1734], bbox: [77.0, 31.0, 77.3, 31.2] },
  { id: 'dehradun', name: 'Dehradun (UK)', center: [30.3165, 78.0322], bbox: [77.95, 30.2, 78.2, 30.45] },
  { id: 'jaipur', name: 'Jaipur (RJ)', center: [26.9124, 75.7873], bbox: [75.5, 26.7, 76.0, 27.1] },
];

export function getRegion(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}

