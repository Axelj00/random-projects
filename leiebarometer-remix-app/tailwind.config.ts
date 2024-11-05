// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"], // Ensure all relevant files are scanned
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Figtree"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        primary: {
          light: "#4F46E5", // Indigo-600
          DEFAULT: "#4338CA", // Indigo-700
          dark: "#3730A3", // Indigo-800
        },
        secondary: {
          light: "#22D3EE", // Cyan-400
          DEFAULT: "#06B6D4", // Cyan-500
          dark: "#0891B2", // Cyan-600
        },
        accent: {
          light: "#10B981", // Emerald-500
          DEFAULT: "#059669", // Emerald-600
          dark: "#047857", // Emerald-700
        },
        neutral: {
          light: "#F3F4F6", // Gray-100
          DEFAULT: "#E5E7EB", // Gray-200
          dark: "#D1D5DB", // Gray-300
        },
        background: {
          light: "#FFFFFF", // White
          DEFAULT: "#F9FAFB", // Gray-50
          dark: "#1F2937", // Gray-800
        },
        text: {
          primary: "#111827", // Gray-900
          secondary: "#6B7280", // Gray-500
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
