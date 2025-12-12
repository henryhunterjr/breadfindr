/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bread: {
          50: '#fdf8f3',
          100: '#f9edd9',
          200: '#f2d7b0',
          300: '#e9bc7d',
          400: '#df9c4a',
          500: '#d68529',
          600: '#c66d1f',
          700: '#a5531c',
          800: '#85431e',
          900: '#6d381b',
        }
      }
    },
  },
  plugins: [],
}
