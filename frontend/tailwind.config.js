/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.{html,js}", "./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#2ED573',
        'secondary': '#4E81F5',
        'secondary-light': '#0EA5E9',
        'darkGray': '#1C1C28',
        'darkGray-500': '#94A3B8',
        'darkGray-800': '#28293D',
        'darkGray-700': '#32334D',
        'darkGray-600': '#777C94',
        'darkSlate': '#4A4B6D',
      },
      fontFamily: {
        'danaRegular': 'Dana-Regular',
        'danaMedium': 'Dana-Medium',
        'danaDemiBold': 'Dana-DemiBold',

        'morabbaLight': 'Morabba-Light',
        'morabbaMedium': 'Morabba-Medium',
        'morabbaBold': 'Morabba-Bold'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '0.625rem'
        }
      },
      screens: {
        'xs': "470px",
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      boxShadow: {
        'light': 'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 60px 0px'
      }
    },
  },
  plugins: [],
}

