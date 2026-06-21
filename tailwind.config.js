/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-navy':       '#0B1829',
        'brand-teal':       '#0E6D6D',
        'brand-teal-light': '#14A8A8',
        'brand-gold':       '#C9A84C',
        'brand-cream':      '#FAF8F5',
        'brand-slate':      '#4A5568',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 4px 24px rgba(11, 24, 41, 0.08)',
        'luxury-lg': '0 8px 40px rgba(11, 24, 41, 0.12)',
      },
    },
  },
  plugins: [],
}
