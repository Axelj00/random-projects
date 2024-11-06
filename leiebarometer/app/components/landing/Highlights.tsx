// app/components/landing/Highlights.tsx

import React from 'react';
import { FaHome, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import CountUp from 'react-countup';

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

interface HighlightsProps {
  avgPricePerSqm: number;
  bestOption: BestOption | null;
  buyListings: BuyListing[];
  rentalListings: RentalListing[];
}

const Highlights: React.FC<HighlightsProps> = ({
  avgPricePerSqm,
  bestOption,
  buyListings,
  rentalListings,
}) => {
  // Helper function to parse price strings
  const parsePrice = (priceStr: string) => {
    const cleanedStr = priceStr.replace(/\s/g, '').replace('kr', '');
    return parseFloat(cleanedStr) || 0;
  };

  // Calculate average property price
  const avgPropertyPrice =
    buyListings.reduce((sum, listing) => sum + parsePrice(listing.price_kr), 0) /
    buyListings.length || 0;

  // Calculate average rental price
  const avgRentalPrice =
    rentalListings.reduce((sum, listing) => sum + parsePrice(listing.rental_price_kr), 0) /
    rentalListings.length || 0;

  // Format numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString('no-NO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Average Property Price */}
      <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-soft flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
        <FaHome className="text-4xl text-accent mb-4" />
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Gjennomsnittlig Pris
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">
            <CountUp end={avgPropertyPrice} duration={2} separator=" " /> kr
          </div>
        </div>
      </div>

      {/* Average Rental Price */}
      <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-soft flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
        <FaMoneyBillWave className="text-4xl text-accent mb-4" />
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Gjennomsnittlig Leiepris
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">
            <CountUp end={avgRentalPrice} duration={2} separator=" " /> kr
          </div>
        </div>
      </div>

      {/* Best Investment Option */}
      {bestOption && (
        <a
          href={bestOption.listing_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-soft flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
        >
          <FaChartLine className="text-4xl text-accent mb-4" />
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Beste Investering
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-dark-text">
              {/* Truncate the title if it's too long */}
              <span title={bestOption.title}>
                {bestOption.title.length > 30
                  ? `${bestOption.title.substring(0, 27)}...`
                  : bestOption.title}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Yield: {bestOption.yield_percentage}%
            </div>
          </div>
        </a>
      )}
    </div>
  );
};

export default Highlights;
