// app/components/landing/ListingTable.tsx

import React from "react";

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

interface ListingTableProps {
  buyListings: BuyListing[];
  rentalListings: RentalListing[];
  bestOption: BuyListing | null;
}

const ListingTable: React.FC<ListingTableProps> = ({
  buyListings,
  rentalListings,
  bestOption,
}) => {
  return (
    <div className="space-y-12">
      {/* Buy Listings */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Salgslister
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-dark-card rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tittel
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Størrelse (m²)
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pris (kr)
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Yield (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {buyListings.map((buy) => (
                <tr
                  key={buy.listing_url}
                  className={`${
                    bestOption && buy.listing_url === bestOption.listing_url
                      ? "bg-green-100 dark:bg-green-700/20"
                      : "bg-white dark:bg-dark-card"
                  } border-b border-gray-200 dark:border-dark-border`}
                >
                  <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-100">
                    <a
                      href={buy.listing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {buy.title}
                    </a>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {buy.address}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {buy.size_m2}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {buy.price_kr}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {buy.yield_percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rental Listings */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Leielister
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-dark-card rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tittel
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Størrelse (m²)
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Leie (kr)
                </th>
                <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pris per m² (kr)
                </th>
              </tr>
            </thead>
            <tbody>
              {rentalListings.map((rental) => (
                <tr
                  key={rental.listing_url}
                  className="border-b border-gray-200 dark:border-dark-border"
                >
                  <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-100">
                    <a
                      href={rental.listing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {rental.title}
                    </a>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {rental.address}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {rental.size_m2}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {rental.rental_price_kr}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {rental.price_per_sqm} kr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Investment Option */}
      {bestOption && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Beste Investering
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-dark-card rounded-lg shadow">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Tittel
                  </th>
                  <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Størrelse (m²)
                  </th>
                  <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Totalpris (kr)
                  </th>
                  <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Estimert Leie (kr/m²)
                  </th>
                  <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Årlig Leie (kr)
                  </th>
                  <th className="py-3 px-6 bg-gray-200 dark:bg-dark-border text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Yield (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-100 dark:bg-green-700/20 border-b border-gray-200 dark:border-dark-border">
                  <td className="py-4 px-6 text-sm text-gray-900 dark:text-gray-100">
                    <a
                      href={bestOption.listing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {bestOption.title}
                    </a>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {bestOption.address}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {bestOption.size_m2}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {bestOption.total_price_kr}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {bestOption.estimated_rent_kr} kr
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {bestOption.annual_rent_kr} kr
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {bestOption.yield_percentage}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingTable;
