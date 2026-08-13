import React from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
  children: React.ReactNode
  'aria-label'?: string
}

export function Drawer({ isOpen, onClose, side = 'right', children, 'aria-label': ariaLabel }: DrawerProps) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || 'Panel'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        display: 'flex',
        justifyContent: side === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          animation: 'fadeIn var(--duration-fast) var(--ease-default)',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: 360,
          height: '100%',
          backgroundColor: 'var(--color-bg-card)',
          boxShadow: 'var(--shadow-xl)',
          overflowY: 'auto',
          animation: 'slideInLeft var(--duration-normal) var(--ease-out)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--space-3)' }}>
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
