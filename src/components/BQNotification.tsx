import { motion } from 'framer-motion'
import { Quote, BadgeUnlock } from './BQFeatures'

interface BQNotificationProps {
  message: string
  quote?: string
  points?: number
  badge?: { name: string; icon: string }
  onClose: () => void
}

export function BQNotification({ message, quote, points, badge, onClose }: BQNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="speech-bubble-overlay"
    >
      {/* Speech bubble container */}
      <motion.div
        className="speech-bubble"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Speech bubble tail pointing up to bubble */}
        <div className="speech-bubble-tail" />

        {/* Message */}
        <p className="speech-bubble-message">
          {message}
        </p>

        {/* Quote (if any) */}
        {quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="speech-bubble-quote"
          >
            <Quote text={quote} />
          </motion.div>
        )}

        {/* Points (if any) */}
        {points !== undefined && points > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="speech-bubble-points"
          >
            <span className="points-value">+{points}</span>
            <span className="points-label">balanspunten</span>
          </motion.div>
        )}

        {/* Badge (if any) */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="speech-bubble-badge"
          >
            <BadgeUnlock icon={badge.icon} name={badge.name} />
          </motion.div>
        )}

        {/* Continue button */}
        <motion.button
          className="speech-bubble-btn"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Verder
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
