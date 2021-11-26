var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// node_modules/.pnpm/windicss@3.2.1/node_modules/windicss/plugin/index.mjs
var createPlugin = function(plugin, config) {
  return {
    handler: plugin,
    config
  };
};
createPlugin.withOptions = function(pluginFunction, configFunction) {
  if (configFunction === void 0) {
    configFunction = function() {
      return {};
    };
  }
  var optionsFunction = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      __options: options,
      handler: pluginFunction(options),
      config: configFunction(options)
    };
  };
  optionsFunction.__isOptionsFunction = true;
  optionsFunction.__pluginFunction = pluginFunction;
  optionsFunction.__configFunction = configFunction;
  return optionsFunction;
};
var plugin_default = createPlugin;

// src/index.ts
import converter from "color-convert";
var builtinPaletteKeys = [
  "background",
  "foreground",
  "selection",
  "comment",
  "cyan",
  "green",
  "orange",
  "pink",
  "purple",
  "red",
  "yellow"
];
var shadeStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
var themeDracula = {
  name: "dracula",
  palette: {
    background: "#282A36",
    foreground: "#F8F8F2",
    selection: "#44475A",
    comment: "#6272A4",
    cyan: "#8BE9FD",
    green: "#50FA7B",
    orange: "#FFB86C",
    pink: "#FF79C6",
    purple: "#BD93F9",
    red: "#FF5555",
    yellow: "#F1FA8C"
  }
};
var themeMaterial = {
  name: "material",
  palette: {
    background: "#FFFFFF",
    foreground: "#000000",
    selection: "#8796B0",
    comment: "#6182B8",
    cyan: "#39ADB5",
    green: "#91B859",
    orange: "#F76D47",
    pink: "#FF5370",
    purple: "#9C3EDA",
    red: "#E53935",
    yellow: "#E2931D"
  }
};
var builtinThemes = [themeDracula, themeMaterial];
var clamp = (val, min = 0, max = 100) => {
  return Math.min(Math.max(val, min), max);
};
var fillColorShades = (shades, shadeLightenStep = 8, shadeDarkenStep = 11) => {
  const { DEFAULT } = shades;
  const [h, s, l] = converter.hex.hsl.raw(DEFAULT);
  const defaultStop = 500;
  shadeStops.forEach((stop) => {
    if (shades[stop] !== void 0)
      return;
    const diff = (stop - defaultStop) / 100;
    let hex;
    if (diff < 0) {
      hex = converter.hsl.hex([h, s, clamp(l + Math.abs(diff) * shadeLightenStep)]);
    } else {
      hex = "#" + converter.hsl.hex([h, s, clamp(l - Math.abs(diff) * shadeDarkenStep)]);
    }
    shades[stop] = `#${hex}`;
  });
  return shades;
};
var withOpacity = (variableName) => {
  return ({ opacityValue = 1 }) => {
    return `rgba(var(${variableName}), ${opacityValue})`;
  };
};
var paletteKeyShade2CSSVariable = (classPrefix, paletteKey, shade) => `--${classPrefix}-${paletteKey}${shade === "DEFAULT" ? "" : `-${shade}`}`;
var themeable = plugin_default.withOptions(({
  themes = [],
  shadeLightenStep = 8,
  shadeDarkenStep = 11,
  classPrefix = "themeable",
  defaultTheme = "dracula"
}) => ({ addBase }) => {
  themes = [...builtinThemes, ...themes];
  themes.forEach((theme) => {
    for (const paletteKey in theme.palette) {
      const color = theme.palette[paletteKey];
      let colorShades;
      if (typeof color === "string") {
        colorShades = { DEFAULT: color };
      } else {
        colorShades = color;
      }
      const colorShadesComputed = fillColorShades(colorShades, shadeLightenStep, shadeDarkenStep);
      let shade;
      for (shade in colorShadesComputed) {
        const key = paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade);
        const value = converter.hex.rgb.raw(colorShadesComputed[shade]).join(", ");
        const rawRgbStyle = __spreadValues({
          [`.${classPrefix}-${theme.name}`]: {
            [key]: value
          }
        }, defaultTheme === theme.name ? {
          ":root": {
            [key]: value
          }
        } : {});
        addBase(rawRgbStyle);
      }
    }
  });
}, ({ classPrefix = "themeable", themes = [] }) => {
  themes = [...builtinThemes, ...themes];
  const colors = {};
  const paletteKeysSeen = new Set();
  themes.forEach((theme) => {
    for (const paletteKey in theme.palette) {
      paletteKeysSeen.add(paletteKey);
    }
  });
  for (const paletteKey of paletteKeysSeen) {
    const paletteInstance = {};
    for (const stop of shadeStops) {
      paletteInstance[stop] = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, stop));
    }
    paletteInstance.DEFAULT = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, "DEFAULT"));
    colors[`${classPrefix}-${paletteKey}`] = paletteInstance;
    if (builtinPaletteKeys.includes(paletteKey))
      continue;
    for (const theme of themes) {
      if (builtinThemes.includes(theme))
        continue;
      if (theme.palette[paletteKey] === void 0) {
        console.warn(`[tailwindcss-themeable]: theme ${theme.name} missing the palette ${paletteKey}, please add the palette key to theme or delete the palette key from other themes to avoid inconsistent`);
      }
    }
  }
  return {
    theme: {
      extend: {
        colors
      }
    }
  };
});
export {
  builtinPaletteKeys,
  builtinThemes,
  clamp,
  fillColorShades,
  paletteKeyShade2CSSVariable,
  shadeStops,
  themeDracula,
  themeMaterial,
  themeable
};
