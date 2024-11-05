// app/types/global.d.ts

/// <reference types="@types/google.maps" />

export {};

declare global {
  interface Window {
    env: {
      GOOGLE_API_KEY: string;
    };
    google: typeof google;
  }
}
