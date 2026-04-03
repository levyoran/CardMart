/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1a2744',
          800: '#243460',
          700: '#2f457a',
          600: '#3a5490',
        },
        orange: {
          500: '#f5a623',
          600: '#e0921a',
        },
      },
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '18px',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(26,39,68,0.13)',
      },
    },
  },
  plugins: [],
}
