/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        solway: ["solway", "sans-serif"],
      },
      backgroundImage: (theme) => ({
        "gradient-sunset": "linear-gradient(90deg, #F2C035 0%, #EE9551 100%)",
      }),
    },
    colors:{
      "primary-600": "#4C3F3F",
      "green-300": "#64A132",
    },
  },
  plugins: [],
}