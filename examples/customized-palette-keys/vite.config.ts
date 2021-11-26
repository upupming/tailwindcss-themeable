import WindiCSS from 'vite-plugin-windicss'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    WindiCSS()
  ],
  base: '/tailwindcss-themeable/customized-palette-keys/'
})
