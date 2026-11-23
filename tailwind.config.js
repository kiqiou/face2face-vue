export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // tailwind.config.js → theme.extend
      colors: {
        paper: '#FCEFEA',
        cream: '#FFF7F5',   // розоватый белый
        peach: '#F8DCCF',
        line: '#F0D5C8',
        caramel: {
          DEFAULT: '#C98B5E',    // как «10%» и лента
          dark: '#B06F43',
        },
        ink: { DEFAULT: '#4A3B30', muted: '#8A7364' },
        line: '#EBCFB5',
        clay: '#B5533C',         // предупреждения / «нет в наличии»
      },
      fontFamily: {
        body: ['Montserrat', 'Inter', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'], // на баннере один гротеск без засечек
      },
    },
  },
  plugins: [],
};
