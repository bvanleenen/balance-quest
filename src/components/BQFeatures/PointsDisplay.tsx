import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'

interface PointsDisplayProps {
  points: number
  showLabel?: boolean
}

export function PointsDisplay({ points, showLabel = true }: PointsDisplayProps) {
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; value: number }[]>([])
  const prevPoints = useRef(points)
  const idCounter = useRef(0)

  useEffect(() => {
    if (points > prevPoints.current) {
      const diff = points - prevPoints.current
      idCounter.current += 1
      setFloatingPoints((prev) => [...prev, { id: idCounter.current, value: diff }])

      // Remove after animation
      setTimeout(() => {
        setFloatingPoints((prev) => prev.filter((p) => p.id !== idCounter.current))
      }, 1000)
    }
    prevPoints.current = points
  }, [points])

  return (
    <div className="points-display">
      <span className="points-icon"><Star size={16} fill="currentColor" /></span>
      <motion.span
        className="points-value"
        key={points}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        {points}
      </motion.span>
      {showLabel && <span className="points-label">punten</span>}

      {/* Floating points animation */}
      <AnimatePresence>
        {floatingPoints.map((fp) => (
          <motion.span
            key={fp.id}
            initial={{ opacity: 1, y: 0, x: 40 }}
            animate={{ opacity: 0, y: -30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: 'var(--color-success)',
              fontWeight: 600,
              fontSize: 'var(--font-size-sm)',
              pointerEvents: 'none',
            }}
          >
            +{fp.value}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
