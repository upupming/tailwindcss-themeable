const { themeable } = require('tailwindcss-themeable')

// tailwind.config.js
module.exports = {
  purge: ['./index.html', './**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      // ...
      borderWidth: ['hover', 'focus']
    }
  },
  plugins: [
    themeable()
  ]
}
