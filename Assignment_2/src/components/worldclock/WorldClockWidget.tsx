import React, { useMemo } from 'react'
import type { ClockState } from '../../hooks/useClock'
import { Sun, Moon } from 'lucide-react'

interface City {
  name: string
  country: string
  timezone: string
  flag: string
}

const MAJOR_CITIES: City[] = [
  { name: 'London', country: 'UK', timezone: 'Europe/London', flag: '🇬🇧' },
  { name: 'New York', country: 'US', timezone: 'America/New_York', flag: '🇺🇸' },
  { name: 'Tokyo', country: 'JP', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'Sydney', country: 'AU', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { name: 'Paris', country: 'FR', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { name: 'Dubai', country: 'AE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { name: 'Singapore', country: 'SG', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { name: 'Los Angeles', country: 'US', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { name: 'Berlin', country: 'DE', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { name: 'Mumbai', country: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'Sao Paulo', country: 'BR', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { name: 'Cairo', country: 'EG', timezone: 'Africa/Cairo', flag: '🇪🇬' },
  { name: 'Seoul', country: 'KR', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { name: 'Toronto', country: 'CA', timezone: 'America/Toronto', flag: '🇨🇦' },
  { name: 'Moscow', country: 'RU', timezone: 'Europe/Moscow', flag: '🇷🇺' },
]

interface CityTime {
  city: City
  time: string
  date: string
  offset: string
  isDaytime: boolean
}

function getCityTime(city: City, now: Date): CityTime {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const offsetFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone,
    timeZoneName: 'short',
  })

  const time = formatter.format(now)
  const date = dateFormatter.format(now)
  const parts = offsetFormatter.formatToParts(now)
  const tzPart = parts.find((p) => p.type === 'timeZoneName')
  const offset = tzPart?.value || ''

  const cityNow = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }))
  const isDaytime = cityNow.getHours() >= 6 && cityNow.getHours() < 18

  return { city, time, date, offset, isDaytime }
}

interface WorldClockWidgetProps {
  clock: ClockState
}

export function WorldClockWidget({ clock }: WorldClockWidgetProps) {
  const now = useMemo(() => new Date(clock.timestamp), [clock.timestamp])
  const [showAll, setShowAll] = React.useState(false)
  const cities = showAll ? MAJOR_CITIES : MAJOR_CITIES.slice(0, 6)

  const cityTimes = useMemo(
    () => cities.map((c) => getCityTime(c, now)),
    [cities, now],
  )

  const localOffset = -now.getTimezoneOffset() / 60
  const localOffsetStr = `UTC${localOffset >= 0 ? '+' : ''}${localOffset}`

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          World Clocks
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Local {localOffsetStr}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {cityTimes.map((ct) => (
          <div
            key={ct.city.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: ct.isDaytime ? 'rgba(255,200,50,0.08)' : 'rgba(30,40,80,0.15)',
              border: '1px solid var(--color-border-light)',
              transition: 'background 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 20 }}>{ct.city.flag}</span>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {ct.city.name}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {ct.date} &middot; {ct.offset}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {ct.time}
              </p>
              {ct.isDaytime ? <Sun size={16} color="var(--color-warning)" /> : <Moon size={16} color="var(--color-text-muted)" />}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowAll(!showAll)}
        style={{
          marginTop: 'var(--space-3)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-accent)',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          width: '100%',
          padding: 'var(--space-2)',
        }}
      >
        {showAll ? 'Show less' : `Show all (${MAJOR_CITIES.length})`}
      </button>
    </div>
  )
}
