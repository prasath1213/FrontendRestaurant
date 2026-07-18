/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f6f4",
          100: "#ece9e4",
          200: "#d8d2c7",
          400: "#8a8174",
          600: "#534b40",
          800: "#2c2620",
          900: "#1c1712",
        },
        chili: {
          50: "#fdf2f1",
          100: "#fbe2df",
          300: "#ed968a",
          500: "#d6432f",
          600: "#b6341f",
          700: "#92281a",
        },
        turmeric: {
          100: "#fbeec7",
          300: "#f0cd6c",
          500: "#dba421",
          600: "#b9851a",
        },
        basil: {
          100: "#e4f0e1",
          400: "#7bab6e",
          500: "#4f8a43",
          600: "#3c6d33",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px -2px rgba(28,23,18,0.08), 0 1px 2px rgba(28,23,18,0.06)",
        lift: "0 8px 24px -4px rgba(28,23,18,0.15)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
}

