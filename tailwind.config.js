/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FAF7F0',
          100: '#F5F0E8',
          200: '#E8DDD0',
          300: '#D4C4B0',
          400: '#B8A082',
          500: '#8B6F47',
          600: '#6F4E37',
          700: '#5A3E2B',
          800: '#4A3424',
          900: '#3D2B1F',
        },
        cream: {
          25: '#FEFEFE',
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#F9F1E6',
          300: '#F5F5DC',
          400: '#F0E8D0',
          500: '#E8DCC0',
          600: '#D4C4A0',
          700: '#B8A080',
          800: '#9C8060',
          900: '#806040',
        },
        earth: {
          50: '#FDF6F0',
          100: '#F9E8D8',
          200: '#F2D0B0',
          300: '#E8B088',
          400: '#D89060',
          500: '#C87040',
          600: '#A52A2A',
          700: '#8B2323',
          800: '#701C1C',
          900: '#5A1616',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        float: 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
