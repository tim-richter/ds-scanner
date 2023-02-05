/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['ui/index.html', 'ui/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7f5af0',
        'primary-100': '#B9A4F7',
        secondary: '#2cb67d',
        background: '#16161a',
      },
      backgroundImage: {
        backgroundBlur: "url('/background.png')",
      },
      borderWidth: {
        1: '1px',
      },
    },
  },
  plugins: [],
};
