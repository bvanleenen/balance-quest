import { motion } from 'framer-motion'
import { Check, RotateCcw, Award, Target, Coffee, Moon, Users, Sunrise } from 'lucide-react'
import type { GameState } from '../../gameState'
import { getBubbleState, BUBBLE_STATE_INFO, BADGES } from '../../gameState'

interface CompletedHomeViewProps {
  gameState: GameState
  onRestart: () => void
}

// Map badge icons to Lucide components
const BADGE_ICON_MAP: Record<string, React.ReactNode> = {
  Target: <Target size={18} />,
  Coffee: <Coffee size={18} />,
  Moon: <Moon size={18} />,
  Users: <Users size={18} />,
  Sunrise: <Sunrise size={18} />,
}

export function CompletedHomeView({ gameState, onRestart }: CompletedHomeViewProps) {
  const bubbleState = getBubbleState(gameState.bubbleScore)
  const bubbleInfo = BUBBLE_STATE_INFO[bubbleState]
  const earnedBadges = gameState.badges.map(id => BADGES[id as keyof typeof BADGES]).filter(Boolean)

  const completionMessages: Record<typeof bubbleState, string> = {
    energetic: 'Geweldig! Je dag zat vol goede keuzes.',
    content: 'Mooi gedaan! Je vond een fijne balans.',
    attention: 'Je maakte bewuste keuzes. Dat is al winst.',
    tired: 'Moe maar klaar. Rust is ook belangrijk.',
    outOfBalance: 'Een uitdagende dag. Morgen is nieuw.',
  }

  return (
    <div className="view-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="view-content completed-home"
      >
        {/* Completion Header */}
        <div className="completion-header">
          <motion.div
            className="completion-check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Check size={32} />
          </motion.div>
          <h1 className="completion-title">Dag Voltooid!</h1>
          <p className="completion-subtitle">
            {completionMessages[bubbleState]}
          </p>
        </div>

        {/* Summary Card */}
        <motion.div
          className="summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="summary-row">
            <span className="summary-label">Speler</span>
            <span className="summary-value">{gameState.playerName}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Bubble Status</span>
            <span className="summary-value" style={{ color: bubbleInfo.color }}>
              <span className="summary-dot" style={{ backgroundColor: bubbleInfo.color }} />
              {bubbleInfo.label}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Keuzes Gemaakt</span>
            <span className="summary-value">{gameState.choices.length}</span>
          </div>

          <div className="summary-row highlight">
            <span className="summary-label">Balanspunten</span>
            <span className="summary-value points">{gameState.points}</span>
          </div>
        </motion.div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <motion.div
            className="badges-summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Behaalde Badges</h3>
            <div className="badges-row">
              {earnedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className="badge-mini"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  title={badge.name}
                >
                  {BADGE_ICON_MAP[badge.icon] || <Award size={18} />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* What is Balance Quest */}
        <motion.div
          className="bq-explanation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Dit was Balance Quest</h3>
          <ul>
            <li><Check size={14} /> Bewustwording zonder oordeel</li>
            <li><Check size={14} /> Patronen, niet losse momenten</li>
            <li><Check size={14} /> Positieve meldingen die helpen</li>
            <li><Check size={14} /> Jouw doelen, jouw tempo</li>
          </ul>
        </motion.div>

        {/* Thank You */}
        <motion.div
          className="thank-you"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>Bedankt voor het spelen, {gameState.playerName}!</p>
          <span className="credits">Meesterproef door Mio van Leenen</span>
        </motion.div>

        {/* Restart Button */}
        <motion.button
          className="btn btn-primary restart-btn"
          onClick={onRestart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw size={18} />
          Opnieuw spelen
        </motion.button>
      </motion.div>
    </div>
  )
}
