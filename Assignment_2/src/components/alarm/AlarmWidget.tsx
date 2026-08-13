import { useState } from 'react'
import { useAlarm, type Alarm } from '../../hooks/useAlarm'
import { Trash2 } from 'lucide-react'

const SOUND_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'digital', label: 'Digital' },
  { value: 'gentle', label: 'Gentle' },
  { value: 'bell', label: 'Bell' },
]

const RECURRENCE_OPTIONS = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
]

interface AlarmFormProps {
  onSave: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

function AlarmForm({ onSave, onCancel }: AlarmFormProps) {
  const [label, setLabel] = useState('Alarm')
  const [hour, setHour] = useState(8)
  const [minute, setMinute] = useState(0)
  const [recurrence, setRecurrence] = useState<string>('daily')
  const [sound, setSound] = useState('classic')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!label.trim()) { setError('Label is required'); return }
    if (label.length > 50) { setError('Label too long'); return }
    setError('')
    onSave({
      label: label.trim(),
      hour,
      minute,
      enabled: true,
      recurrence: recurrence as Alarm['recurrence'],
      days: [],
      sound,
      volume: 1,
      snoozeDuration: 5,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-sm)',
            outline: 'none',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Hour</label>
          <input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(Number(e.target.value))}
            style={{
              width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', outline: 'none',
              fontFamily: 'var(--font-mono)',
            }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Minute</label>
          <input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(Number(e.target.value))}
            style={{
              width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', outline: 'none',
              fontFamily: 'var(--font-mono)',
            }} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Repeat</label>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {RECURRENCE_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setRecurrence(opt.value)}
              style={{
                padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)',
                border: `1px solid ${recurrence === opt.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                backgroundColor: recurrence === opt.value ? 'var(--color-accent-light)' : 'transparent',
                color: recurrence === opt.value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 500,
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Sound</label>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {SOUND_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setSound(opt.value)}
              style={{
                padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)',
                border: `1px solid ${sound === opt.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                backgroundColor: sound === opt.value ? 'var(--color-accent-light)' : 'transparent',
                color: sound === opt.value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 500,
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
        <button onClick={onCancel}
          style={{
            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)', backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 'var(--text-sm)',
          }}>
          Cancel
        </button>
        <button onClick={handleSubmit}
          style={{
            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
            border: 'none', backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-text)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
          }}>
          Save Alarm
        </button>
      </div>
    </div>
  )
}

export function AlarmWidget() {
  const alarmApi = useAlarm()
  const [showForm, setShowForm] = useState(false)

  const sortedAlarms = [...alarmApi.alarms].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute))

  return (
    <div style={{ padding: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Alarms
        </h3>
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: 32, height: 32, borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)',
            border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {showForm && (
        <div style={{
          marginBottom: 'var(--space-4)', padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-secondary)',
        }}>
          <AlarmForm
            onSave={(alarm) => { alarmApi.addAlarm(alarm); setShowForm(false) }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {alarmApi.nextAlarm && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-3)',
          borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-accent-light)',
          border: '1px solid var(--color-accent)',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 600, marginBottom: 2 }}>
            Next Alarm
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
            {String(alarmApi.nextAlarm.hour).padStart(2, '0')}:{String(alarmApi.nextAlarm.minute).padStart(2, '0')} — {alarmApi.nextAlarm.label}
          </p>
        </div>
      )}

      {sortedAlarms.length === 0 && !showForm && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6)' }}>
          No alarms set. Tap + to create one.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {sortedAlarms.map((alarm) => (
          <div
            key={alarm.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-light)',
              opacity: alarm.enabled ? 1 : 0.5,
            }}
          >
            <div>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {alarm.label} · {alarm.recurrence}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                onClick={() => alarmApi.toggleAlarm(alarm.id)}
                style={{
                  width: 40, height: 24, borderRadius: 12, border: 'none',
                  backgroundColor: alarm.enabled ? 'var(--color-accent)' : 'var(--color-border)',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}
                aria-label={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
              >
                <span style={{
                  position: 'absolute', top: 3, left: alarm.enabled ? 19 : 3,
                  width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
              <button
                onClick={() => alarmApi.deleteAlarm(alarm.id)}
                style={{
                  width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                  border: 'none', backgroundColor: 'transparent',
                  color: 'var(--color-text-muted)', cursor: 'pointer',
                  fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Delete alarm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
