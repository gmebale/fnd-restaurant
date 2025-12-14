/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fc0000',
        secondary: '#ff6b35',
        accent: '#FFB703',
        'bg-main': '#FFF8E7',
        'muted-700': '#6b7280'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'soft-lg': '0 12px 30px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        'xl-2': '1rem'
      }
    }
  },
  plugins: []
}
