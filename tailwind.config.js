/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Julius Sans One', 'sans-serif'],
        display: ['Krona One', 'sans-serif'],
      },
    },
  },
  plugins: [],
};