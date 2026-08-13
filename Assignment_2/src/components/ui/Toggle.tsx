interface ToggleProps {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  'aria-label': string
}

export function Toggle({
  pressed,
  onPressedChange,
  'aria-label': ariaLabel,
}: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={pressed}
      aria-label={ariaLabel}
      onClick={() => onPressedChange(!pressed)}
      style={{
        width: 40,
        height: 24,
        borderRadius: 12,
        border: 'none',
        backgroundColor: pressed ? 'var(--color-accent)' : 'var(--color-border)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color var(--duration-fast) var(--ease-default)',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: pressed ? 19 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left var(--duration-fast) var(--ease-default)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}
