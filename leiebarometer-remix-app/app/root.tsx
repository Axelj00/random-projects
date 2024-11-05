// app/root.tsx
import { json, LoaderFunction } from "@remix-run/node"; 
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import "./tailwind.css";

interface LoaderData {
  GOOGLE_API_KEY: string;
}

// Loader function for environment variables with Cache-Control headers
export const loader: LoaderFunction = () => {
  return json<LoaderData>(
    {
      GOOGLE_API_KEY: process.env.REACT_APP_GOOGLE_API_KEY || "",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600", // 1 hour cache
      },
    }
  );
};

// Document component with accessibility and hydration fixes
export function Document({ children }: { children: React.ReactNode }) {
  const { GOOGLE_API_KEY } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Property Finder</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify({ GOOGLE_API_KEY })};`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
