/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B1B1B",
        secondary: "#FFD15B",
        tertiary: "#7A7A7A",
        quaternary: "#EDEDED",
      },
      boxShadow: {
        card: "0 4px 34px 30px rgba(0, 0, 0, 0.04)",
      },
    },
    fontFamily: {
      anton: ['"Anton"', "sans-serif"],
      manrope: ['"Manrope"', "sans-serif"],
    },
  },
  plugins: [],
};
