// app/components/landing/SqmPriceCounter.tsx

import React, { useState } from "react";
import CountUp from "react-countup";
import { FaCalculator } from "react-icons/fa";

interface SqmPriceCounterProps {
  price: number; // Average price per sqm in kr
}

const SqmPriceCounter: React.FC<SqmPriceCounterProps> = ({ price }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [apartmentSize, setApartmentSize] = useState<number | "">("");
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseFloat(value);
    setApartmentSize(isNaN(numericValue) ? "" : numericValue);

    if (!isNaN(numericValue)) {
      setEstimatedPrice(numericValue * price);
    } else {
      setEstimatedPrice(0);
    }
  };

  return (
    <div className="mt-4 text-center">
      <span className="text-4xl font-bold text-accent">
        <CountUp end={price} duration={2} separator=" " decimal="," decimals={0} />
        <span className="text-2xl"> kr/m²</span>
      </span>
      <div className="text-lg text-gray-700 dark:text-gray-300 mt-2">
        Gjennomsnittlig Pris per kvadratmeter
      </div>

      {/* Toggle Calculator */}
      <button
        onClick={() => setShowCalculator(!showCalculator)}
        className="mt-4 text-accent hover:text-accent-dark focus:outline-none flex items-center justify-center mx-auto"
      >
        <FaCalculator className="mr-2" />
        Beregn din leiepris
      </button>

      {showCalculator && (
        <div className="mt-4 bg-white dark:bg-dark-card rounded-lg p-4 shadow-soft max-w-md mx-auto">
          <label
            htmlFor="apartmentSize"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Skriv inn størrelsen på leiligheten din (m²):
          </label>
          <input
            type="number"
            id="apartmentSize"
            name="apartmentSize"
            value={apartmentSize}
            onChange={handleSizeChange}
            placeholder="f.eks. 50"
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-accent dark:focus:border-accent focus:outline-none text-gray-900 dark:text-dark-text bg-white dark:bg-dark-background transition-all duration-200"
          />
          {estimatedPrice > 0 && (
            <div className="mt-4 text-center">
              <div className="text-lg text-gray-700 dark:text-gray-300">
                Estimert leiepris:
              </div>
              <div className="text-2xl font-bold text-accent">
                <CountUp
                  end={estimatedPrice}
                  duration={1}
                  separator=" "
                  decimal=","
                  decimals={0}
                />{" "}
                kr/måned
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SqmPriceCounter;
