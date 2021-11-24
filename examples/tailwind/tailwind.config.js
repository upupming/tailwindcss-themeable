const { themeable } = require('tailwindcss-themeable')

// tailwind.config.js
module.exports = {
  purge: {
    content: ['./index.html', './**/*.{vue,js,ts,jsx,tsx}'],
    safelist: [
      'themeable-material',
      'themeable-dracula'
    ]
  },
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
