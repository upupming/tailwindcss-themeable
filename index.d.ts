import * as windicss_types_interfaces from 'windicss/types/interfaces';

/**
 * https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20
 * https://spec.draculatheme.com/#sec-Standard
 */
declare const builtinPaletteKeys: readonly ["background", "foreground", "selection", "comment", "cyan", "green", "orange", "pink", "purple", "red", "yellow"];
declare type PaletteKeys = typeof builtinPaletteKeys[number];
declare const saturationFactorDefault = 1.771968374684816;
declare const lightFactorDefault = 7.3903743315508015;
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
    /** When not specify any theme in HTML, the `defaultTheme` will be used
     * @default `dracula`
     */
    defaultTheme?: string;
    /**
     * This will allow you the change the difference in saturation between each shade of color. By default we use  1.771968374684816 because these are the averages that steps change in tailwind's default colors. Thanks to https://tw-shade-gen.netlify.app/
     */
    saturationFactor?: number;
    /**
     * This will allow you the change the difference in lightness between each shade of color. By default we use 7.3903743315508015 because these are the averages that steps change in tailwind's default colors. Thanks to https://tw-shade-gen.netlify.app/
     */
    lightFactor?: number;
}
/**
 * The dracula theme, see https://github.com/dracula/visual-studio-code/blob/d0b71bb57a591cdf11d43566831bb64c8899d783/src/dracula.yml#L9-L20 and
 * https://draculatheme.com/contribute#color-palette
 */
declare const themeDracula: {
    readonly name: "dracula";
    readonly palette: {
        readonly background: "#282A36";
        readonly foreground: "#F8F8F2";
        readonly selection: "#44475A";
        readonly comment: "#6272A4";
        readonly cyan: "#8BE9FD";
        readonly green: "#50FA7B";
        readonly orange: "#FFB86C";
        readonly pink: "#FF79C6";
        readonly purple: "#BD93F9";
        readonly red: "#FF5555";
        readonly yellow: "#F1FA8C";
    };
};
declare const themeMaterial: Theme;
declare const builtinThemes: readonly [{
    readonly name: "dracula";
    readonly palette: {
        readonly background: "#282A36";
        readonly foreground: "#F8F8F2";
        readonly selection: "#44475A";
        readonly comment: "#6272A4";
        readonly cyan: "#8BE9FD";
        readonly green: "#50FA7B";
        readonly orange: "#FFB86C";
        readonly pink: "#FF79C6";
        readonly purple: "#BD93F9";
        readonly red: "#FF5555";
        readonly yellow: "#F1FA8C";
    };
}, Theme];
/**
 * Fill a `ColorShades` with auto-generated shade values and return a `ColorShadesComputed`
 */
declare const fillColorShades: (shades: ColorShades, saturationFactor?: number | undefined, lightFactor?: number | undefined) => ColorShadesComputed & {
    50?: `#${string}` | undefined;
    100?: `#${string}` | undefined;
    200?: `#${string}` | undefined;
    300?: `#${string}` | undefined;
    400?: `#${string}` | undefined;
    500?: `#${string}` | undefined;
    600?: `#${string}` | undefined;
    700?: `#${string}` | undefined;
    800?: `#${string}` | undefined;
    900?: `#${string}` | undefined;
} & {
    DEFAULT: `#${string}`;
};
declare const paletteKeyShade2CSSVariable: (classPrefix: string, paletteKey: string, shade: string | number) => string;
declare const themeable: windicss_types_interfaces.PluginWithOptions<ThemeableOptions>;

export { ColorHex, ColorShadeKeys, ColorShades, ColorShadesComputed, DEFAULT, PaletteKeys, ShadeStops, Theme, ThemePalette, ThemeableOptions, builtinPaletteKeys, builtinThemes, fillColorShades, lightFactorDefault, paletteKeyShade2CSSVariable, saturationFactorDefault, shadeStops, themeDracula, themeMaterial, themeable };
