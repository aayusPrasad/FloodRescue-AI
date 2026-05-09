/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: '#DFF7EF',
          teal: '#1D9A8D',
          sky: '#DBF2FF',
          ocean: '#0E7490',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 118, 110, 0.12)',
      },
      backgroundImage: {
        hero: 'linear-gradient(120deg, #e8fff5 0%, #e8f8ff 100%)',
      },
    },
  },
  plugins: [],
}