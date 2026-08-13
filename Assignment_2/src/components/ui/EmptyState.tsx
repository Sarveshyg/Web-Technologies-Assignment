import React from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-4)',
        textAlign: 'center',
        gap: 'var(--space-3)',
      }}
    >
      <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-medium)', color: 'var(--color-text-primary)' }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: 240 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
