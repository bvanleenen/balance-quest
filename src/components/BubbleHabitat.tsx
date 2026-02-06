import { motion, AnimatePresence } from 'framer-motion'
import { Star, Target, Coffee, Moon, Users, Sunrise, Clock, MessageCircle, Shield, Heart, Activity } from 'lucide-react'
import { BalanceBubble3D } from './BalanceBubble3D'
import type { BubbleState, BubbleExpression } from '../gameState'
import { BADGES } from '../gameState'

// Map badge icon names to actual components
const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Target,
  Coffee,
  Moon,
  Users,
  Sunrise,
  Clock,
  MessageCircle,
  Shield,
  Heart,
  Activity,
}

interface BubbleHabitatProps {
  bubbleState: BubbleState
  points: number
  earnedBadges: string[]
  expression?: BubbleExpression
  onBubbleClick?: () => void
}

export function BubbleHabitat({ bubbleState, points, earnedBadges, expression, onBubbleClick }: BubbleHabitatProps) {
  // Get badge info for earned badges (max 3 shown in header)
  const displayBadges = earnedBadges.slice(-3).map(id => BADGES[id as keyof typeof BADGES]).filter(Boolean)

  // Get the actual icon component
  const getIconComponent = (iconName: string) => {
    const Icon = ICON_MAP[iconName]
    return Icon ? <Icon size={12} /> : null
  }

  return (
    <div className="bubble-habitat-wrapper">
      <div className="bubble-habitat">
        {/* Header bar: points left, badges right */}
        <div className="habitat-header">
          {/* Points display - left */}
          <motion.div
            className="habitat-points"
            whileHover={{ scale: 1.05 }}
          >
            <Star size={14} fill="currentColor" />
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

          {/* Badges display - right */}
          <div className="habitat-header-badges">
            <AnimatePresence>
              {displayBadges.map((badge, index) => (
                <motion.div
                  key={badge.name}
                  className="habitat-badge-mini"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.08,
                    type: 'spring',
                    stiffness: 400,
                    damping: 20
                  }}
                  title={badge.name}
                >
                  <span className="badge-icon">{getIconComponent(badge.icon)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bubble container - 3D */}
        <div className="habitat-bubble-area">
          <BalanceBubble3D
            state={bubbleState}
            size="full"
            expression={expression}
            onClick={onBubbleClick}
          />
        </div>
      </div>
    </div>
  )
}

export default BubbleHabitat
