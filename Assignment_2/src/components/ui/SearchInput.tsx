import React, { useState, useRef, useEffect, useCallback } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (value: string) => void
  placeholder?: string
  results?: Array<{ value: string; label: string }>
  'aria-label'?: string
}

export function SearchInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search...',
  results = [],
  'aria-label': ariaLabel,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault()
        onSelect?.(results[activeIndex].value)
        onChange(results[activeIndex].label)
        setIsOpen(false)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    },
    [activeIndex, results, onSelect, onChange],
  )

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => value && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-sm)',
          outline: 'none',
          transition: 'border-color var(--duration-fast) var(--ease-default)',
        }}
      />
      {isOpen && results.length > 0 && (
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
            maxHeight: 240,
            overflowY: 'auto',
            padding: 'var(--space-1)',
          }}
        >
          {results.map((result, index) => (
            <li
              key={result.value}
              id={`result-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => {
                onSelect?.(result.value)
                onChange(result.label)
                setIsOpen(false)
              }}
              onMouseEnter={() => setActiveIndex(index)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: index === activeIndex ? 'var(--color-accent-light)' : 'transparent',
                color: index === activeIndex ? 'var(--color-accent)' : 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
                listStyle: 'none',
              }}
            >
              {result.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
