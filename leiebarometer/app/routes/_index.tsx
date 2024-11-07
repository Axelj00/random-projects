// app/routes/_index.tsx

import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import DarkModeToggle from "~/components/utils/DarkModeToggle";
import SearchForm from "~/components/landing/SearchForm";
import ListingTable from "~/components/landing/ListingTable";
import SqmPriceCounter from "~/components/landing/SqmPriceCounter";
import Highlights from "~/components/landing/Highlights";
import GoogleAd from "~/components/GoogleAd";

// Remove import of useHydrated from '@remix-run/react'

// Define the custom useHydrated hook
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

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

  // New state for average sqm price
  const [avgPricePerSqm, setAvgPricePerSqm] = useState<number>(0);

  // State to keep track of dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Use the custom useHydrated hook
  const hydrated = useHydrated();

  useEffect(() => {
    // Check if 'dark' class is present on the html element
    const classList = document.documentElement.classList;
    const darkModeOn = classList.contains("dark");
    setIsDarkMode(darkModeOn);

    // Observer to watch for changes in the 'dark' class
    const observer = new MutationObserver(() => {
      const darkModeUpdated =
        document.documentElement.classList.contains("dark");
      setIsDarkMode(darkModeUpdated);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleSearch = async (
    address: string,
    coordinates: { lat: string; lon: string },
    radius: number,
    propertyType: string
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
    setAvgPricePerSqm(0); // Reset average price

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
        setError(
          errorData.error || "En feil oppstod under henting av annonser."
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("API Response:", data); // Added logging for debugging

      if (
        data.buyListings.length === 0 ||
        data.rentalListings.length === 0
      ) {
        setError(
          "Ingen treff for søket ditt. Vennligst prøv med andre søkeparametere."
        );
        setLoading(false);
        return;
      }

      setBuyListings(data.buyListings);
      setRentalListings(data.rentalListings);
      setBestOption(data.bestOption);

      // Calculate average price per sqm
      const validRentalListings = data.rentalListings.filter(
        (rental: RentalListing) =>
          rental.price_per_sqm && !isNaN(parseFloat(rental.price_per_sqm))
      );
      const avg =
        validRentalListings.reduce(
          (sum: number, rental: RentalListing) =>
            sum + parseFloat(rental.price_per_sqm!),
          0
        ) / validRentalListings.length || 0;
      setAvgPricePerSqm(avg);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("En uventet feil oppstod. Vennligst prøv igjen senere.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-background dark:to-dark-card transition-colors duration-300">
      <DarkModeToggle />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          {hydrated ? (
            <img
              src={
                isDarkMode
                  ? "/brand/LBlogoDark.png"
                  : "/brand/LBlogoLight.png"
              }
              alt="Leiebarometeret"
              className="mx-auto w-full max-w-xs h-auto"
            />
          ) : (
            <img
              src="/brand/LBlogoLight.png"
              alt="Leiebarometeret"
              className="mx-auto w-full max-w-xs h-auto"
            />
          )}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
            Finn ut hva du skal gi eller ta i leie basert på faktiske
            markedspriser
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Dataene er hentet fra FINN.no, og verktøyet gir kun estimasjoner.
          Informasjonen skal ikke tas som faktiske råd.
        </div>

        {/* Ad Space Above Content */}
        <div className="mb-8">
          <GoogleAd
            adClient="ca-pub-8273640777343476" // Your AdSense Publisher ID
            adSlot="YOUR_AD_SLOT_ID_1" // Your Ad Unit ID
            style={{ display: "block", textAlign: "center" }}
            adFormat="auto"
            fullWidthResponsive={true}
          />
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-soft p-6">
            <SearchForm onSearch={handleSearch} />
          </div>

          {loading && (
            <div className="text-center text-gray-700 dark:text-gray-300">
              Henter data...
            </div>
          )}

          {error && <div className="text-center text-red-500">{error}</div>}

          {!loading &&
            !error &&
            buyListings.length > 0 &&
            rentalListings.length > 0 && (
              <>
                {avgPricePerSqm > 0 && (
                  <>
                    <SqmPriceCounter price={avgPricePerSqm} />
                    <Highlights
                      avgPricePerSqm={avgPricePerSqm}
                      bestOption={bestOption}
                      buyListings={buyListings}
                      rentalListings={rentalListings}
                    />
                  </>
                )}

                {/* Ad Space Between Highlights and Listings */}
                <div className="my-8">
                  <GoogleAd
                    adClient="ca-pub-8273640777343476" // Your AdSense Publisher ID
                    adSlot="YOUR_AD_SLOT_ID_2" // Your Ad Unit ID
                    style={{ display: "block", textAlign: "center" }}
                    adFormat="auto"
                    fullWidthResponsive={true}
                  />
                </div>

                <div className="space-y-6">
                  <ListingTable
                    buyListings={buyListings}
                    rentalListings={rentalListings}
                    bestOption={bestOption}
                  />
                </div>
              </>
            )}
        </div>
      </main>
    </div>
  );
}
