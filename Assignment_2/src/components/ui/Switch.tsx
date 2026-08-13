import React from 'react'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  id?: string
}

export const Switch = React.memo(function Switch({
  checked,
  onCheckedChange,
  label,
  id,
}: SwitchProps) {
  const switchId = id || `switch-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <button
        role="switch"
        id={switchId}
        aria-checked={checked}
        aria-label={label}
        onClick={() => onCheckedChange(!checked)}
        style={{
          width: 40,
          height: 24,
          borderRadius: 12,
          border: 'none',
          backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-border)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color var(--duration-fast) var(--ease-default)',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 19 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: '#fff',
            transition: 'left var(--duration-fast) var(--ease-default)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </button>
      <label
        htmlFor={switchId}
        style={{ cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', userSelect: 'none' }}
      >
        {label}
      </label>
    </div>
  )
})
