import { useState, useMemo, type CSSProperties } from 'react'
import { AppProviders } from './app/AppProviders'
import { useTheme } from './context/ThemeContext'
import { useClock } from './hooks/useClock'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ClockWidget } from './components/clock/ClockWidget'
import { WorldClockWidget } from './components/worldclock/WorldClockWidget'
import { StopwatchWidget } from './components/stopwatch/StopwatchWidget'
import { CountdownWidget } from './components/countdown/CountdownWidget'
import { AlarmWidget } from './components/alarm/AlarmWidget'

type Tab = 'clock' | 'world' | 'stopwatch' | 'countdown' | 'alarms'

function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('clock')
  const clock = useClock()
  const theme = useTheme()

  const widgetStyle: CSSProperties = useMemo(() => ({
    backgroundColor: 'var(--card-bg)',
    borderRadius: 'var(--radius-card, var(--radius-md))',
    border: '1px solid var(--card-border)',
    boxShadow: 'var(--card-shadow)',
    padding: 'var(--space-card-padding, var(--space-6))',
    transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
  }), [])

  return (
      <DashboardLayout theme={theme} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'clock' && (
        <div style={widgetStyle}>
          <ClockWidget clock={clock} />
        </div>
      )}
      {activeTab === 'world' && (
        <div style={widgetStyle}>
          <WorldClockWidget clock={clock} />
        </div>
      )}
      {activeTab === 'stopwatch' && (
        <div style={widgetStyle}>
          <StopwatchWidget />
        </div>
      )}
      {activeTab === 'countdown' && (
        <div style={widgetStyle}>
          <CountdownWidget />
        </div>
      )}
      {activeTab === 'alarms' && (
        <div style={widgetStyle}>
          <AlarmWidget />
        </div>
      )}
    </DashboardLayout>
  )
}

export default function App() {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  )
}
