import React from 'react'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  'aria-label'?: string
}

export const ProgressRing = React.memo(function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  'aria-label': ariaLabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const offset = circumference - clampedProgress * circumference

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clampedProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || 'Progress'}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
    </div>
  )
})
