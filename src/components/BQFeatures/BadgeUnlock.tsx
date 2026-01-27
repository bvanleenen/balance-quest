import { motion } from 'framer-motion'
import { Target, Coffee, Moon, Users, Sunrise, Award } from 'lucide-react'

// Map icon names to Lucide components
const BADGE_ICONS: Record<string, React.ReactNode> = {
  Target: <Target size={24} />,
  Coffee: <Coffee size={24} />,
  Moon: <Moon size={24} />,
  Users: <Users size={24} />,
  Sunrise: <Sunrise size={24} />,
}

interface BadgeUnlockProps {
  icon: string
  name: string
  description?: string
}

export function BadgeUnlock({ icon, name, description }: BadgeUnlockProps) {
  const IconComponent = BADGE_ICONS[icon] || <Award size={24} />

  return (
    <motion.div
      className="badge-unlock"
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <motion.span
        className="badge-icon"
        initial={{ rotate: -20, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
      >
        {IconComponent}
      </motion.span>
      <div>
        <motion.div
          className="badge-label"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Badge behaald!
        </motion.div>
        <motion.div
          className="badge-name"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {name}
        </motion.div>
        {description && (
          <motion.div
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {description}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
