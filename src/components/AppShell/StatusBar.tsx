import { useState, useEffect } from 'react'

interface StatusBarProps {
  simulatedTime?: string // e.g., "16:30" for the simulation
}

export function StatusBar({ simulatedTime }: StatusBarProps) {
  const [realTime, setRealTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setRealTime(
        now.toLocaleTimeString('nl-NL', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const displayTime = simulatedTime || realTime

  return (
    <div className="status-bar">
      <span className="status-bar-time">{displayTime}</span>
      <div className="status-bar-icons">
        <span style={{ fontSize: '12px' }}>5G</span>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="6" width="3" height="6" rx="1" opacity="0.3" />
          <rect x="4" y="4" width="3" height="8" rx="1" opacity="0.5" />
          <rect x="8" y="2" width="3" height="10" rx="1" opacity="0.7" />
          <rect x="12" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
          <rect x="22" y="3.5" width="2" height="5" rx="1" />
          <rect x="2" y="3" width="17" height="6" rx="1" fill="#34D399" />
        </svg>
      </div>
    </div>
  )
}
