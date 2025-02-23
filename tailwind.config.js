/** @type {import('tailwindcss').Config} */
export default {
  
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
      colors: {
        primary: {
          main: '#ffc83A', // ชื่อหลัก primary
          // dark: '#ffc83A',    // เฉดมืด (กำหนดเพิ่มตามต้องการ)
          // light: '#ffc83A',   // เฉดสว่าง (กำหนดเพิ่มตามต้องการ)
        },
      },
    },
  },
  plugins: [require('tailwindcss-primeui')]
}

