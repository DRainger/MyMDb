/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B0C10',    // very dark gray/black
        secondary: '#1F2833',  // dark blue-gray
        text: '#C5C6C7',       // light gray
        accent: '#66FCF1',     // bright turquoise/cyan
        accentDark: '#45A29E', // teal/darker turquoise
      },
      fontFamily: {
        sans: ['Assistant', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

