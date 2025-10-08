// This file is kept for backward-compat imports. Use accuweather.ts instead.
export type ImdAlert = never;
export async function fetchImdAlerts(_city: string): Promise<ImdAlert[]> {
  return [];
}

