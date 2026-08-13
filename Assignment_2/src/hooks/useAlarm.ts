import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

export interface Alarm {
  id: string
  label: string
  hour: number
  minute: number
  enabled: boolean
  recurrence: 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom'
  days: number[]
  sound: string
  volume: number
  snoozeDuration: number
  createdAt: number
}

interface AlarmAPI {
  alarms: Alarm[]
  ringingAlarm: Alarm | null
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void
  updateAlarm: (id: string, updates: Partial<Alarm>) => void
  deleteAlarm: (id: string) => void
  toggleAlarm: (id: string) => void
  dismissAlarm: () => void
  snoozeAlarm: (minutes: number) => void
  nextAlarm: Alarm | null
}

function generateId(): string {
  return `alarm_${Math.random().toString(36).slice(2, 10)}`
}

export function useAlarm(): AlarmAPI {
  const [alarms, setAlarms] = useLocalStorage<Alarm[]>(STORAGE_KEYS.ALARMS, [])
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null)

  const addAlarm = useCallback((alarm: Omit<Alarm, 'id' | 'createdAt'>) => {
    const newAlarm: Alarm = { ...alarm, id: generateId(), createdAt: Date.now() }
    setAlarms((prev) => [...prev, newAlarm])
  }, [setAlarms])

  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }, [setAlarms])

  const deleteAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id))
    setRingingAlarm((prev) => (prev?.id === id ? null : prev))
  }, [setAlarms])

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
  }, [setAlarms])

  const dismissAlarm = useCallback(() => {
    setRingingAlarm(null)
  }, [])

  const snoozeAlarm = useCallback((minutes: number) => {
    if (!ringingAlarm) return
    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000)
    const snoozeAlarmEntry: Alarm = {
      ...ringingAlarm,
      id: generateId(),
      hour: snoozedUntil.getHours(),
      minute: snoozedUntil.getMinutes(),
      recurrence: 'once',
      days: [],
      enabled: true,
      createdAt: Date.now(),
    }
    setAlarms((prev) => [...prev, snoozeAlarmEntry])
    setRingingAlarm(null)
  }, [ringingAlarm, setAlarms])

  const nextAlarm = alarms
    .filter((a) => a.enabled)
    .sort((a, b) => {
      const now = new Date()
      const aDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), a.hour, a.minute)
      const bDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), b.hour, b.minute)
      if (aDate <= now) aDate.setDate(aDate.getDate() + 1)
      if (bDate <= now) bDate.setDate(bDate.getDate() + 1)
      return aDate.getTime() - bDate.getTime()
    })[0] || null

  return {
    alarms,
    ringingAlarm,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    dismissAlarm,
    snoozeAlarm,
    nextAlarm,
  }
}
