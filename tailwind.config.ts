import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        cream: "#FAF6F1",
        charcoal: "#211F1D",
        clay: {
          DEFAULT: "#C17A56",
          50: "#FBF3EE",
          100: "#F5E4D8",
          200: "#EAC6AE",
          300: "#DFA884",
          400: "#D48F6C",
          500: "#C17A56",
          600: "#A5623F",
          700: "#824C31",
          800: "#5F3823",
          900: "#3D2416",
        },
        sage: {
          DEFAULT: "#8B9D83",
          50: "#F3F5F2",
          100: "#E4E9E1",
          200: "#CBD5C6",
          300: "#B1C1AA",
          400: "#9DAF94",
          500: "#8B9D83",
          600: "#6F8265",
          700: "#566650",
          800: "#3F4A3A",
          900: "#282E25",
        },
        border: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(33,31,29,0.08)",
        soft: "0 2px 12px rgba(33,31,29,0.06)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
