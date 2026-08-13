import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)', border: 'none' },
  secondary: { backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' },
  ghost: { backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: 'none' },
  danger: { backgroundColor: 'var(--color-error)', color: '#fff', border: 'none' },
}

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-sm)' },
  md: { padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-base)' },
  lg: { padding: 'var(--space-3) var(--space-6)', fontSize: 'var(--text-lg)' },
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        borderRadius: 'var(--radius-md)',
        fontWeight: 'var(--font-medium)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all var(--duration-fast) var(--ease-default)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...rest}
    >
      {loading && <span className="animate-spin" style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block' }} />}
      {children}
    </button>
  )
}
