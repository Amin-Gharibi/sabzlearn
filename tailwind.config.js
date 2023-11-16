/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./public/*.html"],
  theme: {
    extend: {
      fontFamily: {
        'danaRegular': 'Dana-Regular',
        'danaMedium': 'Dana-Medium',
        'danaDemiBold': 'Dana-DemiBold',

        'morabbaLight': 'Morabba-Light',
        'morabbaMedium': 'Morabba-Medium',
        'morabbaBold': 'Morabba-Bold'
      }
    },
  },
  plugins: [],
}

