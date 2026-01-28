import { motion } from 'framer-motion'
import { TrendingUp, Lightbulb, Calendar, MessageCircle, HelpCircle } from 'lucide-react'
import type { GameState, Habit, ChoiceCategory } from '../../gameState'
import { calculateStats, getPatternInsights, getBubbleState, BUBBLE_STATE_INFO, HABIT_LABELS } from '../../gameState'

interface InsightsViewProps {
  gameState: GameState
}

const CATEGORY_INFO = {
  rest: { label: 'Voor jezelf', color: 'var(--color-green)', description: 'rust, pauze, me-time' },
  work: { label: 'Verplichtingen', color: 'var(--color-primary)', description: 'school, huiswerk, taken' },
  social: { label: 'Voor anderen', color: '#F472B6', description: 'vrienden, familie, helpen' },
  scroll: { label: 'Scrollen', color: 'var(--color-orange)', description: 'telefoon, social media' },
}

// Get habit-specific insights
function getHabitInsights(habits: Habit[], choices: GameState['choices'], stats: ReturnType<typeof calculateStats>): string[] {
  const insights: string[] = []
  const total = choices.length

  if (habits.includes('less-phone') && stats.scroll >= 2) {
    insights.push('Je greep regelmatig naar je telefoon. Dit is precies het patroon waar je aan wilt werken.')
  }

  if (habits.includes('take-breaks') && stats.rest < total * 0.2) {
    insights.push('Je nam weinig pauzes deze dagen. Rust helpt je brein om informatie te verwerken.')
  }

  if (habits.includes('me-time') && stats.social > stats.rest) {
    insights.push('Je koos vaker voor anderen dan voor jezelf. Wat heb jij nodig?')
  }

  if (habits.includes('finish-tasks') && stats.work >= total * 0.3) {
    insights.push('Je maakte tijd voor je verplichtingen. Dat geeft rust in je hoofd.')
  }

  if (habits.includes('more-exercise') && stats.rest > 0) {
    insights.push('Je maakte bewust tijd voor lichamelijke activiteit. Beweging geeft energie.')
  }

  return insights.slice(0, 2)
}

// Calculate balance score per day
function getDayBalanceScore(choices: { category: ChoiceCategory }[]): number {
  const stats = { rest: 0, work: 0, social: 0, scroll: 0 }
  choices.forEach(c => {
    if (c.category !== 'neutral') stats[c.category]++
  })

  const total = Object.values(stats).reduce((a, b) => a + b, 0)
  if (total === 0) return 50

  // Balance is best when categories are somewhat equal
  const ideal = total / 3 // rest, work, social should be roughly equal
  const deviation = Math.abs(stats.rest - ideal) + Math.abs(stats.work - ideal) + Math.abs(stats.social - ideal)
  const penalty = stats.scroll * 15 // Scrolling reduces balance score

  return Math.max(0, Math.min(100, 100 - (deviation * 10) - penalty))
}

