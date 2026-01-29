import { useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Coffee, Moon, Heart, Activity, CheckSquare, Check } from 'lucide-react'
import type { Habit } from '../gameState'
import { HABIT_LABELS } from '../gameState'
import { PixelLogo } from './PixelLogo'

// Map habits to Lucide icons
const HABIT_ICON_COMPONENTS: Record<Habit, React.ReactNode> = {
  'less-phone': <Smartphone size={20} />,
  'take-breaks': <Coffee size={20} />,
  'sleep-on-time': <Moon size={20} />,
  'me-time': <Heart size={20} />,
  'more-exercise': <Activity size={20} />,
  'finish-tasks': <CheckSquare size={20} />,
}

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex-col flex-center p-lg text-center" style={{ minHeight: '100%', position: 'relative', zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div style={{ marginTop: 'calc(var(--safe-area-top, 0px) + 76px)', marginBottom: '40px' }}>
          <PixelLogo blockSize={6} gap={1} delay={0.3} showBubble={false} align="left" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-glass"
        style={{
          maxWidth: '340px',
          marginBottom: 'var(--space-xl)',
          textAlign: 'left',
        }}
      >
        <p style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.7,
          marginBottom: 'var(--space-md)',
        }}>
          Welkom! In de komende <strong style={{ color: 'var(--color-primary-light)' }}>5 minuten</strong> ga je even in de schoenen staan van een 17-jarige.
        </p>
        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Maak keuzes, ervaar de struggles, en ontdek hoe Balance Quest kan helpen.
        </p>
      </motion.div>

      <motion.button
        className="btn btn-primary"
        onClick={onStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: 'var(--space-md) var(--space-2xl)',
          fontSize: 'var(--font-size-lg)',
        }}
      >
        Start de ervaring
      </motion.button>
    </div>
  )
}

interface NameScreenProps {
  onSubmit: (name: string) => void
}

export function NameScreen({ onSubmit }: NameScreenProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="flex-col flex-center p-lg text-center" style={{ minHeight: '100%' }}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 'var(--space-sm)',
        }}
      >
        Even voorstellen...
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        Hoe mogen we je noemen?
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ width: '100%', maxWidth: '300px' }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Je naam..."
          autoFocus
          className="input text-center mb-lg"
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className="btn btn-primary btn-full"
        >
          Verder
        </button>
      </motion.form>
    </div>
  )
}

interface HabitsScreenProps {
  onSubmit: (habits: Habit[]) => void
}

export function HabitsScreen({ onSubmit }: HabitsScreenProps) {
  const [selected, setSelected] = useState<Habit[]>([])

  const toggleHabit = (habit: Habit) => {
    setSelected(prev =>
      prev.includes(habit)
        ? prev.filter(h => h !== habit)
        : [...prev, habit]
    )
  }

  const habits: Habit[] = ['less-phone', 'take-breaks', 'sleep-on-time', 'me-time', 'more-exercise', 'finish-tasks']

  return (
    <div className="flex-col p-lg" style={{ minHeight: '100%', position: 'relative', zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}
      >
        <h2 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #fff, var(--color-primary-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-sm)',
        }}>
          Jouw doelen
        </h2>
        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
        }}>
          Welke gezonde gewoontes wil jij bijhouden?
        </p>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'inline-block',
            marginTop: 'var(--space-sm)',
            padding: '4px 12px',
            background: 'rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-primary-light)',
            fontWeight: 600,
          }}
        >
          Kies er minimaal 1
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-col gap-sm"
        style={{ width: '100%', maxWidth: '380px', margin: '0 auto var(--space-lg)' }}
      >
        {habits.map((habit, index) => (
          <motion.button
            key={habit}
            className={`habit-btn ${selected.includes(habit) ? 'selected' : ''}`}
            onClick={() => toggleHabit(habit)}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.2 + index * 0.08,
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="habit-checkbox">
              {selected.includes(habit) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <Check size={14} strokeWidth={3} />
                </motion.span>
              )}
            </span>
            <span className="habit-icon">{HABIT_ICON_COMPONENTS[habit]}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{HABIT_LABELS[habit]}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          textAlign: 'center',
          padding: 'var(--space-md)',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(99, 102, 241, 0.1))',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '340px',
          margin: '0 auto var(--space-lg)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
        }}
      >
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}>
          Balance Quest helpt je hiermee. <br />
          <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>Geen regels</span>, wel bewustwording.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ textAlign: 'center' }}
      >
        <motion.button
          className="btn btn-primary"
          onClick={() => onSubmit(selected)}
          disabled={selected.length === 0}
          whileHover={selected.length > 0 ? { scale: 1.05 } : {}}
          whileTap={selected.length > 0 ? { scale: 0.95 } : {}}
          style={{
            padding: 'var(--space-md) var(--space-2xl)',
            fontSize: 'var(--font-size-lg)',
          }}
        >
          {selected.length === 0 ? 'Kies je doelen...' : `Laten we beginnen! (${selected.length})`}
        </motion.button>
      </motion.div>
    </div>
  )
}

// New: Bubble introduction screen
interface BubbleIntroProps {
  playerName: string
  onContinue: () => void
}

export function BubbleIntroScreen({ playerName, onContinue }: BubbleIntroProps) {
  return (
    <div className="flex-col flex-center p-lg text-center" style={{ minHeight: '100%', position: 'relative', zIndex: 10 }}>
      {/* Animated bubble with pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #5EEAD4, var(--color-green), #059669)',
          boxShadow: `
            0 0 60px var(--color-green-glow),
            0 0 100px rgba(52, 211, 153, 0.2),
            inset 0 -20px 40px rgba(0, 0, 0, 0.2),
            inset 0 20px 40px rgba(255, 255, 255, 0.2)
          `,
          marginBottom: 'var(--space-xl)',
          position: 'relative',
        }}
      >
        {/* Shine effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            filter: 'blur(8px)',
          }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
        style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #fff, var(--color-green))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-md)',
        }}
      >
        Dit is jouw balansbubbel
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-primary)',
          maxWidth: '320px',
          lineHeight: 1.7,
          marginBottom: 'var(--space-lg)',
        }}
      >
        Hey <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{playerName}</span>!
        Deze bubble is jouw companion. Ze reageert op je keuzes en laat zien hoe je balans ervoor staat.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card-glass"
        style={{ maxWidth: '300px', marginBottom: 'var(--space-xl)' }}
      >
        <div className="flex-col gap-md">
          {[
            { color: 'var(--color-green)', glow: 'var(--color-green-glow)', label: 'Groen = in balans' },
            { color: 'var(--color-orange)', glow: 'var(--color-orange-glow)', label: 'Oranje = even checken' },
            { color: 'var(--color-red)', glow: 'var(--color-red-glow)', label: 'Rood = uit balans' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: item.color,
                boxShadow: `0 0 12px ${item.glow}`,
              }} />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-subtle)',
          maxWidth: '280px',
          marginBottom: 'var(--space-xl)',
          fontStyle: 'italic',
        }}
      >
        Geen oordeel, alleen bewustwording. Klaar?
      </motion.p>

      <motion.button
        className="btn btn-primary"
        onClick={onContinue}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: 'var(--space-md) var(--space-2xl)',
          fontSize: 'var(--font-size-lg)',
        }}
      >
        Start mijn dag
      </motion.button>
    </div>
  )
}
