import { useStopwatch } from '../../hooks/useStopwatch'
import { formatMs } from '../../utils/time'
import { Star, ArrowDown } from 'lucide-react'

export function StopwatchWidget() {
  const sw = useStopwatch()

  return (
    <div style={{ padding: 'var(--space-2)' }}>
      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
        Stopwatch
      </h3>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-4xl)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        textAlign: 'center',
        padding: 'var(--space-4)',
        letterSpacing: '0.05em',
      }}>
        {formatMs(sw.elapsedMs, true)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        {!sw.isRunning ? (
          <button
            onClick={sw.elapsedMs > 0 ? sw.resume : sw.start}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-text)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
            }}
          >
            {sw.elapsedMs > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={sw.pause}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-warning)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
            }}
          >
            Pause
          </button>
        )}
        <button
          onClick={sw.recordLap}
          disabled={!sw.isRunning}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            fontWeight: 500,
            cursor: sw.isRunning ? 'pointer' : 'not-allowed',
            opacity: sw.isRunning ? 1 : 0.5,
            fontSize: 'var(--text-sm)',
          }}
        >
          Lap
        </button>
        <button
          onClick={sw.reset}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-error)',
            backgroundColor: 'transparent',
            color: 'var(--color-error)',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
          }}
        >
          Reset
        </button>
      </div>

      {sw.laps.length > 0 && (
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            Laps ({sw.laps.length})
          </p>
          <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...sw.laps].reverse().map((lap) => {
              const isBest = sw.bestLap && lap.splitMs === sw.bestLap.splitMs
              const isWorst = sw.worstLap && lap.splitMs === sw.worstLap.splitMs
              return (
                <div
                  key={lap.number}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isBest ? 'rgba(16,185,129,0.1)' : isWorst ? 'rgba(239,68,68,0.1)' : 'transparent',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-secondary)' }}>
                    Lap {lap.number}
                    {isBest && <Star size={12} color="var(--color-success)" fill="var(--color-success)" />}
                    {isWorst && <ArrowDown size={12} color="var(--color-error)" />}
                  </span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{formatMs(lap.splitMs, true)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
