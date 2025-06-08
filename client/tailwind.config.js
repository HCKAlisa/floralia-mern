const {heroui} = require("@heroui/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        solway: ["solway", "sans-serif"],
        kavoon: ["kavoon", "sans-serif"],
        jua: ["jua", "sans-serif"],
      },
      backgroundImage: (theme) => ({
        "gradient-sunset": "linear-gradient(90deg, #F2C035 0%, #EE9551 100%)",
        "gradient-pink-215": "linear-gradient(215deg, #FC8F92 0%, #FFFCED 100%)",
        "gradient-pink-310": "linear-gradient(310deg, #FC8F92 0%, #FFFCED 100%)",
        "gradient-green-180": "linear-gradient(180deg, #D1D161 0%, #FFFFFF 100%)",
        "gradient-yellow": "linear-gradient(140deg, #FFDD93 0%, #FFFCED 100%)",
      }),
    },
    colors:{
      "primary-600": "#4C3F3F",
      "green-300": "#64A132",
    },
  },
  darkMode: "class",
  plugins: [heroui({
    prefix: "heroui", // prefix for themes variables
    addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "floralia", // default theme from the themes object
    defaultExtendTheme: "floralia", // default theme to extend on custom themes
    layout: {},
    themes: {
      floralia: {
        colors: {
          background: "#FFFCED", // or DEFAULT
          foreground: "#884239", // or 50 to 900 DEFAULT
          primary: {
            foreground: "#FFFCED",
            background: "#FFFCED",
            DEFAULT: "#884239",
          },
          secondary: {
            background: "#FFDD93",
            foreground: "#D1D161",
            DEFAULT: "#D1D161",
          },
          tertiary: {
            foreground: "#FFDD93",
            background: "#FC8F92",
            DEFAULT: "#FC8F92",
          }
        },
      },
    },
  })],
}