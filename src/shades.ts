import { ColorHex, ColorShadesComputed, lightFactorDefault, saturationFactorDefault, shadeStops } from '.'
import { hex2HSL, hsl2Hex } from './utils'

/**
 * Generate 10 shades (from 50 to 900) from one color
 * Thanks to: https://github.com/nickgraffis/tailwind-color-generator
 */
export const color2Shades = (color: ColorHex, saturationFactor = saturationFactorDefault, lightFactor = lightFactorDefault, isDark = false) => {
  // find the best shade index for this color, if this color is too light, it will be closer to `50`, otherwise it will be closer to `900` if too dark
  const [h, s, l] = hex2HSL(color)

  const lightness = [97]
  while (lightness.length < shadeStops.length) {
    lightness.push(lightness[lightness.length - 1] - lightFactor)
  }
  const closestLightness = lightness.reduce((prev, curr) => {
    return (Math.abs(curr - l) < Math.abs(prev - l) ? curr : prev)
  })
  const closestShadeIndex = lightness.indexOf(closestLightness)

  const ans: ColorShadesComputed = {
    DEFAULT: color
  } as any
  // For darker shades
  for (let i = closestShadeIndex; i < shadeStops.length; i++) {
    const step = i - closestShadeIndex
    ans[shadeStops[i]] = hsl2Hex([h, s - saturationFactor * step, l - lightFactor * step])
  }
  // For lighter shades
  for (let i = 0; i < closestShadeIndex; i++) {
    const step = closestShadeIndex - i
    ans[shadeStops[i]] = hsl2Hex([h, s + saturationFactor * step, l + lightFactor * step])
  }

  // reverse the shades if it is a dark theme, see the type docs of Theme['isDark']
  if (isDark) {
    for (let i = 0, j = shadeStops.length - 1; i < j; i++, j--) {
      [ans[shadeStops[i]], ans[shadeStops[j]]] = [ans[shadeStops[j]], ans[shadeStops[i]]]
    }
  }

  return ans
}
