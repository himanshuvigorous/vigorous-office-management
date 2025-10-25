/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1441px',
        'mdlg':'991px'
      },
      // fontFamily: {
      //   lexend: ['Lexend Deca', 'sans-serif'],
      //   roboto: ['Roboto', 'sans-serif'], 
      //   inter: ['Inter', 'sans-serif'],  
      // },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 5s linear infinite',
        slideInFromTop: 'slideInFromTop 0.5s ease-out forwards',
      },
      colors: {
        'header': '#005a63',
        'header-light': '#021B2D',    
        'header-middle': '#2A2D34',   
        'header-semibold': '#D1D5DB',  
        'accent': '#FF5C8D',       
        'neutral': '#F5F5F5',      
        'dark-text': '#2C3E50',    
      },
      lineHeight: {
        'extra-loose': '2.5rem',  
        'loose': '1.75rem',
      },
    },
  },
  plugins: [],
}
