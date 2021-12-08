import createPlugin from 'windicss/plugin'
import { colorOpacity, ThemeType } from 'windicss/types/interfaces'
import { color2Shades } from './shades'
import { hex2rgb } from './utils'

/**
 * https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20
 * https://spec.draculatheme.com/#sec-Standard
 */
export const builtinPaletteKeys = ['background', 'foreground', 'selection',
  'comment', 'cyan', 'green', 'orange',
  'pink', 'purple', 'red', 'yellow'] as const
export type PaletteKeys = typeof builtinPaletteKeys[number]

export const saturationFactorDefault = 1.771968374684816
export const lightFactorDefault = 7.3903743315508015

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
  /** Whether this theme is a dark theme or not,
   * if it is light theme, shades will get darker from 50 to 900, just like the tailwind official shades
   * if it is dark theme, shades will get lighter from 50 to 900
   * the reason why we reverse the shades for dark theme is that we want to keep contrast with background
   * for example, a light theme often has white background and black foreground, foreground-900 (the most dark black) will have the largest contrast with background-50 (the most light white)
   * when we switching to a dark theme which often has black background and white foreground, foreground-900 (the most light white) will still have the largest contrast with background-50 (the most dark black)
   * @default false
   */
  isDark?: boolean
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
  /** When not specify any theme in HTML, the `defaultTheme` will be used
   * @default `dracula`
   */
  defaultTheme?: string
  /**
   * This will allow you the change the difference in saturation between each shade of color. By default we use  1.771968374684816 because these are the averages that steps change in tailwind's default colors. Thanks to https://tw-shade-gen.netlify.app/
   */
  saturationFactor?: number
  /**
   * This will allow you the change the difference in lightness between each shade of color. By default we use 7.3903743315508015 because these are the averages that steps change in tailwind's default colors. Thanks to https://tw-shade-gen.netlify.app/
   */
  lightFactor?: number
}

/**
 * The dracula theme, see https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20 and
 * https://draculatheme.com/contribute#color-palette
 */
export const themeDracula = {
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
  },
  isDark: true
} as const
export const themeMaterial = {
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
  },
  isDark: false
} as const

export const builtinThemes: Theme[] = [themeDracula, themeMaterial]

/**
 * Fill a `ColorShades` with auto-generated shade values and return a `ColorShadesComputed`
 */
export const fillColorShades = (shades: ColorShades, saturationFactor?: number,
  lightFactor?: number, isDark?: boolean) => {
  const { DEFAULT } = shades
  const shadesComputed = color2Shades(DEFAULT, saturationFactor, lightFactor, isDark)
  return Object.assign(shadesComputed, shades)
}

const withOpacity = (variableName: string) => {
  return ({ opacityValue }: colorOpacity) => {
    if (opacityValue == null) {
      /**
      input:
      shadow-themeable-background-50
      output:
      .shadow-themeable-background-50 {
        --tw-shadow-color: var(--themeable-background-50);
      }
       */
      return `var(${variableName})`
    }
    /*
    input:
    text-themeable-foreground
    output:
    .text-themeable-foreground {
      --tw-text-opacity: 1;
      color: rgba(var(--themeable-foreground), var(--tw-text-opacity));
    }
    */
    return `rgba(var(${variableName}), ${opacityValue})`
  }
}

export const paletteKeyShade2CSSVariable = (classPrefix: string, paletteKey: string, shade: string | number) => `--${classPrefix}-${paletteKey}${shade === 'DEFAULT' ? '' : `-${shade}`}`

export const themeable = createPlugin.withOptions<ThemeableOptions>(({
  themes = [],
  classPrefix = 'themeable',
  defaultTheme = 'dracula',
  saturationFactor = saturationFactorDefault,
  lightFactor = lightFactorDefault
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
      const colorShadesComputed = fillColorShades(colorShades, saturationFactor, lightFactor, theme.isDark)
      let shade: keyof ColorShades
      for (shade in colorShadesComputed) {
        const key = paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade)
        const value = hex2rgb(colorShadesComputed[shade]).join(', ')
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
