/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff5b5a",
        surface: "#FAF1E9",
        surfaceVariant: "#fed9d0",
      },
    },
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
    },
  },
  safelist: ["cursor-grab", "bg-opacity-100", "h-0"],
  plugins: [],
};
