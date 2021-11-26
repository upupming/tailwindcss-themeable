import createPlugin from 'windicss/plugin'
import converter from 'color-convert'
import { ThemeType } from 'windicss/types/interfaces'

/**
 * https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20
 * https://spec.draculatheme.com/#sec-Standard
 */
export const builtinPaletteKeys = ['background', 'foreground', 'selection',
  'comment', 'cyan', 'green', 'orange',
  'pink', 'purple', 'red', 'yellow'] as const
export type PaletteKeys = typeof builtinPaletteKeys[number]

/** The smaller the stop, the lighter the generated color */
export const shadeStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

export type DEFAULT = 'DEFAULT'
export type ShadeStops = typeof shadeStops[number]
export type ColorShadeKeys = DEFAULT | ShadeStops

export type ColorHex =`#${string}`
export type ColorShades = {
  [stop in ShadeStops]?: ColorHex
} & {
  [key in DEFAULT]: ColorHex
}

/**
 * When all shades are already computed, type `ColorShades` will becomes `ColorShadesComputed`
 */
export type ColorShadesComputed = {
  [key in ColorShadeKeys]: ColorHex
}

export type ThemePalette = {
  /** If the user only define one hex, then the hex will be used as `500` and `DEFAULT` shade, all other shades will be automatically calculated correspondingly */
  [key in PaletteKeys]?: ColorHex | ColorShades
} & {
  /** User can define extra palette keys */
  [key: string]: ColorHex | ColorShades
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

/**
 * Fill a `ColorShades` with auto-generated shade values and return a `ColorShadesComputed`
 */
export const fillColorShades = (shades: ColorShades, shadeLightenStep = 8, shadeDarkenStep = 11) => {
  const { DEFAULT } = shades
  const [h, s, l] = converter.hex.hsl.raw(DEFAULT)
  const defaultStop = 500
  shadeStops.forEach((stop) => {
    // if user already defined this shade, don't fill with auto generated value
    if (shades[stop] !== undefined) return

    const diff = (stop - defaultStop) / 100
    let hex: string
    if (diff < 0) {
      hex = (converter.hsl.hex([h, s, clamp(l + Math.abs(diff) * shadeLightenStep)]))
    } else {
      hex = '#' + (converter.hsl.hex([h, s, clamp(l - Math.abs(diff) * shadeDarkenStep)]))
    }
    shades[stop] = `#${hex}`
  })

  return shades as ColorShadesComputed
}

const withOpacity = (variableName: string) => {
  return ({ opacityValue = 1 }) => {
    return `rgba(var(${variableName}), ${opacityValue})`
  }
}

export const paletteKeyShade2CSSVariable = (classPrefix: string, paletteKey: string, shade: string | number) => `--${classPrefix}-${paletteKey}${shade === 'DEFAULT' ? '' : `-${shade}`}`

export const themeable = createPlugin.withOptions<ThemeableOptions>(({
  themes = [],
  shadeLightenStep = 8,
  shadeDarkenStep = 11,
  classPrefix = 'themeable',
  defaultTheme = 'dracula'
}) => ({ addBase }) => {
  themes = [...builtinThemes, ...themes]
  themes.forEach(theme => {
    for (const paletteKey in theme.palette) {
      const color = theme.palette[paletteKey]
      let colorShades: ColorShades
      if (typeof color === 'string') {
        colorShades = { DEFAULT: color }
      } else {
        colorShades = color
      }
      const colorShadesComputed = fillColorShades(colorShades, shadeLightenStep, shadeDarkenStep)
      let shade: keyof ColorShades
      for (shade in colorShadesComputed) {
        const key = paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade)
        const value = converter.hex.rgb.raw(colorShadesComputed[shade]).join(', ')
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
}, ({ classPrefix = 'themeable', themes = [] }) => {
  themes = [...builtinThemes, ...themes]

  const colors: ThemeType = {}

  const paletteKeysSeen = new Set<string>()
  themes.forEach(theme => {
    for (const paletteKey in theme.palette) {
      paletteKeysSeen.add(paletteKey)
    }
  })

  for (const paletteKey of paletteKeysSeen) {
    const paletteInstance: any = {}
    for (const stop of shadeStops) {
      paletteInstance[stop] = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, stop))
    }
    paletteInstance.DEFAULT = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, 'DEFAULT'))
    colors[`${classPrefix}-${paletteKey}`] = paletteInstance

    // Don't force user-defined themes to have the same palette keys as dracula
    // @ts-expect-error
    if (builtinPaletteKeys.includes(paletteKey)) continue
    for (const theme of themes) {
      // built-in theme does not need to follow the user-defined palette keys
      if (builtinThemes.includes(theme)) continue
      if (theme.palette[paletteKey] === undefined) {
        console.warn(`[tailwindcss-themeable]: theme ${theme.name} missing the palette ${paletteKey}, please add the palette key to theme or delete the palette key from other themes to avoid inconsistent`)
      }
    }
  }

  return {
    theme: {
      extend: {
        colors
      }
    }
  }
})
