import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  style?: React.CSSProperties
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 'var(--radius-sm)',
  style,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="animate-skeleton"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-border)',
        ...style,
      }}
    />
  )
}
