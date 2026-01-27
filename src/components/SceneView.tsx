import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MapPin, Zap } from 'lucide-react'
import type { Scene, Choice, BubbleState } from '../gameState'
import { BubbleHabitat } from './BubbleHabitat'
import { ProgressBar } from './BQFeatures'

interface SceneViewProps {
  scene: Scene
  playerName: string
  bubbleState: BubbleState
  points: number
  earnedBadges: string[]
  progress: number
  onChoice: (choice: Choice) => void
  onBubbleClick?: () => void
}

export function SceneView({ scene, playerName, bubbleState, points, earnedBadges, progress, onChoice, onBubbleClick }: SceneViewProps) {
  const [phase, setPhase] = useState<'intro' | 'text' | 'choices'>('intro')
  const [visibleLines, setVisibleLines] = useState(0)
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null)

  // Split text into lines for animation
  const textLines = scene.text.split('\n').filter(line => line.trim())

  // Reset animation when scene changes
  useEffect(() => {
    setPhase('intro')
    setVisibleLines(0)

    // If no intro, skip to text
    if (!scene.intro && !scene.time && !scene.location) {
      setPhase('text')
    }
  }, [scene.id])

  // Progress through animation phases
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        setPhase('text')
      }, scene.intro ? 1500 : 800)
      return () => clearTimeout(timer)
    }
  }, [phase, scene.intro])

  // Animate text lines appearing
  useEffect(() => {
    if (phase === 'text' && visibleLines < textLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1)
      }, 600)
      return () => clearTimeout(timer)
    } else if (phase === 'text' && visibleLines >= textLines.length) {
      const timer = setTimeout(() => {
        setPhase('choices')
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [phase, visibleLines, textLines.length])

  // Helper to render text with highlights
  const renderText = (text: string) => {
    // Replace {name} and add styling for quoted text
    let processed = text.replace('{name}', playerName)

    // Check if it's a "thought" (starts with quotes or contains internal monologue patterns)
    const isThought = processed.startsWith('"') || processed.includes('...')

    if (isThought) {
      return <span className="thought-text">{processed}</span>
    }
    return processed
  }

  return (
    <div className="scene-view-container">
      {/* Sticky top section: Progress bar + Bubble Habitat */}
      <div className="bubble-companion-section">
        <div className="sticky-header-content">
          <ProgressBar progress={progress} />
          <BubbleHabitat
            bubbleState={bubbleState}
            points={points}
            earnedBadges={earnedBadges}
            onBubbleClick={onBubbleClick}
          />
        </div>
      </div>

      {/* Middle section: Story content */}
      <div className="scene-story-section">
        {/* Time and location badge */}
        <AnimatePresence>
          {(scene.time || scene.location) && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="scene-badges"
            >
              {scene.time && (
                <motion.span className="time-badge" whileHover={{ scale: 1.05 }}>
                  <Clock size={14} strokeWidth={2.5} />
                  {scene.time}
                </motion.span>
              )}
              {scene.location && (
                <motion.span className="time-badge" whileHover={{ scale: 1.05 }}>
                  <MapPin size={14} strokeWidth={2.5} />
                  {scene.location}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intro text (if any) */}
        <AnimatePresence>
          {scene.intro && (phase === 'intro' || phase === 'text') && (
            <motion.div
              className="scene-intro"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              {scene.intro}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main text - animated line by line */}
        <div className="scene-text">
          {textLines.map((line, index) => (
            <AnimatePresence key={index}>
              {index < visibleLines && (
                <motion.p
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  {renderText(line)}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Bottom section: Choices */}
      <AnimatePresence>
        {phase === 'choices' && (
          <motion.div
            className="choices-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 25
            }}
          >
            {/* Dilemma indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <span className="dilemma-label">
                <Zap size={12} strokeWidth={2.5} />
                Keuze moment
              </span>
            </motion.div>

            <div className="choices-grid">
              {scene.choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  className="choice-btn"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: hoveredChoice && hoveredChoice !== choice.id ? 0.97 : 1
                  }}
                  transition={{
                    delay: 0.15 + index * 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                  }}
                  onClick={() => onChoice(choice)}
                  onMouseEnter={() => setHoveredChoice(choice.id)}
                  onMouseLeave={() => setHoveredChoice(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="choice-btn-label">{choice.label}</div>
                  <div className="choice-btn-subtext">{choice.subtext}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
