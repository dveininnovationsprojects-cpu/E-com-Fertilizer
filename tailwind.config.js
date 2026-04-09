/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e6a22",
        "primary-dark": "#1b5e20",
      },
    },
  },
  plugins: [],
};