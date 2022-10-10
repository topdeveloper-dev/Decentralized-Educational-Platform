/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")


module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "xs": "475px",
      ...defaultTheme.screens
    },
    extend: {
      maxWidth: {
        "8xl": "1920px"
      },
      flex: {
        "2": "2 2 0%",
        "3": "3 3 0%",
        "4": "4 4 0%"
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [],
}
