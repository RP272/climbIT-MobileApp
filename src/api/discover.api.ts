import gymsData from "@/src/data/gyms.json";
import type { Gym } from "@/src/types/discover";

/**
 * Fetches featured gyms/climbing walls
 * Simulates API call with a promise
 * To be replaced with real API call when backend is ready
 * Remember to remove the files in /src/data/ and the mock function when real API is implemented
 */
export async function fetchFeaturedGyms(): Promise<Gym[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(gymsData as Gym[]);
    }, 300);
  });
}
