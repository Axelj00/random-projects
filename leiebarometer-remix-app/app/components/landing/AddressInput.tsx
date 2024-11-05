// app/components/landing/AddressInput.tsx
import React, { useState, useEffect } from "react";

interface AddressInputProps {
  onSelect: (address: string, coordinates: { lat: string; lon: string }) => void;
}

// Extend the Window interface to include the Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

const AddressInput: React.FC<AddressInputProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => initializeAutocompleteService();
        document.head.appendChild(script);
      } else {
        initializeAutocompleteService();
      }
    };

    const initializeAutocompleteService = () => {
      if (!window.google) return;

      const autocompleteService = new window.google.maps.places.AutocompleteService();
      let debounceTimeout: NodeJS.Timeout;

      const fetchSuggestions = (input: string) => {
        if (input.length < 3) {
          setSuggestions([]);
          return;
        }

        setIsLoading(true);
        autocompleteService.getPlacePredictions(
          { input, componentRestrictions: { country: "NO" } },
          (
            predictions: google.maps.places.AutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSuggestions(
                predictions.map((place) => ({
                  description: place.description,
                  place_id: place.place_id,
                }))
              );
            }
            setIsLoading(false);
          }
        );
      };

      const handleDebouncedFetch = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => fetchSuggestions(query), 300);
      };

      handleDebouncedFetch();

      return () => clearTimeout(debounceTimeout);
    };

    loadGoogleMapsScript();
  }, [query]);

  const handleSelect = async (suggestion: { description: string; place_id: string }) => {
    setQuery(suggestion.description);
    setSuggestions([]);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { placeId: suggestion.place_id },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          onSelect(suggestion.description, {
            lat: location.lat().toString(),
            lon: location.lng().toString(),
          });
        }
      }
    );
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsLoading(true)}
        onBlur={() => setIsLoading(false)}
        placeholder="e.g., Stavanger, Norway"
        className="w-full p-3 border border-neutral-dark rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
        required
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-neutral-dark rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 hover:bg-primary-light cursor-pointer"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {isLoading && <div className="absolute right-3 top-3">Loading...</div>}
    </div>
  );
};

export default AddressInput;
