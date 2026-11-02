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
        vermilion: {
          DEFAULT: '#ff3e18',
          50: '#fff1ee',
          100: '#ffe1db',
          500: '#ff3e18',
          600: '#e52c07',
          700: '#b81f03',
        },
        wabi: {
          50: '#fdfbf7',
          100: '#f7f2e7',
          200: '#efe6d3',
          DEFAULT: '#faf6ee',
        },
        sumi: {
          DEFAULT: '#141518',
          900: '#101113',
          800: '#1b1d22',
          700: '#262930',
        },
        matcha: {
          DEFAULT: '#2d5339',
          50: '#f2f7f3',
          100: '#e1ede4',
          500: '#2d5339',
          700: '#1c3826',
        },
        cobalt: {
          DEFAULT: '#173664',
          900: '#0f2444',
          100: '#e6eef9',
        },
        ochre: {
          DEFAULT: '#cf9866',
          50: '#faf3ec',
          100: '#f4e5d6',
        },
      },
      fontFamily: {
        ananda: [
          '"Ananda Namaste"',
          '"Neptouch 3"',
          '"Neptouch"',
          '"Yatra One"',
          '"Rozha One"',
          'serif',
        ],
        display: [
          '"Ananda Namaste"',
          '"Neptouch 3"',
          '"Neptouch"',
          '"Yatra One"',
          '"Cabinet Grotesk"',
          'serif',
        ],
        kaluk: [
          '"Ananda Namaste"',
          '"Neptouch 3"',
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        sans: [
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          '"Space Mono"',
          'ui-monospace',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        riso: '4px 4px 0px 0px #141518',
        'riso-sm': '2px 2px 0px 0px #141518',
        'riso-red': '4px 4px 0px 0px #ff3e18',
      },
    },
  },
  plugins: [],
};


