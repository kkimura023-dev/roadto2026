/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"Noto Sans JP"', 'sans-serif'],
      }
    }
  },
  plugins: []
};
