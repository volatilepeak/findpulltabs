/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF8F0',
          100: '#F5EDD9',
          200: '#EBDBB3',
          300: '#D4C5A3',
          400: '#C4AD7C',
          500: '#B49A5E',
          600: '#9A7F45',
          700: '#7A6437',
          800: '#5C4B2A',
          900: '#3D321C',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B0B0B0',
          400: '#8A8A8A',
          500: '#5A5A5A',
          600: '#4A4A4A',
          700: '#3A3A3A',
          800: '#2A2A2A',
          900: '#1A1A1A',
          950: '#111111',
        },
        cream: {
          50: '#FEFDFB',
          100: '#FCF9F3',
          200: '#F8F5EF',
          300: '#F0EBE0',
          400: '#E5DDD0',
          500: '#D6CCBA',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 197, 163, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(212, 197, 163, 0)' },
        },
      },
    },
  },
  plugins: [],
};
