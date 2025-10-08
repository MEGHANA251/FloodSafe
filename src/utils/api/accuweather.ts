// AccuWeather Alerts placeholder utilities
// Real API: https://developer.accuweather.com/; requires API key and location keys

export type AccuAlert = {
  id: string;
  severity: 'yellow' | 'orange' | 'red';
  title: string;
  description?: string;
  issuedAt: string;
};

export async function fetchAccuAlerts(city: string): Promise<AccuAlert[]> {
  // TODO: Replace with real AccuWeather API integration using ACCUWEATHER_API_KEY
  return [
    {
      id: 'accu-1',
      severity: 'orange',
      title: `${city.toUpperCase()}: Heavy rainfall likely in next 24 hours`,
      description: 'Avoid low-lying areas and underpasses. Monitor local advisories.',
      issuedAt: new Date().toISOString(),
    },
  ];
}

