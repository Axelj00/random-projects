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
import React, { useEffect } from "react";
import { loadGoogleMaps } from "~/utils/loadGoogleMaps";
import posthog from "posthog-js"; // Import PostHog
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
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: "/build/tailwind.css" }, // Ensure Tailwind CSS is correctly linked
];

export default function App() {
  const data = useLoaderData<LoaderData>();

  useEffect(() => {
    const apiKey = data.env.GOOGLE_API_KEY;
    if (apiKey) {
      loadGoogleMaps(apiKey).catch((error: Error) => {
        console.error("Failed to load Google Maps", error);
      });
    }

    // Initialize PostHog
    posthog.init("phc_2A05w7LYR3Hc4NjFEAjRL00wqxQ6IhRHTekQq92LE75", {
      api_host: "https://eu.i.posthog.com",
      // You can add more configuration options here
    });
  }, [data.env.GOOGLE_API_KEY]);

  return (
    <html lang="en">
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
      </head>
      <body>
        <Outlet />
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
