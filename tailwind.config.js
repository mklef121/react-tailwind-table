module.exports = {
  purge: [],
  purge: {
    enabled: true,
    content: [
      './src/**/*.html',
      './src/**/*.vue',
      './src/**/*.jsx',
      './src/**/*.tsx',
      './example/src/**/*.js',
      './example/src/**/*.tsx'
    ]
  },
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
