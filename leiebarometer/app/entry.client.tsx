// app/entry.client.tsx

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import posthog from "posthog-js";
import { useCookies, CookiesProvider } from "react-cookie";

function PosthogInit() {
  const [cookies] = useCookies(["cookieConsent"]);

  useEffect(() => {
    if (cookies.cookieConsent === "all") {
      posthog.init("YOUR_POSTHOG_API_KEY", {
        api_host: "https://eu.i.posthog.com",
        autocapture: true,
        capture_pageview: true,
        session_recording: {
          // Optional session recording configurations
        },
      });
    }
  }, [cookies.cookieConsent]);

  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <CookiesProvider>
        <RemixBrowser />
        <PosthogInit />
      </CookiesProvider>
    </StrictMode>
  );
});
