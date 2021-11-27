import { ColorHex } from '.'

export const clamp = (val: number, min: number = 0, max: number = 100) => {
  return Math.min(Math.max(val, min), max)
}

export const hex2rgb = (hex: ColorHex): [number, number, number] => {
  let r, g, b
  if (hex.length === 4) {
    // #RGB
    [r, g, b] = hex.split('').slice(1).map(s => parseInt(s + s, 16) / 255)
  } else {
    // #RRGGBB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result == null) {
      throw new Error(`Please use the #RGB or #RRGGBB format for hex colors, got wrong color hex ${hex}`)
    }
    r = parseInt(result[1], 16)
    g = parseInt(result[2], 16)
    b = parseInt(result[3], 16)
  }
  return [r, g, b]
}

export const hex2HSL = (hex: ColorHex): [number, number, number] => {
  const [r, g, b] = hex2rgb(hex).map(char => char / 255)

  const max = Math.max(r, g, b); const min = Math.min(r, g, b)
  let h = 0; let s = 0; const l = (max + min) / 2
  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return [
    h * 360,
    s * 100,
    l * 100
  ]
}

export const hsl2Hex = ([h, s, l]: [number, number, number]): ColorHex => {
  s = clamp(s, 0, 100)
  l = clamp(l, 0, 100)

  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0') // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
