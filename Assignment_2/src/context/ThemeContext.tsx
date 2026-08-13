import { createContext, useContext, useCallback, useEffect, useMemo } from 'react'
import type { ThemeConfig, ThemeContextState, ThemeMode } from '../types/theme'
import { DEFAULT_THEME_CONFIG } from '../types/theme'
import { saveThemeConfig, resolveMode, applyThemeToDocument } from '../services/themeService'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

const ThemeContext = createContext<ThemeContextState | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useLocalStorage<ThemeConfig>(
    STORAGE_KEYS.THEME,
    DEFAULT_THEME_CONFIG,
  )

  const resolvedMode = useMemo(() => resolveMode(config.mode), [config.mode])

  useEffect(() => {
    applyThemeToDocument(resolvedMode, config)
  }, [resolvedMode, config])

  useEffect(() => {
    if (config.mode !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const newResolved = resolveMode('system')
      applyThemeToDocument(newResolved, config)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [config.mode, config])

  const updateConfig = useCallback((updates: Partial<ThemeConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates }
      saveThemeConfig(next)
      return next
    })
  }, [setConfig])

  const setMode = useCallback((mode: ThemeMode) => updateConfig({ mode }), [updateConfig])
  const setAccentColor = useCallback((accentColor: string) => updateConfig({ accentColor }), [updateConfig])
  const setGlassmorphism = useCallback((glassmorphism: boolean) => updateConfig({ glassmorphism }), [updateConfig])
  const setMinimalMode = useCallback((minimalMode: boolean) => updateConfig({ minimalMode }), [updateConfig])
  const setHighContrast = useCallback((highContrast: boolean) => updateConfig({ highContrast }), [updateConfig])
  const setFontFamily = useCallback((fontFamily: ThemeConfig['fontFamily']) => updateConfig({ fontFamily }), [updateConfig])
  const setBackground = useCallback((backgroundType: ThemeConfig['backgroundType'], backgroundValue: string) => updateConfig({ backgroundType, backgroundValue }), [updateConfig])
  const setBorderRadius = useCallback((borderRadius: ThemeConfig['borderRadius']) => updateConfig({ borderRadius }), [updateConfig])
  const setSpacingDensity = useCallback((spacingDensity: ThemeConfig['spacingDensity']) => updateConfig({ spacingDensity }), [updateConfig])
  const setAnimationSpeed = useCallback((animationSpeed: ThemeConfig['animationSpeed']) => updateConfig({ animationSpeed }), [updateConfig])
  const resetTheme = useCallback(() => {
    setConfig(DEFAULT_THEME_CONFIG)
    saveThemeConfig(DEFAULT_THEME_CONFIG)
  }, [setConfig])

  const value = useMemo<ThemeContextState>(() => ({
    config,
    resolvedMode,
    setMode,
    setAccentColor,
    setGlassmorphism,
    setMinimalMode,
    setHighContrast,
    setFontFamily,
    setBackground,
    setBorderRadius,
    setSpacingDensity,
    setAnimationSpeed,
    resetTheme,
  }), [
    config,
    resolvedMode,
    setMode,
    setAccentColor,
    setGlassmorphism,
    setMinimalMode,
    setHighContrast,
    setFontFamily,
    setBackground,
    setBorderRadius,
    setSpacingDensity,
    setAnimationSpeed,
    resetTheme,
  ])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextState {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
