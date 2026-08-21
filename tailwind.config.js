/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { 
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Clash Display', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff', 100: '#e0e8ff', 200: '#c7d4fd', 300: '#a4b5fb',
          400: '#7c8ef8', 500: '#5b68f3', 600: '#4347e8', 700: '#3735d0',
          800: '#2e2da8', 900: '#292a85', 950: '#1a1b52',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow: { '0%': { boxShadow: '0 0 20px rgba(91,104,243,0.4)' }, '100%': { boxShadow: '0 0 40px rgba(91,104,243,0.8)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(91,104,243,0.3)',
        'glow-lg': '0 0 60px rgba(91,104,243,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
