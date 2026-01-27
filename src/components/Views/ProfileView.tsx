import { motion } from 'framer-motion'
import { Smartphone, Coffee, Moon, Heart, Activity, CheckSquare, Target, Users, Sunrise, Award, Lock } from 'lucide-react'
import type { GameState, Habit } from '../../gameState'
import { HABIT_LABELS, BADGES, getBubbleState, BUBBLE_STATE_INFO } from '../../gameState'

interface ProfileViewProps {
  gameState: GameState
}

// Map habit icons to Lucide components
const HABIT_ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={18} />,
  Coffee: <Coffee size={18} />,
  Moon: <Moon size={18} />,
  Heart: <Heart size={18} />,
  Activity: <Activity size={18} />,
  CheckSquare: <CheckSquare size={18} />,
}

// Map badge icons to Lucide components
const BADGE_ICON_MAP: Record<string, React.ReactNode> = {
  Target: <Target size={20} />,
  Coffee: <Coffee size={20} />,
  Moon: <Moon size={20} />,
  Users: <Users size={20} />,
  Sunrise: <Sunrise size={20} />,
}

const HABIT_ICONS: Record<Habit, string> = {
  'less-phone': 'Smartphone',
  'take-breaks': 'Coffee',
  'sleep-on-time': 'Moon',
  'me-time': 'Heart',
  'more-exercise': 'Activity',
  'finish-tasks': 'CheckSquare',
}

export function ProfileView({ gameState }: ProfileViewProps) {
  const bubbleState = getBubbleState(gameState.bubbleScore)
  const bubbleInfo = BUBBLE_STATE_INFO[bubbleState]
  const allBadges = Object.values(BADGES)
  const earnedBadgeIds = new Set(gameState.badges)

  return (
    <div className="view-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="view-content"
      >
        {/* Profile Header with Bubble */}
        <div className="profile-header">
          <div
            className="profile-bubble-indicator"
            style={{ backgroundColor: bubbleInfo.color, boxShadow: `0 0 20px ${bubbleInfo.glowColor}` }}
          />
          <div className="profile-info">
            <h1 className="profile-name">{gameState.playerName || 'Speler'}</h1>
            <span className="profile-bubble-status" style={{ color: bubbleInfo.color }}>
              {bubbleInfo.label}
            </span>
          </div>
          <div className="profile-points">
            <span className="profile-points-value">{gameState.points}</span>
            <span className="profile-points-label">punten</span>
          </div>
        </div>

        {/* Goals / Selected Habits */}
        <section className="profile-section">
          <h2 className="profile-section-title">Mijn Doelen</h2>

          {gameState.selectedHabits.length > 0 ? (
            <div className="goals-grid">
              {gameState.selectedHabits.map((habit, index) => (
                <motion.div
                  key={habit}
                  className="goal-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="goal-icon">
                    {HABIT_ICON_MAP[HABIT_ICONS[habit]]}
                  </div>
                  <span className="goal-label">{HABIT_LABELS[habit]}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="profile-empty">Nog geen doelen gekozen</p>
          )}
        </section>

        {/* Badges */}
        <section className="profile-section">
          <h2 className="profile-section-title">Mijn Badges</h2>

          <div className="badge-grid">
            {allBadges.map((badge, index) => {
              const isEarned = earnedBadgeIds.has(badge.id)
              return (
                <motion.div
                  key={badge.id}
                  className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="badge-card-icon">
                    {isEarned ? (
                      BADGE_ICON_MAP[badge.icon] || <Award size={20} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>
                  <div className="badge-card-info">
                    <span className="badge-card-name">{badge.name}</span>
                    {isEarned ? (
                      <span className="badge-card-description">{badge.description}</span>
                    ) : (
                      <span className="badge-card-locked">Nog te verdienen</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Motivational Quote */}
        <motion.div
          className="profile-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>"Balans ziet er voor iedereen anders uit."</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
