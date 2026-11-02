/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f4',
          100: '#e1efe5',
          500: '#2d6a4f',
          700: '#1b4332',
          900: '#081c15',
        },
        earth: {
          50: '#faf7f2',
          100: '#f3ece2',
          500: '#b08968',
          800: '#6f4e37',
        }
      },
    },
  },
  plugins: [],
};
