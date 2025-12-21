/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./index.tsx",
    "./App.tsx",
  ],
  darkMode: 'class', // Activation manuelle via classe 'dark'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'neo-white': '#FAFAFA',
        'neo-black': '#050505',
        'neo-violet': '#d8b4fe',
        'neo-orange': '#fdba74',
        'neo-blue': '#93c5fd',
        'neo-green': '#86efac',
        'neo-red': '#fca5a5',
        'neo-yellow': '#fde047',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo-white': '4px 4px 0px 0px #e5e7eb', // Ombres plus douces en mode sombre
        'neo-white-sm': '2px 2px 0px 0px #e5e7eb',
      }
    }
  },
  plugins: [],
}

