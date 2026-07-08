/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        surface: '#f7f9fb',
        'surface-elevated': '#ffffff',
        'surface-container': '#eceef0',
        'surface-container-low': '#f2f4f6',
        'surface-container-high': '#e6e8ea',
        'border-subtle': '#E2E8F0',
        primary: '#000000',
        'primary-container': '#131b2e',
        secondary: '#0058be',
        'secondary-container': '#2170e4',
        tertiary: '#10b981',
        'on-surface': '#191c1e',
        'on-surface-variant': '#45464d',
        'on-primary': '#ffffff',
        'on-primary-container': '#7c839b',
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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      spacing: {
        'section-gap': '120px',
        'section-gap-mobile': '64px',
        gutter: '24px',
        'container-max': '1280px',
      },
    },
  },
  plugins: [],
}
