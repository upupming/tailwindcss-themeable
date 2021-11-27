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

// src/utils.ts
var clamp = (val, min = 0, max = 100) => {
  return Math.min(Math.max(val, min), max);
};
var hex2rgb = (hex) => {
  let r, g, b;
  if (hex.length === 4) {
    [r, g, b] = hex.split("").slice(1).map((s) => parseInt(s + s, 16));
  } else {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result == null) {
      throw new Error(`Please use the #RGB or #RRGGBB format for hex colors, got wrong color hex ${hex}`);
    }
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
  }
  return [r, g, b];
};
var hex2HSL = (hex) => {
  const [r, g, b] = hex2rgb(hex).map((char) => char / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [
    h * 360,
    s * 100,
    l * 100
  ];
};
var hsl2Hex = ([h, s, l]) => {
  s = clamp(s, 0, 100);
  l = clamp(l, 0, 100);
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// src/shades.ts
var color2Shades = (color, saturationFactor = saturationFactorDefault, lightFactor = lightFactorDefault) => {
  const [h, s, l] = hex2HSL(color);
  const lightness = [97];
  while (lightness.length < shadeStops.length) {
    lightness.push(lightness[lightness.length - 1] - lightFactor);
  }
  const closestLightness = lightness.reduce((prev, curr) => {
    return Math.abs(curr - l) < Math.abs(prev - l) ? curr : prev;
  });
  const closestShadeIndex = lightness.indexOf(closestLightness);
  const ans = {
    DEFAULT: color
  };
  for (let i = closestShadeIndex; i < shadeStops.length; i++) {
    const step = i - closestShadeIndex;
    ans[shadeStops[i]] = hsl2Hex([h, s - saturationFactor * step, l - lightFactor * step]);
  }
  for (let i = 0; i < closestShadeIndex; i++) {
    const step = closestShadeIndex - i;
    ans[shadeStops[i]] = hsl2Hex([h, s + saturationFactor * step, l + lightFactor * step]);
  }
  return ans;
};

// src/index.ts
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
var saturationFactorDefault = 1.771968374684816;
var lightFactorDefault = 7.3903743315508015;
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
var fillColorShades = (shades, saturationFactor, lightFactor) => {
  const { DEFAULT } = shades;
  const shadesComputed = color2Shades(DEFAULT, saturationFactor, lightFactor);
  return Object.assign(shadesComputed, shades);
};
var withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue == null) {
      return `var(${variableName})`;
    }
    return `rgba(var(${variableName}), ${opacityValue})`;
  };
};
var paletteKeyShade2CSSVariable = (classPrefix, paletteKey, shade) => `--${classPrefix}-${paletteKey}${shade === "DEFAULT" ? "" : `-${shade}`}`;
var themeable = plugin_default.withOptions(({
  themes = [],
  classPrefix = "themeable",
  defaultTheme = "dracula",
  saturationFactor = saturationFactorDefault,
  lightFactor = lightFactorDefault
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
      const colorShadesComputed = fillColorShades(colorShades, saturationFactor, lightFactor);
      let shade;
      for (shade in colorShadesComputed) {
        const key = paletteKeyShade2CSSVariable(classPrefix, paletteKey, shade);
        const value = hex2rgb(colorShadesComputed[shade]).join(", ");
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
  fillColorShades,
  lightFactorDefault,
  paletteKeyShade2CSSVariable,
  saturationFactorDefault,
  shadeStops,
  themeDracula,
  themeMaterial,
  themeable
};
