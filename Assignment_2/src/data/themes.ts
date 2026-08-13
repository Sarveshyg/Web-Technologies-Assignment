import type { ThemeConfig } from '../types/theme'

export const PRESET_ACCENT_COLORS = [
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Green', value: '#10B981' },
  { label: 'Orange', value: '#F59E0B' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Rose', value: '#F43F5E' },
] as const

export const PRESET_THEMES: Array<{ name: string; config: Partial<ThemeConfig> }> = [
  {
    name: 'Default Light',
    config: { mode: 'light', accentColor: '#3B82F6' },
  },
  {
    name: 'Default Dark',
    config: { mode: 'dark', accentColor: '#3B82F6' },
  },
  {
    name: 'Midnight',
    config: { mode: 'dark', accentColor: '#8B5CF6', glassmorphism: true },
  },
  {
    name: 'Sunset',
    config: { mode: 'light', accentColor: '#F59E0B' },
  },
  {
    name: 'Forest',
    config: { mode: 'dark', accentColor: '#10B981' },
  },
]
