// app/components/landing/ListingTable.tsx
import React from "react";

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

interface ListingTableProps {
  buyListings: BuyListing[];
  rentalListings: RentalListing[];
}

const ListingTable: React.FC<ListingTableProps> = ({ buyListings, rentalListings }) => {
  return (
    <>
      {buyListings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">Buy Listings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-primary-default">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">URL</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Address</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Size (m²)</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Price (kr)</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Total Price (kr)</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Fellesutgifter (kr)</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Ownership Type</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Rooms</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Viewing Info</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Yield (%)</th>
                </tr>
              </thead>
              <tbody>
                {buyListings.map((listing, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-6">{listing.title}</td>
                    <td className="py-4 px-6">
                      <a href={listing.listing_url} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
                        View
                      </a>
                    </td>
                    <td className="py-4 px-6">{listing.address}</td>
                    <td className="py-4 px-6">{listing.size_m2}</td>
                    <td className="py-4 px-6">{listing.price_kr}</td>
                    <td className="py-4 px-6">{listing.total_price_kr ?? "N/A"}</td>
                    <td className="py-4 px-6">{listing.fellesutgifter_kr ?? "N/A"}</td>
                    <td className="py-4 px-6">{listing.ownership_type}</td>
                    <td className="py-4 px-6">{listing.number_of_rooms}</td>
                    <td className="py-4 px-6">{listing.viewing_info}</td>
                    <td className="py-4 px-6">
                      {listing.yield_percentage ? `${listing.yield_percentage.toFixed(2)}%` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rentalListings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-4">Rental Listings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-secondary-default">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">URL</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Address</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Size (m²)</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Rental Price (kr)</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Ownership Type</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Rooms</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Price per m² (kr)</th>
                </tr>
              </thead>
              <tbody>
                {rentalListings.map((listing, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-6">{listing.title}</td>
                    <td className="py-4 px-6">
                      <a href={listing.listing_url} target="_blank" rel="noopener noreferrer" className="text-secondary-light hover:underline">
                        View
                      </a>
                    </td>
                    <td className="py-4 px-6">{listing.address}</td>
                    <td className="py-4 px-6">{listing.size_m2}</td>
                    <td className="py-4 px-6">{listing.rental_price_kr}</td>
                    <td className="py-4 px-6">{listing.ownership_type}</td>
                    <td className="py-4 px-6">{listing.number_of_rooms}</td>
                    <td className="py-4 px-6">
                      {listing.price_per_sqm ? `${listing.price_per_sqm.toFixed(2)} kr/m²` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingTable;
