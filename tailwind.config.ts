import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#E8B800",
        "accent-hover": "#FFD000",
        dark: {
          900: "#0A0A0A",
          800: "#141414",
          700: "#1E1E1E",
          600: "#2A2A2A",
          500: "#3A3A3A",
        },
      },
      fontFamily: {
        logo: ["var(--font-outfit)", "sans-serif"],
        heading: ["var(--font-noto-sans-tc)", "sans-serif"],
        body: ["var(--font-noto-sans-tc)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
