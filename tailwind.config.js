module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
      backgroundColor: theme => ({
          ...theme('colors'),
          'hover-active': '#F3EAE8',
          'table-col': '#FBFBFB'
      }),
      textColor: theme => ({
          ...theme('colors'),
      }),
      extend: {
          colors: {
              'brand-color': 'var(--brand-color)',
              'brand-soft-color': 'var(--brand-soft-color)',
              'brand-table-color': '#FEFBF9',
              'soft-white': '#fdfdfd',
              'black-1': '#262626',
              'black-2': '#313131',
              'black-3': '#2a2a2b',
          }
      }
  },
  variants: {
      extend: {
          // opacity: ['disabled'], 
      }

  },
  plugins: [],
}