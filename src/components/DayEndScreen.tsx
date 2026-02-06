import { motion } from 'framer-motion'
import type { ChoiceCategory } from '../gameState'

interface DayEndScreenProps {
  day: 1 | 2 | 3
  choices: { sceneId: string; choiceId: string; category: ChoiceCategory }[]
  points: number
  onContinue: () => void
  onEnd: () => void
}

const DAY_NAMES: Record<1 | 2 | 3, string> = {
  1: 'Donderdag',
  2: 'Vrijdag',
  3: 'Weekend',
}

const DAY_SUMMARIES: Record<1 | 2 | 3, string> = {
  1: 'Je hebt een vriend gesteund, een toets voorbereid, en keuzes gemaakt over je tijd.',
  2: 'Een toets gehad, groepsdynamiek meegemaakt, vrijdagavond doorgebracht.',
  3: 'Weekend keuzes gemaakt: rust, familie, vrienden, verplichtingen.',
}

export function DayEndScreen({
  day,
  choices,
  points,
  onContinue,
  onEnd,
}: DayEndScreenProps) {
  // Count choices by category for this day's summary
  const forOthers = choices.filter(c => c.category === 'social').length
  const forSelf = choices.filter(c => c.category === 'rest').length
  const forWork = choices.filter(c => c.category === 'work').length

  const nextDay = day < 3 ? day + 1 : null
  const nextDayName = nextDay ? DAY_NAMES[nextDay as 1 | 2 | 3] : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        padding: 'var(--space-xl)',
        paddingTop: 'calc(var(--safe-area-top, 0px) + var(--space-2xl))',
        paddingBottom: 'calc(var(--safe-area-bottom, 0px) + var(--space-xl))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'var(--space-xl)',
      }}
    >
      {/* Day complete header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-sm)',
        }}>
          Dag {day} zit erop
        </h1>
        <p style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-secondary)',
        }}>
          {DAY_NAMES[day]}
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'var(--color-bg-glass)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-lg)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-md)',
          lineHeight: 1.6,
        }}>
          {DAY_SUMMARIES[day]}
        </p>

        {/* Mini stats */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-md)',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <StatBadge label="Voor anderen" value={forOthers} color="var(--color-social)" />
          <StatBadge label="Voor jezelf" value={forSelf} color="var(--color-rest)" />
          <StatBadge label="Verplichtingen" value={forWork} color="var(--color-work)" />
        </div>
      </motion.div>

      {/* BQ Observation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dim) 0%, var(--color-bg-elevated) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-lg)',
          border: '1px solid var(--color-primary-muted)',
        }}
      >
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-primary-light)',
          fontWeight: 600,
          marginBottom: 'var(--space-xs)',
        }}>
          Balance Quest
        </p>
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--color-text-primary)',
          fontStyle: 'italic',
        }}>
          "Vandaag koos je {forOthers} keer voor anderen, {forSelf} keer voor jezelf."
        </p>
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--space-sm)',
        }}>
          Dit is geen oordeel. Dit is een observatie.
        </p>
      </motion.div>

      {/* Points earned */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <span style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 700,
          color: 'var(--color-primary)',
        }}>
          {points} balanspunten
        </span>
      </motion.div>

      {/* Choice buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        {nextDay && (
          <>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
            }}>
              {nextDayName} gaat verder waar je bent gebleven.
              <br />
              Je keuzes van vandaag werken door.
            </p>

            <button
              onClick={onContinue}
              style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary)',
                color: 'white',
                fontWeight: 600,
                fontSize: 'var(--font-size-md)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Naar Dag {nextDay} →
            </button>
          </>
        )}

        <button
          onClick={onEnd}
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontWeight: 500,
            fontSize: 'var(--font-size-md)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
          }}
        >
          {nextDay ? 'Stop hier, bekijk resultaten' : 'Bekijk je resultaten'}
        </button>
      </motion.div>
    </motion.div>
  )
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    }}>
      <span style={{
        fontSize: 'var(--font-size-xl)',
        fontWeight: 700,
        color,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
      }}>
        {label}
      </span>
    </div>
  )
}
