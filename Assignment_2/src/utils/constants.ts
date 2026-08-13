export const STORAGE_KEYS = {
  THEME: 'clockboard_theme',
  ALARMS: 'clockboard_alarms',
  WORLD_CLOCK_CITIES: 'clockboard_world_cities',
  DASHBOARD_LAYOUT: 'clockboard_layout',
  DASHBOARD_PRESETS: 'clockboard_presets',
  STOPWATCH_STATE: 'clockboard_stopwatch',
  COUNTDOWN_TIMERS: 'clockboard_countdown',
  CLOCK_CONFIG: 'clockboard_clock_config',
  SETTINGS: 'clockboard_settings',
  POMODORO_SESSION_COUNT: 'clockboard_pomodoro_sessions',
  CITY_FAVORITES: 'clockboard_city_favorites',
  ALARM_HISTORY: 'clockboard_alarm_history',
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 1024,
  lg: 1536,
} as const

export const MAX_CITIES = 50
export const MAX_ALARMS = 50
export const MAX_COUNTDOWN_TIMERS = 10
export const MAX_LAPS_DISPLAYED = 100

export const THEME_STORAGE_KEY = STORAGE_KEYS.THEME
