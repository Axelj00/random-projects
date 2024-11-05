// app/routes/index.tsx
import { useState } from "react";
import Layout from "~/components/Layout";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AddressInput from "~/components/landing/AddressInput";
import ListingTable from "~/components/landing/ListingTable";

interface BuyListing {
  title: string;
  listing_url: string;
  address: string;
  size_m2: string;
  price_kr: string;
  total_price_kr: number | null;
  fellesutgifter_kr: number | null;
  ownership_type: string;
  number_of_rooms: string;
  viewing_info: string;
  yield_percentage: number | null;
}

interface RentalListing {
  title: string;
  listing_url: string;
  address: string;
  size_m2: string;
  rental_price_kr: string;
  ownership_type: string;
  number_of_rooms: string;
  price_per_sqm: number | null;
}

export default function Index() {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: string; lon: string } | null>(null);
  const [buyListings, setBuyListings] = useState<BuyListing[]>([]);
  const [rentalListings, setRentalListings] = useState<RentalListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressSelect = (selectedAddress: string, coords: { lat: string; lon: string }) => {
    setAddress(selectedAddress);
    setCoordinates(coords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) {
      setError("Please select a valid address.");
      return;
    }
    setLoading(true);
    setError(null);
    setBuyListings([]);
    setRentalListings([]);

    try {
      const response = await axios.post("/api/scrape", {
        lat: coordinates.lat,
        lon: coordinates.lon,
      });
      setBuyListings(response.data.buyListings);
      setRentalListings(response.data.rentalListings);
    } catch (err: any) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-semibold mb-8 text-primary-dark">
        Find Property Listings in Norway
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <AddressInput onSelect={handleAddressSelect} />
        <button
          type="submit"
          className="w-full p-3 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/90 transition-colors"
          disabled={loading || !coordinates}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {loading && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">Buy Listings</h2>
          <Skeleton count={5} height={40} />
          <h2 className="text-2xl font-semibold text-secondary-dark mt-8 mb-4">Rental Listings</h2>
          <Skeleton count={5} height={40} />
        </div>
      )}

      {!loading && (buyListings.length > 0 || rentalListings.length > 0) && (
        <ListingTable buyListings={buyListings} rentalListings={rentalListings} />
      )}
    </Layout>
  );
}
