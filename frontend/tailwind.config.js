/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1330',
          900: '#0E1A3D',
          800: '#132352',
        },
        brand: {
          teal: '#14B8A6',
          tealDark: '#0D9488',
        },
      },
    },
  },
  plugins: [],
}
