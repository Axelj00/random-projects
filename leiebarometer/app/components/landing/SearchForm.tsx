// app/components/landing/SearchForm.tsx

import React, { useState } from "react";
import AddressInput from "./AddressInput";
import SearchParams from "./SearchParams";
import Button from "../utils/Button";
import { toast } from "sonner";

interface SearchFormProps {
  onSearch: (
    address: string,
    coordinates: { lat: string; lon: string },
    radius: number,
    propertyType: string
  ) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: string; lon: string } | null>(
    null
  );
  const [radius, setRadius] = useState(500); // Default radius
  const [propertyType, setPropertyType] = useState("3"); // Default to Leilighet

  const handleAddressSelect = (
    selectedAddress: string,
    coords: { lat: string; lon: string }
  ) => {
    setAddress(selectedAddress);
    setCoordinates(coords);
  };

  const handleAddressReset = () => {
    setAddress("");
    setCoordinates(null);
  };

  const handleSearch = () => {
    if (address && coordinates) {
      onSearch(address, coordinates, radius, propertyType);
    } else {
      toast.error("Vennligst velg en adresse før du søker");
    }
  };

  return (
    <div className="space-y-6">
      <AddressInput onSelect={handleAddressSelect} onReset={handleAddressReset} />
      <SearchParams
        radius={radius}
        setRadius={setRadius}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
      />
      <div className="mt-4 flex justify-center">
        <Button onClick={handleSearch} variant="primary">
          Finn leiepris
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;
