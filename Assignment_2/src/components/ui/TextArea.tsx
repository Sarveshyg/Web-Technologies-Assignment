import React from 'react'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function TextArea({ label, error, id, style, ...rest }: TextAreaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label
          htmlFor={id}
          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{
          width: '100%',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-sm)',
          resize: 'vertical',
          minHeight: 80,
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          ...style,
        }}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
