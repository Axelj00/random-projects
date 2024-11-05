// app/components/landing/SearchParams.tsx

import React from "react";

interface SearchParamsProps {
  radius: number;
  setRadius: (value: number) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
}

const SearchParams: React.FC<SearchParamsProps> = ({
  radius,
  setRadius,
  propertyType,
  setPropertyType,
}) => {
  const propertyTypes = [
    { value: "1", label: "Hus" },
    { value: "2", label: "Tomannsbolig" },
    { value: "3", label: "Leilighet" },
    { value: "4", label: "Rekkehus" },
  ];

  return (
    <div className="space-y-6">
      {/* Radius Slider */}
      <div>
        <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Radius: {radius} meter
        </label>
        <input
          type="range"
          id="radius"
          name="radius"
          min="100"
          max="1000"
          step="100"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full mt-2"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Juster radiusen ved å dra skyveknappen over.
        </div>
      </div>

      {/* Property Type Selection */}
      <div>
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Eiendomstype
        </span>
        <div className="mt-2 flex flex-wrap gap-4">
          {propertyTypes.map((type) => (
            <label key={type.value} className="inline-flex items-center">
              <input
                type="radio"
                name="propertyType"
                value={type.value}
                checked={propertyType === type.value}
                onChange={(e) => setPropertyType(e.target.value)}
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{type.label}</span>
            </label>
          ))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Velg en eiendomstype fra listen over.
        </div>
      </div>
    </div>
  );
};

export default SearchParams;