export function InsightsView({ gameState }: InsightsViewProps) {
  const isCompleted = gameState.phase === 'reflection' || gameState.phase === 'results'
  const stats = calculateStats(gameState.choices)
  const insights = getPatternInsights(gameState.choices)
  const habitInsights = getHabitInsights(gameState.selectedHabits, gameState.choices, stats)
  const bubbleState = getBubbleState(gameState.bubbleScore)
  const bubbleInfo = BUBBLE_STATE_INFO[bubbleState]

  // Calculate totals
  const displayCategories = ['rest', 'work', 'social', 'scroll'] as const
  const total = displayCategories.reduce((sum, cat) => sum + stats[cat], 0)

  // Calculate day-by-day balance (mock based on progress through scenes)
  const day1Choices = gameState.choices.slice(0, Math.ceil(gameState.choices.length / 3))
  const day2Choices = gameState.choices.slice(Math.ceil(gameState.choices.length / 3), Math.ceil(gameState.choices.length * 2 / 3))
  const day3Choices = gameState.choices.slice(Math.ceil(gameState.choices.length * 2 / 3))

  const dayScores = [
    getDayBalanceScore(day1Choices),
    getDayBalanceScore(day2Choices),
    getDayBalanceScore(day3Choices),
  ]

  // Determine which day had best balance
  const bestDay = dayScores.indexOf(Math.max(...dayScores)) + 1
  const worstDay = dayScores.indexOf(Math.min(...dayScores)) + 1

  // If demo is still in progress
  if (!isCompleted) {
    return (
      <div className="view-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="view-content"
        >
          {/* Bubble Header */}
          <div className="insights-bubble-header">
            <motion.div
              className="bubble-indicator"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  `0 0 20px ${bubbleInfo.glowColor}`,
                  `0 0 30px ${bubbleInfo.glowColor}`,
                  `0 0 20px ${bubbleInfo.glowColor}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ backgroundColor: bubbleInfo.color }}
            />
            <div className="bubble-header-text">
              <h2 style={{ color: bubbleInfo.color }}>{bubbleInfo.label}</h2>
              <p>Je dag is nog bezig...</p>
            </div>
          </div>

          {/* Partial Progress */}
          {gameState.choices.length > 0 && (
            <section className="insights-section">
              <h3 className="insights-section-title">
                <TrendingUp size={16} />
                Tot nu toe
              </h3>
              <div className="quick-stats">
                {displayCategories.map(cat => (
                  stats[cat] > 0 && (
                    <div key={cat} className="quick-stat-item">
                      <span className="quick-stat-value" style={{ color: CATEGORY_INFO[cat].color }}>
                        {stats[cat]}×
                      </span>
                      <span className="quick-stat-label">{CATEGORY_INFO[cat].label}</span>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          <p className="insights-progress-hint">
            Speel verder om je volledige patroon te ontdekken.
          </p>
        </motion.div>
      </div>
    )
  }

  // Dominant category
  const dominantCategory = displayCategories.reduce((a, b) =>
    stats[a] > stats[b] ? a : b
  )
  const dominantPercentage = total > 0 ? Math.round((stats[dominantCategory] / total) * 100) : 0

  // Full insights after completion
  return (
    <div className="view-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="view-content insights-full"
      >
        {/* Bubble Summary Header */}
        <section className="insights-bubble-summary">
          <motion.div
            className="bubble-summary-visual"
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                `0 0 30px ${bubbleInfo.glowColor}`,
                `0 0 50px ${bubbleInfo.glowColor}`,
                `0 0 30px ${bubbleInfo.glowColor}`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundColor: bubbleInfo.color }}
          />
          <div className="bubble-summary-text">
            <h1>Je Balans: <span style={{ color: bubbleInfo.color }}>{bubbleInfo.label}</span></h1>
            <p className="bubble-summary-insight">
              {dominantPercentage > 40
                ? `Je koos ${dominantPercentage}% van de tijd voor ${CATEGORY_INFO[dominantCategory].description}.`
                : 'Je keuzes waren redelijk verdeeld over verschillende categorieën.'
              }
            </p>
          </div>
        </section>

        {/* Category Distribution */}
        <section className="insights-section">
          <h2 className="insights-section-title">
            <TrendingUp size={18} />
            Waar ging je tijd naartoe?
          </h2>

          <div className="category-breakdown">
            {displayCategories.map(cat => {
              const percentage = total > 0 ? Math.round((stats[cat] / total) * 100) : 0
              return (
                <motion.div
                  key={cat}
                  className="category-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="category-info">
                    <span className="category-name">{CATEGORY_INFO[cat].label}</span>
                    <span className="category-desc">{CATEGORY_INFO[cat].description}</span>
                  </div>
                  <div className="category-bar-wrapper">
                    <motion.div
                      className="category-bar-fill"
                      style={{ backgroundColor: CATEGORY_INFO[cat].color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                  <span className="category-percentage">{percentage}%</span>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Day Comparison */}
        <section className="insights-section">
          <h2 className="insights-section-title">
            <Calendar size={18} />
            Balans per Dag
          </h2>

          <div className="day-comparison">
            {['Donderdag', 'Vrijdag', 'Weekend'].map((day, index) => (
              <motion.div
                key={day}
                className="day-score"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <span className="day-label">{day}</span>
                <div className="day-score-bar">
                  <motion.div
                    className="day-score-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${dayScores[index]}%` }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    style={{
                      background: dayScores[index] > 60
                        ? 'var(--color-green)'
                        : dayScores[index] > 40
                          ? 'var(--color-orange)'
                          : 'var(--color-red)'
                    }}
                  />
                </div>
                <span className="day-score-value">{dayScores[index]}%</span>
              </motion.div>
            ))}
          </div>

          <p className="day-comparison-note">
            {bestDay !== worstDay
              ? `Dag ${bestDay} was je meest gebalanceerde dag.`
              : 'Je balans was consistent door de week.'
            }
          </p>
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
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <p>{insight}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Habit-specific Insights */}
        {habitInsights.length > 0 && (
          <section className="insights-section insights-habit-section">
            <h2 className="insights-section-title">
              <MessageCircle size={18} />
              Over jouw doelen
            </h2>

            <div className="habit-goals">
              {gameState.selectedHabits.slice(0, 3).map(habit => (
                <span key={habit} className="habit-tag">{HABIT_LABELS[habit]}</span>
              ))}
            </div>

            <div className="insight-cards">
              {habitInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  className="insight-card habit-insight"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <p>{insight}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Bubble's Reflection */}
        <section className="insights-bubble-reflection">
          <motion.div
            className="bubble-reflection-icon"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundColor: bubbleInfo.color }}
          />
          <div className="bubble-reflection-content">
            <p className="reflection-intro">Dit is geen rapport. Dit is een spiegel.</p>
            <p className="reflection-message">
              {stats.social > stats.rest
                ? `Ik zie dat je vaak voor anderen koos. Wat zegt dat over wat jij belangrijk vindt?`
                : stats.scroll >= total * 0.3
                  ? `Je greep geregeld naar je telefoon. Was dat bewust of automatisch?`
                  : stats.rest >= total * 0.3
                    ? `Je maakte ruimte voor rust. Hoe voelde dat?`
                    : `Je had een gevarieerde dag. Wat gaf je de meeste energie?`
              }
            </p>
          </div>
        </section>

        {/* Reflection Questions */}
        <section className="insights-section">
          <h2 className="insights-section-title">
            <HelpCircle size={18} />
            Vragen om over na te denken
          </h2>

          <div className="reflection-questions">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Wanneer koos je echt voor jezelf?
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Welke keuze zou je nu anders maken?
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Wat hielp je het meest om balans te vinden?
            </motion.p>
          </div>
        </section>

        {/* Total Points */}
        <div className="insights-total">
          <span className="insights-total-label">Totaal verdiend</span>
          <span className="insights-total-value">{gameState.points} balanspunten</span>
        </div>
      </motion.div>
    </div>
  )
}
