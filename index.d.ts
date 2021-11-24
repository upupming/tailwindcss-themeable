import * as windicss_types_interfaces from 'windicss/types/interfaces';

/**
 * https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20
 * https://spec.draculatheme.com/#sec-Standard
 */
declare type PaletteKeys = 'background' | 'foreground' | 'selection' | 'comment' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'yellow';
declare type ColorHex = `#${string}`;
interface ColorShades {
    '50': ColorHex;
    '100': ColorHex;
    '200': ColorHex;
    '300': ColorHex;
    '400': ColorHex;
    '500': ColorHex;
    '600': ColorHex;
    '700': ColorHex;
    '800': ColorHex;
    '900': ColorHex;
    DEFAULT: ColorHex;
}
declare const shadeStops: number[];
declare type ThemePalette = {
    [key in PaletteKeys]: ColorHex | ColorShades;
};
interface Theme {
    name: string;
    palette: ThemePalette;
}
interface ThemeableOptions {
    /**
     * Support a list of theme definitions, the user should define the colors of the theme follow the contribute of Dracula theme.
     * See https://draculatheme.com/contribute#color-palette
     * @default []
     */
    themes?: Theme[];
    /**
     * Prefix of the class to enable a theme, for example the container with class `${classPrefix}-dracula` will enable dracula theme in its children elements
     * @default `themeable`
     */
    classPrefix?: string;
    /** The lighten step for auto generated shades smaller than the default `500` color
     * For example, if you passed `#50FA7B` as the `green` theme key, and `shadeLightenStep` is 8,
     * then we will use this color as the `DEFAULT` and shade `500` to generate all other shades of `green`,
     * for shade smaller than `500`, we will add the lightness up `shadeLightenStep` in per 100 gap.
     * Color `#50FA7B` converted to HSL is [135, 94, 64], so the shade `400` will be computed to [135, 94, 72]
     * @default 8
     */
    shadeLightenStep?: number;
    /** Similar with `shadeLightenStep` but for shades larger than `500`
     * @default 11
     */
    shadeDarkenStep?: number;
    /** When not specify any theme in HTML, the `defaultTheme` will be used
     * @default `dracula`
     */
    defaultTheme?: string;
}
/**
 * The dracula theme, see https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20 and
 * https://draculatheme.com/contribute#color-palette
 */
declare const themeDracula: Theme;
declare const themeMaterial: Theme;
declare const builtinThemes: readonly [Theme, Theme];
declare const clamp: (val: number, min?: number, max?: number) => number;
declare const color2Shades: (hex: ColorHex, shadeLightenStep?: number, shadeDarkenStep?: number) => ColorShades;
declare const paletteKeyShade2CSSVariable: (classPrefix: string, paletteKey: PaletteKeys, shade: string | number) => string;
declare const themeable: windicss_types_interfaces.PluginWithOptions<ThemeableOptions>;

export { ColorHex, ColorShades, PaletteKeys, Theme, ThemePalette, ThemeableOptions, builtinThemes, clamp, color2Shades, paletteKeyShade2CSSVariable, shadeStops, themeDracula, themeMaterial, themeable };
