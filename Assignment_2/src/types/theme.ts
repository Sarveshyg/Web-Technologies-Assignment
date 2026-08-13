export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  accentColor: string
  glassmorphism: boolean
  minimalMode: boolean
  highContrast: boolean
  fontFamily: 'inter' | 'system' | 'mono' | 'serif'
  backgroundType: 'solid' | 'gradient' | 'wallpaper'
  backgroundValue: string
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  spacingDensity: 'compact' | 'comfortable' | 'spacious'
  animationSpeed: 'normal' | 'reduced' | 'off'
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'system',
  accentColor: '#3B82F6',
  glassmorphism: false,
  minimalMode: false,
  highContrast: false,
  fontFamily: 'inter',
  backgroundType: 'solid',
  backgroundValue: '',
  borderRadius: 'medium',
  spacingDensity: 'comfortable',
  animationSpeed: 'normal',
}

export interface ThemeContextState {
  config: ThemeConfig
  resolvedMode: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  setAccentColor: (color: string) => void
  setGlassmorphism: (enabled: boolean) => void
  setMinimalMode: (enabled: boolean) => void
  setHighContrast: (enabled: boolean) => void
  setFontFamily: (font: ThemeConfig['fontFamily']) => void
  setBackground: (type: ThemeConfig['backgroundType'], value: string) => void
  setBorderRadius: (radius: ThemeConfig['borderRadius']) => void
  setSpacingDensity: (density: ThemeConfig['spacingDensity']) => void
  setAnimationSpeed: (speed: ThemeConfig['animationSpeed']) => void
  resetTheme: () => void
}
