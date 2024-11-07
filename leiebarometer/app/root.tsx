// app/root.tsx

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import React from "react";
import { loadGoogleMaps } from "~/utils/loadGoogleMaps";
import CookieBanner from "~/components/CookieBanner";
import { CookiesProvider, useCookies } from "react-cookie";
import "./tailwind.css";

interface LoaderData {
  env: {
    GOOGLE_API_KEY: string;
  };
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    env: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    },
  });
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
  },
  { rel: "stylesheet", href: "/app/tailwind.css" },
];

export default function App() {
  const data = useLoaderData<LoaderData>();
  const [cookies] = useCookies(["cookieConsent"]);

  // Load Google Maps
  React.useEffect(() => {
    const apiKey = data.env.GOOGLE_API_KEY;
    if (apiKey) {
      loadGoogleMaps(apiKey).catch((error: Error) => {
        console.error("Failed to load Google Maps", error);
      });
    }
  }, [data.env.GOOGLE_API_KEY]);

  return (
    <html lang="no">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Google Ads Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8273640777343476"
          crossOrigin="anonymous"
        ></script>
        {/* Include PostHog Web Snippet Based on Consent */}
        {cookies.cookieConsent === "all" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
                posthog.init('phc_2A05w7LYR3Hc4NjFEAjRL00wqxQ6IhRHTekQq92LE75', {
                  api_host: 'https://eu.i.posthog.com',
                  autocapture: true,
                  capture_pageview: true,
                  session_recording: {
                    // Optional session recording configurations
                  },
                });
              `,
            }}
          ></script>
        )}
      </head>
      <body>
        <CookiesProvider>
          <Outlet />
          <CookieBanner />
        </CookiesProvider>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(data.env)};`,
          }}
        />
      </body>
    </html>
  );
}
