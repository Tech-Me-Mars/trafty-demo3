/** @type {import('tailwindcss').Config} */
export default {
  
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ['Sarabun', 'sans-serif'], // เพิ่มฟอนต์ Sarabun
      },
      colors: {
        primary: {
          main: '#ff4b3a', // ชื่อหลัก primary
        },
        secondary: {
          main: '#fffc34', // ชื่อหลัก primary
        },
      },
    },
  },
  plugins: [require('tailwindcss-primeui')]
}

