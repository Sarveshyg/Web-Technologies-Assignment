

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

interface DayPickerProps {
  selected: DayOfWeek[]
  onChange: (days: DayOfWeek[]) => void
  label?: string
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const DAY_ABBREVIATIONS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

export function DayPicker({ selected, onChange, label }: DayPickerProps) {
  const toggleDay = (day: DayOfWeek) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day))
    } else {
      onChange([...selected, day])
    }
  }

  return (
    <div>
      {label && (
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
          {label}
        </p>
      )}
      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
        {DAY_LABELS.map((dayLabel, index) => {
          const day = index as DayOfWeek
          const isSelected = selected.includes(day)
          return (
            <button
              key={day}
              type="button"
              aria-label={dayLabel}
              aria-pressed={isSelected}
              onClick={() => toggleDay(day)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-bg-card)',
                color: isSelected ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-default)',
              }}
            >
              {DAY_ABBREVIATIONS[day]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
