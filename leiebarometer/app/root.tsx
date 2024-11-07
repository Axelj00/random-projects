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
import { CookiesProvider } from "react-cookie";
import { cssBundleHref } from "@remix-run/css-bundle"; // Import cssBundleHref
import "./tailwind.css"; // Import Tailwind CSS as a side-effect

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
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const data = useLoaderData<LoaderData>();

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

        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8273640777343476"
          crossOrigin="anonymous"
        ></script>
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
