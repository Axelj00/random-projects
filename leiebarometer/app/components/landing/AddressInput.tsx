// app/components/landing/AddressInput.tsx

import React, { useState, useEffect, useRef } from "react";
import { FaSearchLocation, FaMapMarkedAlt, FaEdit } from "react-icons/fa";
import Button from "../utils/Button";
import MapInput from "./MapInput";
import AddressSuggestions from "./AddressSuggestions";
import { loadGoogleMaps } from "~/utils/loadGoogleMaps";
import { toast } from "sonner";

interface AddressInputProps {
  onSelect: (address: string, coordinates: { lat: string; lon: string }) => void;
  onReset?: () => void; // Optional prop to handle reset
}

const AddressInput: React.FC<AddressInputProps> = ({ onSelect, onReset }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: string; lon: string } | null>(
    null
  );

  useEffect(() => {
    const apiKey = window.env?.GOOGLE_API_KEY;
    if (!apiKey) {
      toast.error("Google Maps API key is missing");
      return;
    }

    loadGoogleMaps(apiKey)
      .then(() => {
        setIsMapsLoaded(true);
      })
      .catch((error: Error) => {
        toast.error("Could not load Google Maps");
        console.error("Maps loading error:", error);
      });
  }, []);

  useEffect(() => {
    if (!isMapsLoaded) return;

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    let isActive = true;

    const fetchSuggestions = () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "no" },
          types: ["address"],
        },
        (predictions, status) => {
          if (!isActive) return;

          setIsLoading(false);
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
            if (status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              toast.error("Error fetching address suggestions");
            }
          }
        }
      );
    };

    const debounceFetch = setTimeout(fetchSuggestions, 300);
    return () => {
      isActive = false;
      clearTimeout(debounceFetch);
    };
  }, [query, isMapsLoaded]);

  const handleSelect = (
    address: string,
    coordinates: { lat: string; lon: string }
  ) => {
    setQuery(address);
    setSuggestions([]);
    setSelectedAddress(address);
    setCoordinates(coordinates);
    onSelect(address, coordinates); // Ensure the parent component receives the selection
    toast.success("Adresse valgt");
  };

  const handleSelectFromSuggestion = (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    const geocoder = new window.google.maps.Geocoder();
    setIsLoading(true); // Indicate that geocoding is in progress
    geocoder.geocode({ placeId: suggestion.place_id }, (results, status) => {
      setIsLoading(false);
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results?.[0]?.geometry?.location
      ) {
        const location = results[0].geometry.location;
        const coordinates = {
          lat: location.lat().toString(),
          lon: location.lng().toString(),
        };
        handleSelect(results[0].formatted_address || "", coordinates);
      } else {
        toast.error("Kunne ikke hente lokasjonskoordinater");
        console.error("Geocoding failed:", status);
      }
    });
  };

  const handleEdit = () => {
    setSelectedAddress("");
    setCoordinates(null);
    setQuery("");
    setSuggestions([]);
    if (onReset) {
      onReset(); // Notify parent component that the address has been reset
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto"
      role="form"
      aria-label="Address search"
    >
      <div ref={inputContainerRef} className="relative w-full max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <FaSearchLocation
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Skriv adresse for å se leiepris"
              disabled={!!selectedAddress}
              aria-label="Address search input"
              aria-expanded={suggestions.length > 0}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-dark-background border border-gray-200 dark:border-dark-border rounded-lg shadow-soft focus:ring-2 focus:ring-accent/50 focus:border-accent dark:focus:border-accent focus:outline-none text-gray-900 dark:text-dark-text disabled:bg-gray-50 dark:disabled:bg-dark-card transition-all duration-200"
            />
            {selectedAddress && (
              <button
                onClick={handleEdit}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Edit address"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => setIsMapOpen(true)}
            variant="secondary"
            className="whitespace-nowrap"
            aria-label="Select on map"
          >
            <FaMapMarkedAlt className="mr-2" aria-hidden="true" />
            Velg på kart
          </Button>
        </div>

        {isLoading && (
          <div
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            role="status"
          >
            Laster forslag...
          </div>
        )}

        {!isLoading && suggestions.length > 0 && !selectedAddress && (
          <AddressSuggestions
            suggestions={suggestions}
            onSelect={handleSelectFromSuggestion}
          />
        )}

        {isMapOpen && (
          <MapInput
            onSelect={handleSelect}
            onClose={() => setIsMapOpen(false)}
            initialCoordinates={
              coordinates
                ? { lat: parseFloat(coordinates.lat), lng: parseFloat(coordinates.lon) }
                : null
            }
          />
        )}
      </div>
    </div>
  );
};

export default AddressInput;
