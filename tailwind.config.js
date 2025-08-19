const { url } = require('inspector');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // or 'class' if you prefer
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgdark : "#050505",
        themeblue: '#13A6D4',
        green: '#17C047',
        subheading: '#DFDFDF',
        black: '#000000',
        primaryGrey: '#A4A4A4',
        grey: '#C3C3C3',
        maingrey: '#828282',
        head:'#191818',
        // You can add more custom colors here if you want
      },
         backgroundImage: {
        // gradient: 'linear-gradient(90deg, #13A6D4 0%, #17C047 100%)',
        openbtn: 'linear-gradient(90deg, #090909 0%, #17C047 49%, #090909 100%)',
        unmatchedbtn: 'linear-gradient(90deg, #090909 0%, #13A6D4 49%, #090909 100%)',
        commonbg: "url('/images/commonbg.png')",
        gradient: 'linear-gradient(to right, #13A6D4, #17C047)' 
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        gambetta: ['Gambetta', 'serif'],
      },
      animation: {
        loader: 'animFw 10s linear infinite',
      },
      keyframes: {
        animFw: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
    },
     
    },
  },
  plugins: [
     require('@tailwindcss/line-clamp'),
  ],
}
