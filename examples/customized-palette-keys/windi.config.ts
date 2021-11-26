import { defineConfig } from 'windicss/helpers'
import { themeable } from 'tailwindcss-themeable'

export default defineConfig({
  plugins: [
    themeable({
      themes: [
        {
          name: 'theme1',
          palette: {
            primary: '#42a5f5'
          }
        },
        {
          name: 'theme2',
          palette: {
            primary: '#fcba03'
          }
        },
        {
          name: 'theme3',
          palette: {
            // missing the `primary` key, will got a build warning
          }
        }
      ]
    })
  ]
})
