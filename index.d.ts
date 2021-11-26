import * as windicss_types_interfaces from 'windicss/types/interfaces';

/**
 * https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20
 * https://spec.draculatheme.com/#sec-Standard
 */
declare const builtinPaletteKeys: readonly ["background", "foreground", "selection", "comment", "cyan", "green", "orange", "pink", "purple", "red", "yellow"];
declare type PaletteKeys = typeof builtinPaletteKeys[number];
/** The smaller the stop, the lighter the generated color */
declare const shadeStops: readonly [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
declare type DEFAULT = 'DEFAULT';
declare type ShadeStops = typeof shadeStops[number];
declare type ColorShadeKeys = DEFAULT | ShadeStops;
declare type ColorHex = `#${string}`;
declare type ColorShades = {
    [stop in ShadeStops]?: ColorHex;
} & {
    [key in DEFAULT]: ColorHex;
};
/**
 * When all shades are already computed, type `ColorShades` will becomes `ColorShadesComputed`
 */
declare type ColorShadesComputed = {
    [key in ColorShadeKeys]: ColorHex;
};
declare type ThemePalette = {
    [key in PaletteKeys]?: ColorHex | ColorShades;
} & {
    /** User can define extra palette keys */
    [key: string]: ColorHex | ColorShades;
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
/**
 * Fill a `ColorShades` with auto-generated shade values and return a `ColorShadesComputed`
 */
declare const fillColorShades: (shades: ColorShades, shadeLightenStep?: number, shadeDarkenStep?: number) => ColorShadesComputed;
declare const paletteKeyShade2CSSVariable: (classPrefix: string, paletteKey: string, shade: string | number) => string;
declare const themeable: windicss_types_interfaces.PluginWithOptions<ThemeableOptions>;

export { ColorHex, ColorShadeKeys, ColorShades, ColorShadesComputed, DEFAULT, PaletteKeys, ShadeStops, Theme, ThemePalette, ThemeableOptions, builtinPaletteKeys, builtinThemes, clamp, fillColorShades, paletteKeyShade2CSSVariable, shadeStops, themeDracula, themeMaterial, themeable };
