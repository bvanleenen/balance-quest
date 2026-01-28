import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { BubbleState, BubbleExpression } from '../gameState'
import { BUBBLE_STATE_INFO } from '../gameState'

// Get color for bubble state
function getStateColor(state: BubbleState): string {
  return BUBBLE_STATE_INFO[state].color
}

// Get animation speed based on state
function getBreathingDuration(state: BubbleState): number {
  switch (state) {
    case 'energetic': return 2
    case 'content': return 3
    case 'attention': return 3.5
    case 'tired': return 5
    case 'outOfBalance': return 6
  }
}

// Get eye style based on state
function getEyeStyle(state: BubbleState) {
  switch (state) {
    case 'energetic':
      return { openness: 1, size: 1.1 }
    case 'content':
      return { openness: 0.9, size: 1 }
    case 'attention':
      return { openness: 0.8, size: 1 }
    case 'tired':
      return { openness: 0.5, size: 0.95 }
    case 'outOfBalance':
      return { openness: 0.4, size: 0.9 }
  }
}

// Get mouth based on state and expression
function getMouthPath(state: BubbleState, expression?: BubbleExpression): string {
  // Expression overrides state
  if (expression === 'celebratory') return 'M 35,62 Q 50,75 65,62' // Big smile
  if (expression === 'curious') return 'M 46,62 Q 50,66 54,62 Q 50,68 46,62' // Small o
  if (expression === 'concerned') return 'M 40,64 L 60,64' // Straight line
  if (expression === 'supportive') return 'M 38,62 Q 50,68 62,62' // Gentle smile

  switch (state) {
    case 'energetic': return 'M 35,60 Q 50,72 65,60' // Happy smile
    case 'content': return 'M 38,60 Q 50,68 62,60' // Content smile
    case 'attention': return 'M 42,62 L 58,62' // Neutral
    case 'tired': return 'M 42,62 Q 50,58 58,62' // Slight frown
    case 'outOfBalance': return 'M 40,64 Q 50,56 60,64' // Sad
  }
}

interface BalanceBubbleProps {
  state?: BubbleState
  size?: 'full' | 'small' | 'medium'
  expression?: BubbleExpression
  showParticles?: boolean
  showEyes?: boolean
  className?: string
  onClick?: () => void
}

export function BalanceBubble({
  state = 'content',
  size = 'full',
  expression,
  showEyes = true,
  className = '',
  onClick,
}: BalanceBubbleProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })

  const color = getStateColor(state)
  const breathingDuration = getBreathingDuration(state)
  const eyeStyle = getEyeStyle(state)
  const mouthPath = getMouthPath(state, expression)

  // Bubble size in pixels
  const bubbleSize = size === 'small' ? 80 : size === 'medium' ? 120 : 160

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      const blinkChance = state === 'tired' ? 0.4 : state === 'energetic' ? 0.15 : 0.25
      if (Math.random() < blinkChance) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 120)
      }
    }, 2000)
    return () => clearInterval(blinkInterval)
  }, [state])

  // Subtle pupil movement following mouse (only for larger sizes)
  useEffect(() => {
    if (size === 'small') return

    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 4
      const y = ((e.clientY / window.innerHeight) - 0.5) * 4
      setPupilOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [size])

  return (
    <motion.div
      className={`bubble-container ${className}`}
      style={{
        width: bubbleSize,
        height: bubbleSize,
        cursor: onClick ? 'pointer' : 'default',
      }}
      animate={{
        scale: [1, 1.04, 1],
      }}
      transition={{
        duration: breathingDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      {/* Main bubble */}
      <div
        className="bubble-body"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color})`,
          boxShadow: `
            inset -8px -8px 20px rgba(0,0,0,0.15),
            inset 4px 4px 15px rgba(255,255,255,0.2),
            0 8px 32px ${color}40
          `,
        }}
      >
        {/* Highlight/shine */}
        <div className="bubble-shine" />

        {/* Face */}
        {showEyes && (
          <svg
            viewBox="0 0 100 100"
            className="bubble-face"
          >
            {/* Left eye */}
            <g transform={`translate(0, ${isBlinking ? 4 : 0})`}>
              <ellipse
                cx="38"
                cy="42"
                rx={10 * eyeStyle.size}
                ry={10 * eyeStyle.size * eyeStyle.openness}
                fill="white"
              />
              {!isBlinking && (
                <>
                  <circle
                    cx={38 + pupilOffset.x}
                    cy={42 + pupilOffset.y}
                    r={5 * eyeStyle.size}
                    fill="#1E293B"
                  />
                  <circle
                    cx={40 + pupilOffset.x * 0.5}
                    cy={40 + pupilOffset.y * 0.5}
                    r={2}
                    fill="white"
                  />
                </>
              )}
            </g>

            {/* Right eye */}
            <g transform={`translate(0, ${isBlinking ? 4 : 0})`}>
              <ellipse
                cx="62"
                cy="42"
                rx={10 * eyeStyle.size}
                ry={10 * eyeStyle.size * eyeStyle.openness}
                fill="white"
              />
              {!isBlinking && (
                <>
                  <circle
                    cx={62 + pupilOffset.x}
                    cy={42 + pupilOffset.y}
                    r={5 * eyeStyle.size}
                    fill="#1E293B"
                  />
                  <circle
                    cx={64 + pupilOffset.x * 0.5}
                    cy={40 + pupilOffset.y * 0.5}
                    r={2}
                    fill="white"
                  />
                </>
              )}
            </g>

            {/* Mouth */}
            <path
              d={mouthPath}
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </div>
    </motion.div>
  )
}

export default BalanceBubble
