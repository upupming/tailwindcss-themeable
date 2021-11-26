import { defineConfig } from 'windicss/helpers'
import { themeable } from 'tailwindcss-themeable'

export default defineConfig({
  plugins: [
    themeable({
      themes: [
        {
          name: 'override',
          palette: {
            background: '#282A36',
            foreground: '#F8F8F2',
            selection: '#44475A',
            comment: {
              DEFAULT: '#6272A4',
              200: '#FF0000'
            },
            cyan: '#8BE9FD',
            green: '#50FA7B',
            orange: '#FFB86C',
            pink: '#FF79C6',
            purple: '#BD93F9',
            red: '#FF5555',
            yellow: '#F1FA8C'
          }
        }
      ]
    })
  ]
})
