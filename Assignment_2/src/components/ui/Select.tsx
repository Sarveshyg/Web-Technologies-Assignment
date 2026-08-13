import React, { useState, useRef, useEffect, useCallback } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  'aria-label'?: string
  placeholder?: string
}

export const Select = React.memo(function Select({
  value,
  onChange,
  options,
  'aria-label': ariaLabel,
  placeholder = 'Select...',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((o) => o.value === value)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen((o) => !o)
    }
    if (e.key === 'Escape') setIsOpen(false)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        role="combobox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-activedescendant={value ? `option-${value}` : undefined}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'border-color var(--duration-fast) var(--ease-default)',
        }}
      >
        <span style={{ color: selectedOption ? undefined : 'var(--color-text-muted)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast)' }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-card)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 'var(--z-dropdown)',
            maxHeight: 200,
            overflowY: 'auto',
            padding: 'var(--space-1)',
          }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              id={`option-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: option.value === value ? 'var(--color-accent-light)' : 'transparent',
                color: option.value === value ? 'var(--color-accent)' : 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
                listStyle: 'none',
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})
