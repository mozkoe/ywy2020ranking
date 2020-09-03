module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '960px',
      'xl': '1280px',
    },
  },
  purge: [
    './pages/**/*.vue',
    './components/**/*.vue',
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
}
