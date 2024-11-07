// app/components/CookieBanner.tsx

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [cookies, setCookie] = useCookies(["cookieConsent"]);

  useEffect(() => {
    if (!cookies.cookieConsent) {
      setIsVisible(true);
    }
  }, [cookies.cookieConsent]);

  const acceptAll = () => {
    setCookie("cookieConsent", "all", { path: "/" });
    setIsVisible(false);
    // Optionally reload the page to initialize PostHog
    window.location.reload();
  };

  const acceptNecessary = () => {
    setCookie("cookieConsent", "necessary", { path: "/" });
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-dark-card shadow-lg p-4 md:p-6 z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-gray-700 dark:text-gray-300 mb-4 md:mb-0">
          Vi bruker informasjonskapsler for å forbedre opplevelsen din.{" "}
          {showMore && (
            <>
              Vi samler inn anonyme data for å forstå hvordan nettstedet brukes.
              <br />
              Ved å velge "Godta alle" samtykker du til full sporing. Ved å velge
              "Godta nødvendige" vil bare essensielle informasjonskapsler bli brukt.
            </>
          )}
          {!showMore && (
            <button
              onClick={() => setShowMore(true)}
              className="text-accent underline ml-1"
            >
              Les mer
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={acceptNecessary}
            className="px-4 py-2 bg-gray-200 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-dark-background transition"
          >
            Godta nødvendige
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition"
          >
            Godta alle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
