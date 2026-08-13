import React from 'react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
  size?: number
}

export const IconButton = React.memo(function IconButton({
  'aria-label': ariaLabel,
  size = 36,
  children,
  style,
  ...rest
}: IconButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
        transition: 'all var(--duration-fast) var(--ease-default)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
})
