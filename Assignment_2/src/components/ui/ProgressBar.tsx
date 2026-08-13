import React from 'react'

interface ProgressBarProps {
  progress: number
  height?: number
  'aria-label'?: string
}

export const ProgressBar = React.memo(function ProgressBar({
  progress,
  height = 8,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress))

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clampedProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || 'Progress'}
      style={{
        width: '100%',
        height,
        borderRadius: height / 2,
        backgroundColor: 'var(--color-border)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${clampedProgress * 100}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: 'var(--color-accent)',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
})
