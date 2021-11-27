import { color2Shades } from './shades'
import { themeDracula } from '.'

describe('shades', () => {
  it('should generate shades from color correctly', () => {
    for (const color of Object.values(themeDracula.palette)) {
      expect(color2Shades(color)).toMatchSnapshot()
    }
  })
})
