import { motion } from 'framer-motion'
import { Check, Target, Coffee, Moon, Users, Sunrise, Award } from 'lucide-react'
import type { GameState } from '../gameState'
import { getBubbleState, calculateStats, getPatternInsights, BADGES, BUBBLE_STATE_INFO } from '../gameState'

// Map icon names to Lucide components
const BADGE_ICONS: Record<string, React.ReactNode> = {
  Target: <Target size={20} />,
  Coffee: <Coffee size={20} />,
  Moon: <Moon size={20} />,
  Users: <Users size={20} />,
  Sunrise: <Sunrise size={20} />,
}

interface ResultsProps {
  gameState: GameState
  onRestart: () => void
}

export function ReflectionScreen({ gameState, onContinue }: { gameState: GameState; onContinue: () => void }) {
  const stats = calculateStats(gameState.choices)
  const bubbleState = getBubbleState(gameState.bubbleScore)
  const insights = getPatternInsights(gameState.choices)

  const bubbleMessages = {
    energetic: 'Wow, je dag was vol energie en goede keuzes!',
    content: 'Je hebt een mooie mix gevonden tussen verschillende gebieden.',
    attention: 'Sommige gebieden kregen minder aandacht. Geen oordeel - gewoon een signaal.',
    tired: 'Je voelde je wat moe vandaag. Dat is oké, morgen is een nieuwe dag.',
    outOfBalance: 'Je balans was vandaag uit evenwicht. Dat gebeurt. Morgen is een nieuwe kans.',
  }

  return (
    <div className="flex-col p-lg text-center" style={{ minHeight: '100%' }}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 'var(--space-lg)',
        }}
      >
        Jouw Balans
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        {gameState.playerName}, dit was jouw dag:
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <StatBadge label="Rust" count={stats.rest} color="var(--color-green)" />
        <StatBadge label="Focus" count={stats.work} color="var(--color-primary)" />
        <StatBadge label="Sociaal" count={stats.social} color="#F472B6" />
      </motion.div>

      {/* Bubble state message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
        style={{
          marginBottom: 'var(--space-lg)',
          maxWidth: '340px',
          margin: '0 auto var(--space-lg)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-sm)',
        }}>
          <span style={{ color: BUBBLE_STATE_INFO[bubbleState].color, fontSize: '20px' }}>●</span>
          <span style={{
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-sm)',
          }}>
            {BUBBLE_STATE_INFO[bubbleState].label}
          </span>
        </div>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-base)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {bubbleMessages[bubbleState]}
        </p>
      </motion.div>

      {/* Pattern insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginBottom: 'var(--space-lg)',
            maxWidth: '340px',
            margin: '0 auto var(--space-lg)',
          }}
        >
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-sm)',
          }}>
            Wat valt op:
          </p>
          <div className="flex-col gap-sm">
            {insights.map((insight, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-sm)',
                  textAlign: 'left',
                }}
              >
                <span style={{ color: 'var(--color-primary)' }}>→</span>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                }}>
                  {insight}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-size-sm)',
          fontStyle: 'italic',
          marginBottom: 'var(--space-xl)',
        }}
      >
        "Balans ziet er voor iedereen anders uit. Er is geen 'goed' of 'fout'."
      </motion.p>

      <motion.button
        className="btn btn-primary"
        onClick={onContinue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.98 }}
      >
        Bekijk je resultaat
      </motion.button>
    </div>
  )
}

function StatBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="stat-badge">
      <span className="stat-value" style={{ color }}>
        {count}×
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export function ResultsScreen({ gameState, onRestart }: ResultsProps) {
  const earnedBadges = gameState.badges.map(id => BADGES[id as keyof typeof BADGES]).filter(Boolean)

  return (
    <div className="flex-col p-lg text-center" style={{ minHeight: '100%', paddingBottom: '100px' }}>
      {/* Points section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-xl)' }}
      >
        <h2 style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 'var(--space-sm)',
        }}>
          Jouw Balanspunten
        </h2>
        <motion.div
          className="text-gradient-success"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          style={{
            fontSize: 'var(--font-size-4xl)',
            fontWeight: 'bold',
          }}
        >
          {gameState.points}
        </motion.div>
      </motion.div>

      {/* Badges section */}
      {earnedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 'var(--space-xl)', width: '100%', maxWidth: '340px', margin: '0 auto var(--space-xl)' }}
        >
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-warning)',
            marginBottom: 'var(--space-md)',
          }}>
            Behaalde Badges
          </h3>
          <div className="flex-col gap-md">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                className="badge-unlock"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <span className="badge-icon">{BADGE_ICONS[badge.icon] || <Award size={20} />}</span>
                <div style={{ textAlign: 'left' }}>
                  <div className="badge-name">{badge.name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {badge.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* What is Balance Quest */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          marginBottom: 'var(--space-lg)',
          maxWidth: '340px',
          margin: '0 auto var(--space-lg)',
          textAlign: 'left',
        }}
      >
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          color: 'white',
          marginBottom: 'var(--space-md)',
        }}>
          Dit was Balance Quest in actie
        </h3>

        <div className="flex-col gap-sm">
          {[
            'Geen oordeel, wel bewustwording',
            'Persoonlijke doelen, geen algemene regels',
            'Kijkt naar patronen, niet losse momenten',
            'Positieve meldingen die je helpen',
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              <Check size={16} style={{ color: 'var(--color-green)', flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 'var(--space-md)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-subtle)',
          fontStyle: 'italic',
        }}>
          Meesterproef door Mio van Leenen
        </p>
      </motion.div>

      {/* End screen */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 'var(--space-lg)',
        }}
      >
        Bedankt voor het spelen, {gameState.playerName}!
      </motion.h2>

      <motion.button
        className="btn btn-primary"
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.98 }}
      >
        Opnieuw spelen
      </motion.button>
    </div>
  )
}
