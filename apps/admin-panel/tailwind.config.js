/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/admin-panel/src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Gold Palette
        primary: {
          DEFAULT: '#D4AF37', // Metallic Gold
          50: '#F9F5E6',
          100: '#F2EBC6',
          200: '#E6D68F',
          300: '#D9C25E',
          400: '#D4AF37',
          500: '#B5922B',
          600: '#8F701E',
          700: '#6B5216',
          800: '#4A3810',
          900: '#2B2009',
        },
        // Deep Black & Gray Palette
        surface: {
          DEFAULT: '#1A1A1A', // Dark Gray Surface
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
          950: '#0D0D0D', // Deep Black
        },
        // Semantic Colors
        success: '#10B981', // Emerald
        warning: '#F59E0B', // Amber
        error: '#EF4444',   // Red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'], // For Headings
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F2EBC6 50%, #B5922B 100%)',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
