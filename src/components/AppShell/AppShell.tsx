import type { ReactNode } from 'react'
import { NavBar, type TabId } from './NavBar'

interface AppShellProps {
  children: ReactNode
  showNavBar?: boolean
  showStatusBar?: boolean
  activeTab?: TabId
  onTabChange?: (tab: TabId) => void
}

export function AppShell({
  children,
  showNavBar = false,
  activeTab = 'home',
  onTabChange,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <main className={`app-content ${!showNavBar ? 'no-nav' : ''}`}>
        {children}
      </main>

      {showNavBar && <NavBar activeTab={activeTab} onTabChange={onTabChange} />}
    </div>
  )
}

export { NavBar, type TabId } from './NavBar'
