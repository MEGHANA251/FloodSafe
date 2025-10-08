// Twitter/X fetch for flood related tweets by bbox and keywords

export type TweetFloodReport = {
  id: string;
  text: string;
  user: string;
  createdAt: string;
  lat?: number;
  lon?: number;
};

export async function fetchFloodTweets(bbox: [number, number, number, number]): Promise<TweetFloodReport[]> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) throw new Error('Missing TWITTER_BEARER_TOKEN');
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const query = encodeURIComponent('(flood OR waterlogging OR "heavy rain") lang:en -is:retweet');
  const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&expansions=geo.place_id&tweet.fields=created_at,geo&place.fields=geo&max_results=20`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Twitter fetch failed: ${res.status}`);
  const json = await res.json();
  const places: Record<string, any> = {};
  (json.includes?.places || []).forEach((p: any) => (places[p.id] = p));
  const reports: TweetFloodReport[] = (json.data || [])
    .map((t: any) => {
      const place = t.geo?.place_id ? places[t.geo.place_id] : undefined;
      const bboxP = place?.geo?.bbox || [];
      const lon = bboxP.length ? (bboxP[0] + bboxP[2]) / 2 : undefined;
      const lat = bboxP.length ? (bboxP[1] + bboxP[3]) / 2 : undefined;
      // Filter to requested bbox
      if (
        lon !== undefined && lat !== undefined &&
        lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat
      ) {
        return { id: t.id, text: t.text, user: t.author_id ?? 'x-user', createdAt: t.created_at, lat, lon } as TweetFloodReport;
      }
      return null;
    })
    .filter(Boolean) as TweetFloodReport[];
  return reports;
}

