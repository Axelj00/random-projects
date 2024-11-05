// app/components/landing/AddressInput.tsx
import React, { useState, useEffect, useRef } from "react";
import { FaSearchLocation, FaMapMarkedAlt, FaEdit } from "react-icons/fa";
import Button from "../utils/Button";
import MapInput from "./MapInput";
import { loadGoogleMaps } from "~/utils/loadGoogleMaps";
import { toast } from "sonner";

interface AddressInputProps {
  onSelect: (address: string, coordinates: { lat: string; lon: string }) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = window.env?.GOOGLE_API_KEY;
    if (!apiKey) {
      toast.error("Google Maps API key is missing");
      return;
    }

    loadGoogleMaps(apiKey)
      .then(() => {
        setIsMapsLoaded(true);
        toast.success("Maps loaded successfully");
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
          types: ['address']
        },
        (predictions, status) => {
          if (!isActive) return;
          
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
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

  // Updated handleSelect to match the expected onSelect type
  const handleSelect = (address: string, coordinates: { lat: string; lon: string }) => {
    setQuery(address);
    setSuggestions([]);
    setIsLocked(true);
    onSelect(address, coordinates);
    toast.success("Address selected successfully");
  };

  // New handler to process AutocompletePrediction and call handleSelect
  const handleSelectFromSuggestion = (suggestion: google.maps.places.AutocompletePrediction) => {
    // Temporarily allow suggestions to be cleared after successful geocoding
    const geocoder = new window.google.maps.Geocoder();
    setIsLoading(true); // Optional: Indicate that geocoding is in progress
    geocoder.geocode(
      { placeId: suggestion.place_id },
      (results, status) => {
        setIsLoading(false);
        if (status === window.google.maps.GeocoderStatus.OK && results?.[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          const coordinates = {
            lat: location.lat().toString(),
            lon: location.lng().toString(),
          };
          handleSelect(results[0].formatted_address || "", coordinates);
        } else {
          toast.error("Could not get location coordinates");
          console.error("Geocoding failed:", status);
        }
      }
    );
  };

  const handleEdit = () => {
    setIsLocked(false);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" role="form" aria-label="Address search">
      {/* Updated max-w-md to max-w-xl to make the input field wider */}
      <div ref={inputContainerRef} className="relative w-full max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <FaSearchLocation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Skriv adresse for å se leiepris"
              disabled={isLocked}
              aria-label="Address search input"
              aria-expanded={suggestions.length > 0}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-dark-background border border-gray-200 dark:border-dark-border rounded-lg shadow-soft focus:ring-2 focus:ring-accent/50 focus:border-accent dark:focus:border-accent focus:outline-none text-gray-900 dark:text-dark-text disabled:bg-gray-50 dark:disabled:bg-dark-card transition-all duration-200"
            />
            {isLocked && (
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
            Select on map
          </Button>
        </div>

        {isLoading && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400" role="status">
            Loading suggestions...
          </div>
        )}

        {!isLoading && suggestions.length > 0 && !isLocked && (
          <ul
            className="absolute z-20 mt-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-strong max-h-60 overflow-y-auto w-full"
            role="listbox"
          >
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSelectFromSuggestion(suggestion)}
                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-gray-900 dark:text-dark-text transition-colors"
                role="option"
                aria-selected="false"
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}

        {isMapOpen && (
          <MapInput onSelect={handleSelect} onClose={() => setIsMapOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default AddressInput;
