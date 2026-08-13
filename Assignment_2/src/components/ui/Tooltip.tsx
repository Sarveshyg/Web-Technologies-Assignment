import React, { useState, useRef } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const id = useRef(`tooltip-${Math.random().toString(36).slice(2, 8)}`)

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 },
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <div aria-describedby={visible ? id.current : undefined}>
        {children}
      </div>
      {visible && (
        <div
          id={id.current}
          role="tooltip"
          style={{
            position: 'absolute',
            ...positionStyles[position],
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-bg-primary)',
            fontSize: 'var(--text-xs)',
            whiteSpace: 'nowrap',
            zIndex: 'var(--z-tooltip, 1000)',
            pointerEvents: 'none',
            animation: 'fadeIn var(--duration-fast) var(--ease-default)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
