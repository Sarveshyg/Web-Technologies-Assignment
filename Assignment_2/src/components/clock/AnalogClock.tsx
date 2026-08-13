import React from 'react'
import { getAngle } from '../../utils/time'

interface AnalogClockProps {
  hours: number
  minutes: number
  seconds: number
  size?: number
}

export const AnalogClock = React.memo(function AnalogClock({
  hours,
  minutes,
  seconds,
  size = 200,
}: AnalogClockProps) {
  const angles = getAngle(hours, minutes, seconds)
  const center = size / 2
  const handColors = {
    hour: 'var(--color-text-primary)',
    minute: 'var(--color-text-primary)',
    second: 'var(--color-accent)',
  }

  return (
    <div
      role="img"
      aria-label={`Analog clock showing ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '3px solid var(--color-border)',
        position: 'relative',
        backgroundColor: 'var(--color-bg-card)',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
        flexShrink: 0,
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i * 30 * Math.PI) / 180
        const isHour = i % 3 === 0
        const tickLen = isHour ? 12 : 6
        const tickWidth = isHour ? 2.5 : 1.5
        const innerRadius = center - (isHour ? 18 : 12)
        const x1 = center + innerRadius * Math.sin(angle)
        const y1 = center - innerRadius * Math.cos(angle)
        const x2 = center + (innerRadius + tickLen) * Math.sin(angle)
        const y2 = center - (innerRadius + tickLen) * Math.cos(angle)

        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--color-text-muted)"
            strokeWidth={tickWidth}
            strokeLinecap="round"
            style={{ position: 'absolute' }}
          />
        )
      })}

      {[12, 3, 6, 9].map((h) => {
        const angle = ((h % 12) * 30 * Math.PI) / 180
        const r = center - 28
        const x = center + r * Math.sin(angle) - 6
        const y = center - r * Math.cos(angle) + 6
        return (
          <span
            key={h}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 12,
              height: 12,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: '12px',
            }}
          >
            {h}
          </span>
        )
      })}

      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <line
          x1={center} y1={center}
          x2={center} y2={center - size * 0.28}
          stroke={handColors.hour}
          strokeWidth={4}
          strokeLinecap="round"
          transform={`rotate(${angles.hour}, ${center}, ${center})`}
          style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <line
          x1={center} y1={center}
          x2={center} y2={center - size * 0.38}
          stroke={handColors.minute}
          strokeWidth={3}
          strokeLinecap="round"
          transform={`rotate(${angles.minute}, ${center}, ${center})`}
          style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <line
          x1={center} y1={center}
          x2={center} y2={center - size * 0.42}
          stroke={handColors.second}
          strokeWidth={1.5}
          strokeLinecap="round"
          transform={`rotate(${angles.second}, ${center}, ${center})`}
        />
        <circle cx={center} cy={center} r={4} fill={handColors.second} />
      </svg>
    </div>
  )
})
