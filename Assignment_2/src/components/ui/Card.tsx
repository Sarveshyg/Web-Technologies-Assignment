import React from 'react'

interface CardProps {
  children: React.ReactNode
  'aria-label'?: string
  style?: React.CSSProperties
}

export const Card = React.memo(function Card({ children, 'aria-label': ariaLabel, style }: CardProps) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius-card, var(--radius-md))',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        padding: 'var(--space-card-padding, var(--space-6))',
        transition: 'background-color var(--duration-normal) var(--ease-default), border-color var(--duration-normal) var(--ease-default), box-shadow var(--duration-normal) var(--ease-default)',
        ...style,
      }}
    >
      {children}
    </div>
  )
})
