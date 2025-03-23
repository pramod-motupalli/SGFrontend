/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        '4k': '2560px', // Custom breakpoint for 4K resolution
      },
    },
  },
  variants: {},
  plugins: [],
};
