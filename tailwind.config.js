/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm amber/terracotta - Primary brand color (replaces yelp red)
        bakery: {
          50: '#fef7f0',
          100: '#feecdc',
          200: '#fcd6b8',
          300: '#f9b98a',
          400: '#f59352',
          500: '#f27523',  // Primary - warm orange/amber
          600: '#e35a12',
          700: '#bc4411',
          800: '#963716',
          900: '#793015',
        },
        // Cream/warm white - Backgrounds
        cream: {
          50: '#fefdfb',
          100: '#fdfaf5',
          200: '#faf5eb',
          300: '#f5edd9',
          400: '#ede0c4',
          500: '#e2cfab',
        },
        // Warm stone - Text colors
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Sage/teal - Secondary accent (from storefront)
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c8',
          300: '#a3b2a5',
          400: '#7a8f7d',
          500: '#5a7260',  // Muted sage green
          600: '#475a4c',
          700: '#3a493e',
          800: '#303c33',
          900: '#29332b',
        },
        // Soft blue glow - Accent (from location pin)
        glow: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dfff',
          300: '#7cc5ff',
          400: '#36a9ff',
          500: '#0c8cef',  // Soft blue
          600: '#006dcc',
          700: '#0057a6',
          800: '#034a88',
          900: '#093e70',
        },
        // Keep bread colors for gradients
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
        },
        // Legacy yelp colors (for gradual migration)
        yelp: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa3a3',
          400: '#ff6b6b',
          500: '#FF1A1A',
          600: '#D10000',
          700: '#b80000',
          800: '#990000',
          900: '#800000',
        },
      },
      backgroundImage: {
        'hero-bakery': "url('https://i.imgur.com/kUTWEGo.jpeg')",
      },
    },
  },
  plugins: [],
}
