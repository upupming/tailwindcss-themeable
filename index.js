"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __defProp = Object.defineProperty;
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
var _colorconvert = require('color-convert'); var _colorconvert2 = _interopRequireDefault(_colorconvert);
var shadeStops = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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
var color2Shades = (hex, shadeLightenStep = 8, shadeDarkenStep = 11) => {
  const [h, s, l] = _colorconvert2.default.hex.hsl.raw(hex);
  const defaultStop = 5;
  const generatedHexColors = shadeStops.map((stop) => {
    const diff = stop - defaultStop;
    if (diff < 0) {
      return _colorconvert2.default.hsl.hex([h, s, clamp(l + Math.abs(diff) * shadeLightenStep)]);
    } else {
      return _colorconvert2.default.hsl.hex([h, s, clamp(l - Math.abs(diff) * shadeDarkenStep)]);
    }
  }).map((hex2) => `#${hex2}`);
  const ans = {
    DEFAULT: hex
  };
  shadeStops.forEach((stop, idx) => {
    ans[stop * 100] = generatedHexColors[idx];
  });
  return ans;
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
    let paletteKey;
    for (paletteKey in theme.palette) {
      const color = theme.palette[paletteKey];
      let colorShades;
      if (typeof color === "string") {
        colorShades = color2Shades(color, shadeLightenStep, shadeDarkenStep);
      } else {
        colorShades = color;
      }
      for (const shade in colorShades) {
        const key = paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade);
        const value = _colorconvert2.default.hex.rgb.raw(colorShades[shade]).join(", ");
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
}, ({ classPrefix = "themeable" }) => {
  const { palette } = themeDracula;
  const colors = {};
  let paletteKey;
  for (paletteKey in palette) {
    const paletteInstance = {};
    for (const stop of shadeStops) {
      const shade = stop * 100;
      paletteInstance[shade] = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade));
    }
    paletteInstance.DEFAULT = withOpacity(paletteKeyShade2CSSVariable(classPrefix, paletteKey, "DEFAULT"));
    colors[`${classPrefix}-${paletteKey}`] = paletteInstance;
  }
  return {
    theme: {
      extend: {
        colors
      }
    }
  };
});









exports.builtinThemes = builtinThemes; exports.clamp = clamp; exports.color2Shades = color2Shades; exports.paletteKeyShade2CSSVariable = paletteKeyShade2CSSVariable; exports.shadeStops = shadeStops; exports.themeDracula = themeDracula; exports.themeMaterial = themeMaterial; exports.themeable = themeable;
