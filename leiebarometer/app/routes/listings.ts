// app/routes/listings.ts

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  getBuyListings,
  getRentalListings,
  createRentalParams,
  calculateRentPerSqm,
  estimateRentAndYield,
  BuyListing,
  RentalListing,
} from "~/utils/finnScraper";

interface Coordinates {
  lat: string;
  lon: string;
}

interface ListingsResponse {
  buyListings: BuyListing[];
  bestOption: BuyListing | null;
  rentalListings: (RentalListing & { price_per_sqm?: string })[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const radiusParam = url.searchParams.get("radius");
  const propertyType = url.searchParams.get("property_type") || "3"; // Default property_type

  // Validate latitude and longitude
  if (!lat || !lon) {
    return json({ error: "Missing 'lat' or 'lon' query parameters." }, { status: 400 });
  }

  // Validate and set radius
  let radius = 100; // Default radius
  if (radiusParam) {
    const parsedRadius = parseInt(radiusParam, 10);
    if (isNaN(parsedRadius) || parsedRadius < 100 || parsedRadius > 1000) {
      return json(
        { error: "Invalid 'radius' parameter. Must be a number between 100 and 1000." },
        { status: 400 }
      );
    }
    radius = parsedRadius;
  }

  const coordinates: Coordinates = { lat, lon };

  // Define buy search parameters
  const buyParams = {
    radius: radius.toString(),
    lat: coordinates.lat,
    lon: coordinates.lon,
    property_type: propertyType,
    ownership_type: "3",
    rent_to: "4000",
    lifecycle: "1",
    // Add other parameters as needed
  };

  try {
    const maxListings = 200; // Maximum number of listings to fetch

    // Fetch buy listings
    const buyListings: BuyListing[] = await getBuyListings(buyParams, maxListings);

    // Create rental search parameters based on buy parameters
    const rentalParams = createRentalParams(buyParams);

    // Fetch rental listings
    const rentalListingsRaw: RentalListing[] = await getRentalListings(rentalParams, maxListings);

    // Calculate rental price per sqm
    const rentalListingsWithSqm = calculateRentPerSqm(rentalListingsRaw);

    // Estimate rent and yield
    const { buyWithYield, bestOption } = estimateRentAndYield(buyListings, rentalListingsWithSqm);

    const response: ListingsResponse = {
      buyListings: buyWithYield,
      bestOption,
      rentalListings: rentalListingsWithSqm,
    };

    return json(response);
  } catch (error) {
    console.error(`Error in loader: ${error}`);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};