/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFD1DC',
        'pastel-blue': '#BFEFFF',
        'pastel-lilac': '#E6E6FA',
        'pastel-mint': '#C7FFDA',
        'pastel-yellow': '#FFFACD',
        'kawaii-pink': '#FF9EB5',
        'kawaii-blue': '#99CCFF',
        'kawaii-purple': '#D8B5FF',
      },
      fontFamily: {
        'kawaii': ['Comic Sans MS', 'Comic Sans', 'cursive'],
        'rounded': ['Varela Round', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'kawaii': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'kawaii-hover': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}