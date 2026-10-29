import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#0E946E", // Official UrumSima emerald
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        dark: {
          base: "#0B0F17",
          surface: "#111827",
          card: "#111827",
          elevated: "#1a2234",
          border: "#1F2937",
          hover: "#28344c",
        },
        accent: {
          teal: "#14B8A6",
          amber: "#F59E0B",
          cyan: "#06B6D4",
          purple: "#8B5CF6",
        }
      },
      fontFamily: {
        rastin: ["DigiRastinPlusLine", "system-ui", "-apple-system", "sans-serif"],
        sans: ["DigiRastinPlusLine", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2.5s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(14, 148, 110, 0.2)" },
          "100%": { boxShadow: "0 0 35px rgba(14, 148, 110, 0.6)" },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
