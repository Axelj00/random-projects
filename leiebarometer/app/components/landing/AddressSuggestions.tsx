// app/components/landing/AddressSuggestions.tsx

import React from "react";

interface AddressSuggestionsProps {
  suggestions: google.maps.places.AutocompletePrediction[];
  onSelect: (suggestion: google.maps.places.AutocompletePrediction) => void;
}

const AddressSuggestions: React.FC<AddressSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <ul
      className="absolute z-20 mt-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-strong max-h-60 overflow-y-auto w-full"
      role="listbox"
    >
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.place_id}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-gray-900 dark:text-dark-text transition-colors"
          role="option"
          aria-selected="false"
        >
          {suggestion.description}
        </li>
      ))}
    </ul>
  );
};

export default AddressSuggestions;
