import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, TrendingUp, HelpCircle } from 'lucide-react'
import type { TimedAlert, BubbleExpression } from '../gameState'

interface TimedBubbleAlertProps {
  alert: TimedAlert
  sceneId: string // Used to reset when scene changes
  onDismiss?: () => void
}

const EXPRESSION_COLORS: Record<BubbleExpression, string> = {
  curious: 'var(--color-primary)',
  concerned: 'var(--color-warning)',
  supportive: 'var(--color-success)',
  celebratory: 'var(--color-primary-light)',
}

const TYPE_ICONS = {
  time: Clock,
  pattern: TrendingUp,
  reflection: HelpCircle,
}

export function TimedBubbleAlert({ alert, sceneId, onDismiss }: TimedBubbleAlertProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  // Reset when scene changes
  useEffect(() => {
    setIsVisible(false)
    setHasShown(false)
  }, [sceneId])

  // Show alert after delay
  useEffect(() => {
    if (hasShown) return

    const timer = setTimeout(() => {
      setIsVisible(true)
      setHasShown(true)
    }, alert.delay * 1000)

    return () => clearTimeout(timer)
  }, [alert.delay, hasShown, sceneId])

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, 6000)

    return () => clearTimeout(timer)
  }, [isVisible, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const expression = alert.expression || 'curious'
  const accentColor = EXPRESSION_COLORS[expression]
  const Icon = TYPE_ICONS[alert.type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="timed-alert"
          onClick={handleDismiss}
          style={{
            position: 'fixed',
            top: 'calc(var(--safe-area-top, 0px) + 200px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            maxWidth: 'calc(100vw - 48px)',
            width: '320px',
          }}
        >
          {/* Glow effect */}
          <motion.div
            animate={{
              boxShadow: [
                `0 0 20px ${accentColor}40`,
                `0 0 30px ${accentColor}60`,
                `0 0 20px ${accentColor}40`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--radius-xl)',
              pointerEvents: 'none',
            }}
          />

          {/* Alert card */}
          <div
            style={{
              background: 'var(--color-bg-glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 'var(--radius-xl)',
              border: `1px solid ${accentColor}40`,
              padding: 'var(--space-md)',
              position: 'relative',
            }}
          >
            {/* Header with icon and type */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-sm)',
            }}>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={14} style={{ color: accentColor }} />
              </motion.div>
              <span style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {alert.type === 'time' && 'Observatie'}
                {alert.type === 'pattern' && 'Patroon'}
                {alert.type === 'reflection' && 'Vraag'}
              </span>

              {/* Bubble indicator */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  marginLeft: 'auto',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: accentColor,
                }}
              />
            </div>

            {/* Message */}
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {alert.message}
            </p>

            {/* Tap to dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2 }}
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-sm)',
                textAlign: 'center',
              }}
            >
              Tik om te sluiten
            </motion.p>
          </div>

          {/* Connecting line to bubble area */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              width: 2,
              height: 20,
              background: `linear-gradient(to bottom, ${accentColor}60, ${accentColor}20)`,
              transformOrigin: 'bottom',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
