/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D1117',
        accent: '#64FFDA',
        'accent-dark': '#4ECDC4',
        'glass-bg': 'rgba(255, 255, 255, 0.12)',
        'glass-border': 'rgba(255, 255, 255, 0.2)'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif']
      },
      fontSize: {
        'base': '17px'
      },
      backdropBlur: {
        'xs': '2px'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      gridTemplateColumns: {
        'timeline': '1fr 40px 1fr'
      }
    },
  },
  plugins: [],
}
