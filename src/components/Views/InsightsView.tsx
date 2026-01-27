import { motion } from 'framer-motion'
import { TrendingUp, Clock, Lightbulb } from 'lucide-react'
import type { GameState } from '../../gameState'
import { calculateStats, getPatternInsights, getBubbleState, BUBBLE_STATE_INFO } from '../../gameState'

interface InsightsViewProps {
  gameState: GameState
}

const CATEGORY_INFO = {
  rest: { label: 'Rust', color: 'var(--color-green)', icon: '🛋️' },
  work: { label: 'Focus', color: 'var(--color-primary)', icon: '📚' },
  social: { label: 'Sociaal', color: '#F472B6', icon: '👥' },
  scroll: { label: 'Scrollen', color: 'var(--color-orange)', icon: '📱' },
}

export function InsightsView({ gameState }: InsightsViewProps) {
  const isCompleted = gameState.phase === 'reflection' || gameState.phase === 'results'
  const stats = calculateStats(gameState.choices)
  const insights = getPatternInsights(gameState.choices)
  const bubbleState = getBubbleState(gameState.bubbleScore)
  const bubbleInfo = BUBBLE_STATE_INFO[bubbleState]

  // Calculate total for percentages (excluding neutral)
  const displayCategories = ['rest', 'work', 'social', 'scroll'] as const
  const total = displayCategories.reduce((sum, cat) => sum + stats[cat], 0)

  // If demo is still in progress
  if (!isCompleted) {
    return (
      <div className="view-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="view-content insights-placeholder"
        >
          <div className="insights-in-progress">
            <Clock size={48} className="insights-clock-icon" />
            <h1 className="view-title">Je dag is nog bezig...</h1>
            <p className="insights-subtitle">
              Speel verder om je volledige patroon te ontdekken.
            </p>

            {/* Partial stats preview */}
            {gameState.choices.length > 0 && (
              <div className="insights-partial">
                <h3>Tot nu toe</h3>
                <div className="partial-stats">
                  {displayCategories.map(cat => (
                    stats[cat] > 0 && (
                      <div key={cat} className="partial-stat">
                        <span>{CATEGORY_INFO[cat].icon}</span>
                        <span>{stats[cat]}×</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Current bubble state */}
            <div className="insights-bubble-preview">
              <div
                className="bubble-dot"
                style={{ backgroundColor: bubbleInfo.color, boxShadow: `0 0 12px ${bubbleInfo.glowColor}` }}
              />
              <span style={{ color: bubbleInfo.color }}>{bubbleInfo.label}</span>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Full insights after completion
  return (
    <div className="view-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="view-content"
      >
        <h1 className="view-title">Jouw Patronen van Vandaag</h1>

        {/* Category Distribution Bar */}
        <section className="insights-section">
          <h2 className="insights-section-title">
            <TrendingUp size={18} />
            Verdeling
          </h2>

          <div className="category-bar-container">
            <div className="category-bar">
              {displayCategories.map(cat => {
                const percentage = total > 0 ? (stats[cat] / total) * 100 : 0
                if (percentage === 0) return null
                return (
                  <motion.div
                    key={cat}
                    className="category-segment"
                    style={{ backgroundColor: CATEGORY_INFO[cat].color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )
              })}
            </div>

            <div className="category-legend">
              {displayCategories.map(cat => (
                <div key={cat} className="category-legend-item">
                  <span
                    className="category-dot"
                    style={{ backgroundColor: CATEGORY_INFO[cat].color }}
                  />
                  <span className="category-label">{CATEGORY_INFO[cat].icon} {CATEGORY_INFO[cat].label}</span>
                  <span className="category-count">{stats[cat]}×</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pattern Insights */}
        {insights.length > 0 && (
          <section className="insights-section">
            <h2 className="insights-section-title">
              <Lightbulb size={18} />
              Wat valt op
            </h2>

            <div className="insight-cards">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  className="insight-card"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <span className="insight-arrow">→</span>
                  <p>{insight}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Bubble Journey */}
        <section className="insights-section">
          <h2 className="insights-section-title">Je Bubble Vandaag</h2>

          <div className="bubble-journey">
            <div className="journey-point">
              <div
                className="journey-bubble start"
                style={{ backgroundColor: 'var(--color-green)' }}
              />
              <span>Start</span>
            </div>
            <div className="journey-line" />
            <div className="journey-point">
              <div
                className="journey-bubble end"
                style={{
                  backgroundColor: bubbleInfo.color,
                  boxShadow: `0 0 16px ${bubbleInfo.glowColor}`
                }}
              />
              <span>{bubbleInfo.label}</span>
            </div>
          </div>
        </section>

        {/* Total Points */}
        <div className="insights-total">
          <span className="insights-total-label">Totaal verdiend</span>
          <span className="insights-total-value">{gameState.points} punten</span>
        </div>

        {/* Ethical reminder */}
        <motion.p
          className="insights-ethical-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Dit zijn patronen, geen oordelen. Elke dag is anders.
        </motion.p>
      </motion.div>
    </div>
  )
}
