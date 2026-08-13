import type { ClockState } from '../../hooks/useClock'
import { AnalogClock } from './AnalogClock'
import { DigitalClock } from './DigitalClock'

interface ClockWidgetProps {
  clock: ClockState
}

export function ClockWidget({ clock }: ClockWidgetProps) {
  const dateStr = new Date(clock.timestamp).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-6)',
      padding: 'var(--space-4)',
    }}>
      <AnalogClock
        hours={clock.hours}
        minutes={clock.minutes}
        seconds={clock.seconds}
        size={180}
      />
      <DigitalClock
        hours={clock.hours}
        minutes={clock.minutes}
        seconds={clock.seconds}
        format24h={true}
        showSeconds={true}
      />
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        {dateStr}
      </p>
    </div>
  )
}
