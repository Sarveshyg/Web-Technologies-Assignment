import React from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import { SoundProvider } from '../context/SoundContext'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SoundProvider>
        {children}
      </SoundProvider>
    </ThemeProvider>
  )
}
