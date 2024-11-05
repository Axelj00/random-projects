// app/api/geocode.ts
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query || query.length < 3) {
    return json([]);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocoding data.");
    }

    const data: NominatimResult[] = await response.json();

    return json(data);
  } catch (error) {
    console.error("Geocoding error:", error);
    return json([]);
  }
};

export default function Geocode() {
  // This is a loader route, no UI
}
