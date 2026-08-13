interface SpinnerProps {
  size?: number
  'aria-label'?: string
}

export function Spinner({ size = 24, 'aria-label': ariaLabel = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        border: `3px solid var(--color-border)`,
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.8s linear infinite',
      }}
    >
      <span className="sr-only">{ariaLabel}</span>
    </span>
  )
}
