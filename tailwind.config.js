module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [
    './pages/**/*.vue',
    './components/**/*.vue',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '960px',
      'xl': '1280px',
    },
  },
}
