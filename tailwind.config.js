/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './aComponents/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'Lato-Regular': 'Lato-Regular',
        'Lato-bold': 'Lato-bold',
      },
      backgroundColor: {
        primary: '#228B22',
        'primary-15': 'rgba(34,139,34,0.15)',
        'primary-20': 'rgba(24,139,34,0.20)',
        'primary-40': 'rgba(24,139,34,0.40)',
        'primary-10': 'rgba(24,139,34,0.10)',
        secondary: '#E9ECEF',
        tertiary: '#E03131',
        'tertiary-15': 'rgba(224,49,49,0.15)',
        'tertiary-20': 'rgba(224,49,49,0.20)',
        'tertiary-40': 'rgba(224,49,49,0.40)',
        quaternary: '#000000',
      },
      colors: {
        primary: '#228B22',
        'primary-15': 'rgba(34,139,34,0.15)',
        'primary-20': 'rgba(24,139,34,0.20)',
        secondary: '#E9ECEF',
        tertiary: '#E03131',
        'tertiary-15': 'rgba(224,49,49,0.15)',
        'tertiary-20': 'rgba(224,49,49,0.20)',
        quaternary: '#000000',
        unselected: '#A6A6A6',
      },
    },
  },
  plugins: [],
};
