import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#007A55",
          greenDim: "#005c3f",
          bg: "#F5F6F5",
          surface: "#FFFFFF",
          border: "#DDE3E0",
          muted: "#B0BCB7",
          text: "#1A2420",
          textDim: "#5A7068",
        },
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse_soft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease forwards",
        pulse_soft: "pulse_soft 1.5s ease-in-out infinite",
        scan: "scan 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
