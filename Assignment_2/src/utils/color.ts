const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function isValidHex(color: string): boolean {
  return HEX_REGEX.test(color)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace('#', '').match(
    /^(?:([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])|([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2}))$/,
  )
  if (!match) return null
  if (match[1]) {
    return {
      r: parseInt(match[1] + match[1], 16),
      g: parseInt(match[2] + match[2], 16),
      b: parseInt(match[3] + match[3], 16),
    }
  }
  return {
    r: parseInt(match[4], 16),
    g: parseInt(match[5], 16),
    b: parseInt(match[6], 16),
  }
}

export function rgbToLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

export function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = hexToRgb(foreground)
  const bgRgb = hexToRgb(background)
  if (!fgRgb || !bgRgb) return 1

  const fgLuminance = rgbToLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
  const bgLuminance = rgbToLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

export function isWCAGAACompliant(
  foreground: string,
  background: string,
  largeText: boolean = false,
): boolean {
  const ratio = getContrastRatio(foreground, background)
  return largeText ? ratio >= 3 : ratio >= 4.5
}

export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

export function getAccentColorClass(color: string): string {
  return `accent-${color.replace('#', '')}`
}
