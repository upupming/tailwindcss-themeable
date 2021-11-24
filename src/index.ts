import createPlugin from 'windicss/plugin'
import converter from 'color-convert'
import { ThemeType } from 'windicss/types/interfaces'

/**
 * https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20
 * https://spec.draculatheme.com/#sec-Standard
 */
export type PaletteKeys =
 'background' | 'foreground' | 'selection' |
 'comment' | 'cyan' | 'green' | 'orange' |
 'pink' | 'purple' | 'red' | 'yellow'

export type ColorHex =`#${string}`
export interface ColorShades {
  '50': ColorHex
  '100': ColorHex
  '200': ColorHex
  '300': ColorHex
  '400': ColorHex
  '500': ColorHex
  '600': ColorHex
  '700': ColorHex
  '800': ColorHex
  '900': ColorHex
  DEFAULT: ColorHex
}
// The smaller the stop, the lighter the generated color
export const shadeStops = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export type ThemePalette = {
  /** If the user only define one hex, then the hex will be used as `500` and `DEFAULT` shade, all other shades will be automatically calculated correspondingly */
  [key in PaletteKeys]: ColorHex | ColorShades
}
export interface Theme {
  name: string
  palette: ThemePalette
}

export interface ThemeableOptions {
  /**
   * Support a list of theme definitions, the user should define the colors of the theme follow the contribute of Dracula theme.
   * See https://draculatheme.com/contribute#color-palette
   * @default []
   */
  themes?: Theme[]
  /**
   * Prefix of the class to enable a theme, for example the container with class `${classPrefix}-dracula` will enable dracula theme in its children elements
   * @default `themeable`
   */
  classPrefix?: string
  /** The lighten step for auto generated shades smaller than the default `500` color
   * For example, if you passed `#50FA7B` as the `green` theme key, and `shadeLightenStep` is 8,
   * then we will use this color as the `DEFAULT` and shade `500` to generate all other shades of `green`,
   * for shade smaller than `500`, we will add the lightness up `shadeLightenStep` in per 100 gap.
   * Color `#50FA7B` converted to HSL is [135, 94, 64], so the shade `400` will be computed to [135, 94, 72]
   * @default 8
   */
  shadeLightenStep?: number
  /** Similar with `shadeLightenStep` but for shades larger than `500`
   * @default 11
   */
  shadeDarkenStep?: number
  /** When not specify any theme in HTML, the `defaultTheme` will be used
   * @default `dracula`
   */
  defaultTheme?: string
}

/**
 * The dracula theme, see https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20 and
 * https://draculatheme.com/contribute#color-palette
 */
export const themeDracula: Theme = {
  name: 'dracula',
  palette: {
    background: '#282A36',
    foreground: '#F8F8F2',
    selection: '#44475A',
    comment: '#6272A4',
    cyan: '#8BE9FD',
    green: '#50FA7B',
    orange: '#FFB86C',
    pink: '#FF79C6',
    purple: '#BD93F9',
    red: '#FF5555',
    yellow: '#F1FA8C'
  }
}
export const themeMaterial: Theme = {
  name: 'material',
  palette: {
    background: '#FFFFFF',
    foreground: '#000000',
    selection: '#8796B0',
    comment: '#6182B8',
    cyan: '#39ADB5',
    green: '#91B859',
    orange: '#F76D47',
    pink: '#FF5370',
    purple: '#9C3EDA',
    red: '#E53935',
    yellow: '#E2931D'
  }
}

export const builtinThemes = [themeDracula, themeMaterial] as const

export const clamp = (val: number, min: number = 0, max: number = 100) => {
  return Math.min(Math.max(val, min), max)
}

export const color2Shades = (hex: ColorHex, shadeLightenStep = 8, shadeDarkenStep = 11) => {
  const [h, s, l] = converter.hex.hsl.raw(hex)
  const defaultStop = 5
  const generatedHexColors: ColorHex[] = shadeStops.map((stop) => {
    const diff = (stop - defaultStop)
    if (diff < 0) {
      return (converter.hsl.hex([h, s, clamp(l + Math.abs(diff) * shadeLightenStep)]))
    } else {
      return (converter.hsl.hex([h, s, clamp(l - Math.abs(diff) * shadeDarkenStep)]))
    }
  }).map<ColorHex>(hex => `#${hex}`)

  const ans: any = {
    DEFAULT: hex
  }
  shadeStops.forEach((stop, idx) => {
    ans[stop * 100] = generatedHexColors[idx]
  })
  return ans as ColorShades
}

const withOpacity = (variableName: string) => {
  return ({ opacityValue = 1 }) => {
    return `rgba(var(${variableName}), ${opacityValue})`
  }
}

export const paletteKeyShade2CSSVariable = (classPrefix: string, paletteKey: PaletteKeys, shade: string | number) => `--${classPrefix}-${paletteKey}${shade === 'DEFAULT' ? '' : `-${shade}`}`

export const themeable = createPlugin.withOptions<ThemeableOptions>(({
  themes = [],
  shadeLightenStep = 8,
  shadeDarkenStep = 11,
  classPrefix = 'themeable',
  defaultTheme = 'dracula'
}) => ({ addBase }) => {
  themes = [...builtinThemes, ...themes]
  themes.forEach(theme => {
    let paletteKey: PaletteKeys
    for (paletteKey in theme.palette) {
      const color = theme.palette[paletteKey]
      let colorShades: ColorShades
      if (typeof color === 'string') {
        colorShades = color2Shades(color, shadeLightenStep, shadeDarkenStep)
      } else {
        colorShades = color
      }
      for (const shade in colorShades) {
        const key = paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade)
        const value = converter.hex.rgb.raw(colorShades[shade as keyof ColorShades]).join(', ')
        const rawRgbStyle = {
          [`.${classPrefix}-${theme.name}`]: {
            // --themeable-green-500: 'xxx'
            [key]: value
          },
          ...defaultTheme === theme.name
            ? {
                ':root': {
                  [key]: value
                }
              }
            : {}
        }
        addBase(rawRgbStyle)
      }
    }
  })
}, ({ classPrefix = 'themeable' }) => {
  const { palette } = themeDracula
  const colors: ThemeType = {}

  let paletteKey: PaletteKeys
  for (paletteKey in palette) {
    const paletteInstance: any = {}
    for (const stop of shadeStops) {
      const shade = stop * 100
      paletteInstance[shade] = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade))
    }
    paletteInstance.DEFAULT = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, 'DEFAULT'))
    colors[`${classPrefix}-${paletteKey}`] = paletteInstance
  }

  return ({
    theme: {
      extend: {
        colors
      }
    }
  })
})
