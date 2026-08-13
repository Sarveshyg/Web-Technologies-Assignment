import type { ThemeContextState } from '../../types/theme'
import { Clock, Globe, Timer, Hourglass, Bell, Sun, Moon } from 'lucide-react'

type Tab = 'clock' | 'world' | 'stopwatch' | 'countdown' | 'alarms'

interface DashboardLayoutProps {
  theme: ThemeContextState
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  children: React.ReactNode
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'clock', label: 'Clock', icon: <Clock size={20} /> },
  { key: 'world', label: 'World', icon: <Globe size={20} /> },
  { key: 'stopwatch', label: 'Stopwatch', icon: <Timer size={20} /> },
  { key: 'countdown', label: 'Timer', icon: <Hourglass size={20} /> },
  { key: 'alarms', label: 'Alarms', icon: <Bell size={20} /> },
]

export function DashboardLayout({ theme, activeTab, onTabChange, children }: DashboardLayoutProps) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-primary)',
      transition: 'background-color 0.3s',
    }}>
      <aside style={{
        width: 64,
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-3) 0',
        gap: 'var(--space-1)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-4)',
        }}>
          <Clock size={20} />
        </div>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            aria-label={tab.label}
            title={tab.label}
            style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === tab.key ? 'var(--color-accent-light)' : 'transparent',
              color: activeTab === tab.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => theme.setMode(theme.resolvedMode === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          title="Toggle theme"
          style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            border: 'none', cursor: 'pointer', background: 'transparent',
            color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {theme.resolvedMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', padding: 'var(--space-6)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <header style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {TABS.find((t) => t.key === activeTab)?.label || ''}
            </p>
          </header>
          {children}
        </div>
      </main>
    </div>
  )
}
