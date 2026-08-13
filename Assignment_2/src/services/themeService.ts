import type { ThemeConfig, ThemeMode } from '../types/theme'
import { DEFAULT_THEME_CONFIG } from '../types/theme'
import { localStorageService } from './localStorageService'
import { STORAGE_KEYS } from '../utils/constants'

export function getThemeConfig(): ThemeConfig {
  return localStorageService.get<ThemeConfig>(STORAGE_KEYS.THEME, DEFAULT_THEME_CONFIG)
}

export function saveThemeConfig(config: ThemeConfig): void {
  localStorageService.set(STORAGE_KEYS.THEME, config)
}

export function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

export function applyThemeToDocument(resolvedMode: 'light' | 'dark', config: ThemeConfig): void {
  const root = document.documentElement

  root.setAttribute('data-theme', resolvedMode)
  root.setAttribute('data-accent', config.accentColor)
  root.setAttribute('data-glass', String(config.glassmorphism))
  root.setAttribute('data-minimal', String(config.minimalMode))
  root.setAttribute('data-contrast', String(config.highContrast))
  root.setAttribute('data-font', config.fontFamily)
  root.setAttribute('data-radius', config.borderRadius)
  root.setAttribute('data-density', config.spacingDensity)
  root.setAttribute('data-animation', config.animationSpeed)

  if (config.backgroundType === 'wallpaper' && config.backgroundValue) {
    root.style.setProperty('--bg-wallpaper', `url(${config.backgroundValue})`)
  } else {
    root.style.removeProperty('--bg-wallpaper')
  }
}
