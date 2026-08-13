import React from 'react'

interface CardHeaderProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export const CardHeader = React.memo(function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
        ...style,
      }}
    >
      {children}
    </div>
  )
})
