import React, { useId } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, id: externalId, style, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = externalId || generatedId

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        style={{
          width: '100%',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-sm)',
          transition: 'border-color var(--duration-fast) var(--ease-default)',
          outline: 'none',
          ...style,
        }}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
