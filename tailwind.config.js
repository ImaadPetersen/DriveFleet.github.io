import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00D4FF",
        dark: "#050816",
        card: "#111827",
        accent: "#7C3AED"
      }
    }
  },
  plugins: []
} satisfies Config;
