import { motion } from 'framer-motion'
import { Smile, Meh, Frown } from 'lucide-react'

interface MicroReflectionProps {
  question?: string
  onSelect: (mood: 'good' | 'neutral' | 'bad') => void
  selectedMood?: 'good' | 'neutral' | 'bad' | null
}

const MOOD_ICONS = {
  good: <Smile size={28} strokeWidth={2} />,
  neutral: <Meh size={28} strokeWidth={2} />,
  bad: <Frown size={28} strokeWidth={2} />,
}

const LABELS = {
  good: 'Goed',
  neutral: 'Oké',
  bad: 'Moe',
}

export function MicroReflection({
  question = 'Hoe voel je je?',
  onSelect,
  selectedMood,
}: MicroReflectionProps) {
  return (
    <motion.div
      className="reflection-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="reflection-question">{question}</p>
      <div className="reflection-moods">
        {(Object.keys(MOOD_ICONS) as Array<keyof typeof MOOD_ICONS>).map((mood, index) => (
          <motion.button
            key={mood}
            className={`reflection-mood-btn ${selectedMood === mood ? 'selected' : ''}`}
            onClick={() => onSelect(mood)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={LABELS[mood]}
          >
            {MOOD_ICONS[mood]}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
