/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        cyan: {
          400: "#00FFA3",
        },
        purple: {
          400: "#DC1FFF",
          600: "#8B5CF6",
          700: "#7C3AED",
        },
      },
    },
  },
  plugins: [],
};
