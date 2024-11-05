// app/routes/_Index.tsx

import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import DarkModeToggle from "~/components/utils/DarkModeToggle";
import AddressInput from "~/components/landing/AddressInput";
import ListingTable from "~/components/landing/ListingTable";
import SearchParams from "~/components/landing/SearchParams";
import { toast } from "sonner";

interface BuyListing {
  title: string;
  listing_url: string;
  address: string;
  size_m2: string;
  price_kr: string;
  total_price_kr: string;
  fellesutgifter_kr: string;
  ownership_type: string;
  number_of_rooms: string;
  viewing_info: string;
  estimated_rent_kr?: string;
  annual_rent_kr?: string;
  yield_percentage?: string;
}

interface RentalListing {
  title: string;
  listing_url: string;
  address: string;
  size_m2: string;
  rental_price_kr: string;
  ownership_type: string;
  number_of_rooms: string;
  price_per_sqm?: string;
}

interface BestOption extends BuyListing {}

export const meta: MetaFunction = () => {
  return [
    { title: "Leiebarometeret" },
    { name: "description", content: "Se salg og leiepriser enkelt" },
  ];
};

export default function Index() {
  const [buyListings, setBuyListings] = useState<BuyListing[]>([]);
  const [rentalListings, setRentalListings] = useState<RentalListing[]>([]);
  const [bestOption, setBestOption] = useState<BestOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New states for search parameters
  const [radius, setRadius] = useState<number>(100);
  const [propertyType, setPropertyType] = useState<string>("3"); // Default to Leilighet

  const handleAddressSelect = async (
    address: string,
    coordinates: { lat: string; lon: string }
  ) => {
    console.log("Valgt adresse:", address);
    console.log("Koordinater:", coordinates);
    console.log("Radius:", radius);
    console.log("Eiendomstype:", propertyType);

    setLoading(true);
    setError(null);
    setBuyListings([]);
    setRentalListings([]);
    setBestOption(null);

    try {
      // Build the query parameters with radius and property_type
      const params = new URLSearchParams({
        lat: coordinates.lat,
        lon: coordinates.lon,
        radius: radius.toString(),
        property_type: propertyType,
      });

      const response = await fetch(`/listings?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred while fetching listings.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("API Response:", data); // Added logging for debugging

      setBuyListings(data.buyListings);
      setRentalListings(data.rentalListings);
      setBestOption(data.bestOption);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-background dark:to-dark-card transition-colors duration-300">
      <DarkModeToggle />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-text mb-4 tracking-tight">
            Leiebarometeret
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Finn ut hva du skal gi eller ta i leie basert på faktiske markedspriser
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft p-6">
            <AddressInput onSelect={handleAddressSelect} />
            {/* New SearchParams component */}
            <div className="mt-6">
              <SearchParams
                radius={radius}
                setRadius={setRadius}
                propertyType={propertyType}
                setPropertyType={setPropertyType}
              />
            </div>
          </div>

          {loading && (
            <div className="text-center text-gray-700 dark:text-gray-300">
              Henter data...
            </div>
          )}

          {error && (
            <div className="text-center text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && buyListings.length > 0 && rentalListings.length > 0 && (
            <div className="space-y-6">
              <ListingTable
                buyListings={buyListings}
                rentalListings={rentalListings}
                bestOption={bestOption}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
