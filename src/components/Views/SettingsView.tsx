import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Moon, Info, RotateCcw, Heart, Target, Users } from 'lucide-react'

interface SettingsViewProps {
  onRestart: () => void
}

export function SettingsView({ onRestart }: SettingsViewProps) {
  // Demo toggles (visual only, no persistence)
  const [pauseReminders, setPauseReminders] = useState(true)
  const [bubbleNotifications, setBubbleNotifications] = useState(true)
  const [dailySummary, setDailySummary] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="view-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="view-content"
      >
        <h1 className="view-title">Instellingen</h1>

        {/* Notification Preferences */}
        <section className="settings-section">
          <h2 className="settings-section-title">
            <Bell size={18} />
            Meldingen
          </h2>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Pauze herinneringen</span>
              <span className="setting-description">Signalen om even te stoppen</span>
            </div>
            <ToggleSwitch checked={pauseReminders} onChange={setPauseReminders} />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Bubble status meldingen</span>
              <span className="setting-description">Updates over je balans</span>
            </div>
            <ToggleSwitch checked={bubbleNotifications} onChange={setBubbleNotifications} />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Dagelijkse samenvatting</span>
              <span className="setting-description">Patroon overzicht aan het eind van de dag</span>
            </div>
            <ToggleSwitch checked={dailySummary} onChange={setDailySummary} />
          </div>
        </section>

        {/* Theme */}
        <section className="settings-section">
          <h2 className="settings-section-title">
            <Moon size={18} />
            Thema
          </h2>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Dark mode</span>
              <span className="setting-description">Donkere interface</span>
            </div>
            <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
          </div>
        </section>

        {/* About Balance Quest */}
        <section className="settings-section">
          <h2 className="settings-section-title">
            <Info size={18} />
            Over Balance Quest
          </h2>

          <div className="about-card">
            <p className="about-intro">
              Balance Quest is gebaseerd op <strong>ethische gamification</strong> principes.
            </p>

            <div className="principle-list">
              <div className="principle-item">
                <div className="principle-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                  <Target size={16} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <strong>Core Drive 2</strong>
                  <span>Development & Accomplishment (Octalysis)</span>
                </div>
              </div>

              <div className="principle-item">
                <div className="principle-icon" style={{ background: 'rgba(52, 211, 153, 0.2)' }}>
                  <Heart size={16} style={{ color: 'var(--color-green)' }} />
                </div>
                <div>
                  <strong>Autonomie</strong>
                  <span>Jij bepaalt je eigen doelen</span>
                </div>
              </div>

              <div className="principle-item">
                <div className="principle-icon" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                  <Target size={16} style={{ color: 'var(--color-orange)' }} />
                </div>
                <div>
                  <strong>Competentie</strong>
                  <span>Groei zichtbaar maken zonder druk</span>
                </div>
              </div>

              <div className="principle-item">
                <div className="principle-icon" style={{ background: 'rgba(244, 114, 182, 0.2)' }}>
                  <Users size={16} style={{ color: '#F472B6' }} />
                </div>
                <div>
                  <strong>Verbondenheid</strong>
                  <span>Je bubble begrijpt je ritme</span>
                </div>
              </div>
            </div>

            <p className="about-no-manipulation">
              Geen manipulatie: geen harde streaks, FOMO, of schuldinducerende meldingen.
            </p>
          </div>
        </section>

        {/* Reset */}
        <section className="settings-section">
          <button
            className="reset-button"
            onClick={onRestart}
          >
            <RotateCcw size={18} />
            Opnieuw beginnen
          </button>
        </section>

        {/* Credits */}
        <footer className="settings-footer">
          <p>Meesterproef door Mio van Leenen</p>
          <p className="version">Balance Quest Demo v1.0</p>
        </footer>
      </motion.div>
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <motion.button
      className={`toggle-switch ${checked ? 'active' : ''}`}
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.95 }}
      aria-pressed={checked}
    >
      <motion.div
        className="toggle-thumb"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}
