// app/utils/loadGoogleMaps.ts

export const loadGoogleMaps = (() => {
  let isLoaded = false;
  let loadPromise: Promise<void> | null = null;

  return (apiKey: string): Promise<void> => {
    if (isLoaded) {
      return Promise.resolve();
    }

    if (loadPromise) {
      return loadPromise;
    }

    loadPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("window is undefined"));
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        loadPromise = null;
        reject(new Error("Kunne ikke laste Google Maps-scriptet"));
      };
      document.head.appendChild(script);
    });

    return loadPromise;
  };
})();
