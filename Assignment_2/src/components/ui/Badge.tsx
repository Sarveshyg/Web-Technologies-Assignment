import React from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  'aria-label'?: string
}

const badgeVariants: Record<BadgeVariant, React.CSSProperties> = {
  default: { backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' },
  success: { backgroundColor: '#D1FAE5', color: '#065F46' },
  warning: { backgroundColor: '#FEF3C7', color: '#92400E' },
  error: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  info: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
}

export const Badge = React.memo(function Badge({
  children,
  variant = 'default',
  'aria-label': ariaLabel,
}: BadgeProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
        ...badgeVariants[variant],
      }}
    >
      {children}
    </span>
  )
})
