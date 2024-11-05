// app/components/landing/SqmPriceCounter.tsx

import React, { useState, useEffect } from "react";

interface SqmPriceCounterProps {
  price: number; // Average price per sqm in kr
}

const SqmPriceCounter: React.FC<SqmPriceCounterProps> = ({ price }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = price;
    if (start === end) return;

    const duration = 2000; // Duration of the animation in milliseconds
    const incrementTime = 50; // Time between increments in milliseconds
    const step = Math.ceil(end / (duration / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [price]);

  return (
    <div className="mt-4 text-center">
      <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Gjennomsnittlig Pris: {count.toLocaleString()} kr/m²
      </span>
    </div>
  );
};

export default SqmPriceCounter;
