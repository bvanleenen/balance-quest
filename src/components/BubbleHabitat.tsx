import { motion, AnimatePresence } from 'framer-motion'
import { Star, Sparkles } from 'lucide-react'
import { BalanceBubble } from './BalanceBubble'
import type { BubbleState } from '../gameState'
import { BADGES } from '../gameState'

interface BubbleHabitatProps {
  bubbleState: BubbleState
  points: number
  earnedBadges: string[]
  onBubbleClick?: () => void
}

export function BubbleHabitat({ bubbleState, points, earnedBadges, onBubbleClick }: BubbleHabitatProps) {
  // Get badge info for earned badges (max 4 shown)
  const displayBadges = earnedBadges.slice(-4).map(id => BADGES[id as keyof typeof BADGES]).filter(Boolean)

  return (
    <div className="bubble-habitat">
      {/* Decorative corner sparkles */}
      <div className="habitat-sparkle habitat-sparkle-tl">
        <Sparkles size={12} />
      </div>
      <div className="habitat-sparkle habitat-sparkle-tr">
        <Sparkles size={12} />
      </div>

      {/* Header bar with points and badges */}
      <div className="habitat-header">
        {/* Points display - left side */}
        <motion.div
          className="habitat-points"
          whileHover={{ scale: 1.05 }}
        >
          <Star size={16} fill="currentColor" />
          <motion.span
            key={points}
            initial={{ scale: 1.3, color: '#34D399' }}
            animate={{ scale: 1, color: '#fff' }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="habitat-points-value"
          >
            {points}
          </motion.span>
          <span className="habitat-points-label">punten</span>
        </motion.div>

        {/* Badges display - right side */}
        <div className="habitat-badges">
          <AnimatePresence>
            {displayBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                className="habitat-badge"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 400,
                  damping: 15
                }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                title={badge.name}
              >
                {badge.icon}
              </motion.div>
            ))}
          </AnimatePresence>
          {earnedBadges.length === 0 && (
            <span className="habitat-badges-empty">Nog geen badges</span>
          )}
        </div>
      </div>

      {/* Bubble container */}
      <div className="habitat-bubble-area" onClick={onBubbleClick}>
        <BalanceBubble
          state={bubbleState}
          size="full"
          showParticles={false}
          showEyes={true}
        />
      </div>

      {/* Bottom decorative line */}
      <div className="habitat-footer">
        <div className="habitat-footer-line" />
      </div>
    </div>
  )
}

export default BubbleHabitat
