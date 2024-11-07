// app/entry.client.tsx

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import posthog from "posthog-js";
import { useCookies } from "react-cookie";

function PosthogInit() {
  const [cookies] = useCookies(["cookieConsent"]);

  useEffect(() => {
    if (cookies.cookieConsent === "all") {
      posthog.init("phc_2A05w7LYR3Hc4NjFEAjRL00wqxQ6IhRHTekQq92LE75", {
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
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>
  );
});
