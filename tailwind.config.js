/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./QuickgageLanding.jsx"
  ],
  theme: {
    extend: {
      colors: {
        'space-navy': '#0a0a0f',
        'deep-burgundy': '#8B1538',
        'burnt-sienna': '#E07A5F',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false,
    base: false,
  },
}
