// app/components/landing/MapInput.tsx

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface MapInputProps {
  onSelect: (address: string, coordinates: { lat: string; lon: string }) => void;
  onClose: () => void;
  initialCoordinates?: { lat: number; lng: number } | null;
}

const MapInput: React.FC<MapInputProps> = ({ onSelect, onClose, initialCoordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!window.google) {
      toast.error("Google Maps not loaded");
      return;
    }

    // Initialize the map
    const map = new google.maps.Map(mapRef.current!, {
      center: initialCoordinates || { lat: 59.9139, lng: 10.7522 }, // Default to Oslo
      zoom: 13,
    });

    // Initialize the marker at the center
    markerRef.current = new google.maps.Marker({
      map,
      draggable: true,
      position: map.getCenter(),
    });

    const geocoder = new google.maps.Geocoder();

    // Function to handle geocoding and selecting address
    const handleGeocode = (location: google.maps.LatLng) => {
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          const coordinates = {
            lat: location.lat().toString(),
            lon: location.lng().toString(),
          };
          onSelect(address, coordinates);
          toast.success("Adresse valgt på kartet");
          onClose();
        } else {
          toast.error("Kunne ikke hente adresse fra lokasjonen");
          console.error("Geocoding failed:", status);
        }
      });
    };

    // Listener for map clicks
    const mapClickListener = map.addListener(
      "click",
      (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          markerRef.current!.setPosition(e.latLng);
          map.panTo(e.latLng);
          handleGeocode(e.latLng);
        }
      }
    );

    // Listener for marker drag end
    const markerDragEndListener = markerRef.current.addListener("dragend", () => {
      const position = markerRef.current!.getPosition();
      if (position) {
        map.panTo(position);
        handleGeocode(position);
      }
    });

    // Keyboard listener for Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listeners on unmount
    return () => {
      google.maps.event.removeListener(mapClickListener);
      google.maps.event.removeListener(markerDragEndListener);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSelect, onClose, initialCoordinates]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
    >
      <div className="bg-white dark:bg-dark-card rounded-lg overflow-hidden shadow-lg w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 h-3/4 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark-border">
          <h2
            id="map-modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-dark-text"
          >
            Velg adresse på kartet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Close map modal"
          >
            ×
          </button>
        </div>

        {/* Instruction */}
        <div className="p-4 text-center text-gray-700 dark:text-gray-300">
          Trykk hvor som helst på kartet for å velge en adresse.
        </div>

        {/* Map Container */}
        <div ref={mapRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default MapInput;
