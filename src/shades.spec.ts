import { color2Shades } from './shades'
import { themeDracula, themeMaterial } from '.'

describe('shades', () => {
  it('should generate shades from color correctly', () => {
    for (const [name, color] of Object.entries(themeDracula.palette)) {
      expect(color2Shades(color, undefined, undefined, themeDracula.isDark)).toMatchSnapshot(`dracula ${name}`)
    }
    for (const [name, color] of Object.entries(themeMaterial.palette)) {
      expect(color2Shades(color, undefined, undefined, themeMaterial.isDark)).toMatchSnapshot(`material ${name}`)
    }
  })
})
