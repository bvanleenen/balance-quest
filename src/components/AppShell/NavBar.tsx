import { motion } from 'framer-motion'
import { Home, BarChart3, User, Settings } from 'lucide-react'

export type TabId = 'home' | 'insights' | 'profile' | 'settings'

interface NavBarProps {
  activeTab?: TabId
  onTabChange?: (tab: TabId) => void
}

const NAV_ICONS = {
  home: <Home size={20} />,
  insights: <BarChart3 size={20} />,
  profile: <User size={20} />,
  settings: <Settings size={20} />,
}

export function NavBar({ activeTab = 'home', onTabChange }: NavBarProps) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'insights', label: 'Inzichten' },
    { id: 'profile', label: 'Profiel' },
    { id: 'settings', label: 'Instellingen' },
  ] as const

  return (
    <nav className="nav-bar">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`nav-bar-item ${activeTab === tab.id ? 'active' : ''}`}
          aria-label={tab.label}
          onClick={() => onTabChange?.(tab.id)}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <span>{NAV_ICONS[tab.id]}</span>
          <span className="nav-bar-item-label">{tab.label}</span>
        </motion.button>
      ))}
    </nav>
  )
}
