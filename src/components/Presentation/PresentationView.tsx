import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { IPhoneMockup } from './IPhoneMockup'
import { BalanceBubble3D } from '../BalanceBubble3D'
import { PixelLogo } from '../PixelLogo'
import { MOOD_TO_BUBBLE_STATE } from '../../gameState'
import type { BubbleMood, BubbleState } from '../../gameState'

// Slide data with bubble comments
const SLIDES = [
  {
    id: 'intro',
    pixelLogo: true,
    title: '',
    subtitle: 'Meesterproef Mio van Leenen',
    content: 'Wat is de impact van gamification op het volhouden van gezonde gewoontes en hoe komen deze tot uiting in een zelfontwikkelde app?',
    icon: 'graduation',
    highlight: 'Klas 6vh1 • Profiel Humanics',
    bubbleComment: 'Hoi! Ik ben Bubble, en ik help je door de presentatie!',
    bubbleMood: 'happy',
  },
  {
    id: 'problem',
    title: 'Het Probleem',
    subtitle: '61% van jongeren ervaart prestatiedruk',
    content: 'Jongeren willen graag presteren én gezond leven, maar worden continu afgeleid door apps die ontworpen zijn om aandacht zo lang mogelijk vast te houden.',
    icon: 'phone',
    quote: '"Na school ben ik zo moe, dan ga ik toch maar gewoon even scrollen"',
    bubbleComment: 'Herkenbaar? Scrollen voelt even lekker, maar helpt niet echt...',
    bubbleMood: 'thinking',
  },
  {
    id: 'research',
    title: 'De Paradox',
    subtitle: 'Directe vs. uitgestelde beloning',
    content: 'Ongezonde gewoontes geven directe dopamine, terwijl gezonde gewoontes pas op lange termijn effect hebben.',
    icon: 'brain',
    points: [
      'Schermtijd beperken',
      'Voldoende slapen',
      'Genoeg bewegen',
      'Structuur vasthouden',
    ],
    bubbleComment: 'Je brein houdt van shortcuts. Dat is menselijk!',
    bubbleMood: 'neutral',
  },
  {
    id: 'frameworks',
    title: 'Theoretisch Kader',
    subtitle: '4 wetenschappelijke frameworks',
    content: 'De app is gebouwd op bewezen modellen voor motivatie en gedragsverandering.',
    icon: 'chart',
    points: [
      'Octalysis (8 core drives)',
      'MDA-Framework',
      'Bartle\'s Taxonomy',
      'Self-Determination Theory',
    ],
    bubbleComment: 'Gebaseerd op échte wetenschap!',
    bubbleMood: 'proud',
  },
  {
    id: 'octalysis',
    title: 'Core Drive 2',
    subtitle: 'Development & Accomplishment',
    content: 'Focus op intrinsieke motivatie: het gevoel van vooruitgang en groei. Geen manipulatie, maar motivatie.',
    icon: 'gamepad',
    points: [
      'Geen FOMO-tactieken',
      'Geen strenge streaks',
      'Geen schuldinducerende notificaties',
      'Kleine, haalbare doelen',
    ],
    bubbleComment: 'Ik ga je nooit pushen. Beloofd!',
    bubbleMood: 'happy',
  },
  {
    id: 'sdt',
    title: 'Self-Determination Theory',
    subtitle: 'De drie basisbehoeften',
    content: 'Ethische gamification voldoet aan deze principes voor duurzame gedragsverandering.',
    icon: 'heart',
    points: [
      'Autonomie — Jij maakt de keuzes',
      'Competentie — Voortgang zichtbaar',
      'Verbondenheid — Je bubble als buddy',
    ],
    bubbleComment: 'Jij bent de baas!',
    bubbleMood: 'happy',
  },
  {
    id: 'target',
    title: 'Doelgroep',
    subtitle: 'Achievers (Bartle\'s Taxonomy)',
    content: 'Perfectionistische jongeren die gemotiveerd worden door doelen, badges en vooruitgang.',
    icon: 'target',
    points: [
      'Punten en badges',
      'Visuele voortgang',
      'Kleine succesmomenten',
    ],
    bubbleComment: 'Ken je dat gevoel als je iets afvinkt?',
    bubbleMood: 'excited',
  },
  {
    id: 'bubble',
    title: 'De Balansbubbel',
    subtitle: 'Je digitale buddy',
    content: 'Een visuele metafoor voor je welzijn. Geen oordeel, alleen bewustwording.',
    icon: 'bubble',
    bubbleStates: [
      { color: '#6BCB9A', label: 'In balans', state: 'energetic' as BubbleState },
      { color: '#F5B742', label: 'Even checken', state: 'attention' as BubbleState },
      { color: '#E87B7B', label: 'Aandacht nodig', state: 'tired' as BubbleState },
    ],
    bubbleComment: 'Dat ben ik! Mijn kleur laat zien hoe het gaat.',
    bubbleMood: 'proud',
  },
  {
    id: 'features',
    title: 'Bubble Elementen',
    subtitle: 'Bewustwording zonder dwang',
    content: 'Gebaseerd op Atomic Habits: kleine stappen, positieve feedback.',
    icon: 'sparkles',
    points: [
      'Micro-reflecties',
      'Positieve badges',
      'Motiverende quotes',
      'Patroon-inzichten',
    ],
    bubbleComment: 'Kleine stapjes, grote resultaten!',
    bubbleMood: 'happy',
  },
  {
    id: 'conclusion',
    title: 'Conclusie',
    subtitle: 'Gamification kan ethisch zijn',
    content: 'Gamification is geen wondermiddel, maar een ondersteunend hulpmiddel voor gezonde gewoontes.',
    icon: 'lightbulb',
    quote: '"Balans ziet er voor iedereen anders uit."',
    bubbleComment: 'Probeer het zelf! Scan de QR-code →',
    bubbleMood: 'excited',
  },
  {
    id: 'try-it',
    title: 'Probeer het zelf!',
    subtitle: 'Scan de QR-code',
    content: '',
    icon: 'sparkles',
    showLargeQR: true,
    bubbleComment: 'Ik zie je in de app! 👋',
    bubbleMood: 'excited',
    duration: 20000, // 2x longer
  },
]

const SLIDE_DURATION = 10000 // 10 seconds per slide
const CONTENT_SETTLE_DELAY = 2000 // Delay before bubble comment appears after slide content

// Persistent bubble presenter at top - always visible
function PresentationBubble({
  mood,
  comment,
  showComment
}: {
  mood: string
  comment: string
  showComment: boolean
}) {
  const bubbleState = MOOD_TO_BUBBLE_STATE[mood as BubbleMood] || 'content'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0px',
        padding: '10px 20px',
        background: 'transparent',
      }}
    >
      {/* The 3D bubble */}
      <div style={{ width: '200px', height: '200px', flexShrink: 0, position: 'relative', marginTop: '50px' }}>
        <div style={{ position: 'absolute', inset: '-30px' }}>
          <BalanceBubble3D
            state={bubbleState}
            size="medium"
            showEyes={true}
          />
        </div>
      </div>

      {/* Speech bubble - animates in/out, positioned near bubble's mouth */}
      <div style={{ flex: 1, minHeight: '44px', display: 'flex', alignItems: 'flex-start', marginTop: '20px' }}>
        <AnimatePresence mode="wait">
          {showComment && (
            <motion.div
              key={comment}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                padding: '12px 18px',
                background: 'rgba(30, 41, 59, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px 16px 16px 4px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '15px',
                  lineHeight: 1.4,
                  color: '#F5F0E8',
                  fontWeight: 500,
                }}
              >
                {comment}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function PresentationView() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showBubbleComment, setShowBubbleComment] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  const isFirstSlide = currentSlide === 0
  const isLastSlide = currentSlide === SLIDES.length - 1

  // Bubble visibility: fade in halfway through slide 1, fade out on last slide
  useEffect(() => {
    if (isFirstSlide) {
      setShowBubble(false)
      const slideDuration = (SLIDES[0] as any).duration || SLIDE_DURATION
      const fadeInTimer = setTimeout(() => {
        setShowBubble(true)
      }, slideDuration / 2)
      return () => clearTimeout(fadeInTimer)
    } else if (isLastSlide) {
      // Fade out after a moment on last slide
      const fadeOutTimer = setTimeout(() => {
        setShowBubble(false)
      }, 3000)
      return () => clearTimeout(fadeOutTimer)
    } else {
      setShowBubble(true)
    }
  }, [currentSlide, isFirstSlide, isLastSlide])

  // Animation sequence: slide content first, then bubble reacts
  useEffect(() => {
    // Hide bubble comment when slide changes
    setShowBubbleComment(false)

    // After content settles, bubble "reacts" with a comment
    const bubbleTimer = setTimeout(() => {
      setShowBubbleComment(true)
    }, CONTENT_SETTLE_DELAY)

    return () => clearTimeout(bubbleTimer)
  }, [currentSlide])

  const slide = SLIDES[currentSlide]

  // Auto-advance slides (with custom duration support)
  useEffect(() => {
    const currentSlideDuration = (slide as any).duration || SLIDE_DURATION

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
      setProgress(0)
    }, currentSlideDuration)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100))
    }, currentSlideDuration / 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [currentSlide])

  const isLogoSlide = !!(slide as any).pixelLogo

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0b0f 0%, #12141C 50%, #0a0b0f 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Left side - Presentation slides (3/4 width) */}
      <div
        style={{
          flex: '0 0 75%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Bubble presenter at TOP - reserves space only when bubble is visible */}
        <div style={{ position: 'relative', overflow: 'hidden', transition: 'max-height 0.8s ease', maxHeight: showBubble ? '300px' : '0px' }}>
          <div style={{ visibility: 'hidden' }}>
            <PresentationBubble
              mood={slide.bubbleMood || 'happy'}
              comment={slide.bubbleComment || ''}
              showComment={false}
            />
          </div>
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
              >
                <PresentationBubble
                  mood={slide.bubbleMood || 'happy'}
                  comment={slide.bubbleComment || ''}
                  showComment={showBubbleComment}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slide content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '24px 40px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                maxWidth: '600px',
                width: '100%',
              }}
            >
              {/* Title - pixel logo or text */}
              {isLogoSlide ? (
                <div style={{ marginBottom: '8px' }}>
                  <PixelLogo blockSize={10} gap={2} delay={0.3} showBubble={false} align="left" />
                </div>
              ) : (
                <h1
                  style={{
                    fontSize: 'clamp(36px, 5vw, 52px)',
                    fontWeight: 800,
                    color: '#F5F0E8',
                    margin: '0 0 8px 0',
                    lineHeight: 1.1,
                  }}
                >
                  {slide.title}
                </h1>
              )}

              {/* Subtitle */}
              <h2
                style={{
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 600,
                  color: '#E8784A',
                  margin: '0 0 20px 0',
                }}
              >
                {slide.subtitle}
              </h2>

              {/* Content */}
              <p
                style={{
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  color: '#C9C4BC',
                  lineHeight: 1.6,
                  margin: '0 0 20px 0',
                }}
              >
                {slide.content}
              </p>

              {/* Optional highlight */}
              {slide.highlight && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    display: 'inline-block',
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, rgba(232, 120, 74, 0.2), rgba(232, 120, 74, 0.05))',
                    border: '1px solid rgba(232, 120, 74, 0.3)',
                    borderRadius: '10px',
                    color: '#F4A574',
                    fontWeight: 600,
                    fontSize: '15px',
                  }}
                >
                  {slide.highlight}
                </motion.div>
              )}

              {/* Large QR code for final slide */}
              {(slide as any).showLargeQR && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '40px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    style={{
                      padding: '20px',
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 0 60px rgba(232, 120, 74, 0.3)',
                    }}
                  >
                    <QRCodeSVG
                      value="https://balancequest.app"
                      size={200}
                      level="M"
                      fgColor="#12141C"
                      bgColor="white"
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#8A857D' }}>
                      Scan met je telefoon
                    </p>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#E8784A' }}>
                      BalanceQuest.App
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Optional quote */}
              {slide.quote && (
                <motion.blockquote
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    margin: 0,
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, rgba(232, 120, 74, 0.1), transparent)',
                    borderLeft: '3px solid #E8784A',
                    borderRadius: '0 12px 12px 0',
                    fontStyle: 'italic',
                    color: '#F4A574',
                    fontSize: '16px',
                  }}
                >
                  {slide.quote}
                </motion.blockquote>
              )}

              {/* Optional points */}
              {slide.points && (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gridTemplateColumns: slide.points.length > 3 ? 'repeat(2, 1fr)' : '1fr',
                    gap: '8px',
                  }}
                >
                  {slide.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '10px',
                        color: '#F5F0E8',
                        fontSize: '15px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#E8784A',
                        flexShrink: 0,
                      }} />
                      {point}
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              {/* Bubble states visualization */}
              {slide.bubbleStates && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  {slide.bubbleStates.map((state, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '16px 24px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* CSS Bubble with glow */}
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: `radial-gradient(circle at 30% 30%, ${state.color}dd, ${state.color}99, ${state.color}66)`,
                          boxShadow: `0 0 30px ${state.color}66, inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 10px 20px rgba(255,255,255,0.2)`,
                          position: 'relative',
                        }}
                      >
                        {/* Eyes - white with black pupils like main bubble */}
                        <div style={{
                          position: 'absolute',
                          top: '32%',
                          left: '22%',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: 'white',
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#1a1a1a',
                          }} />
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '32%',
                          right: '22%',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: 'white',
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#1a1a1a',
                          }} />
                        </div>
                        {/* Mouth - different per state */}
                        {i === 0 && (
                          /* Happy smile for green */
                          <div style={{
                            position: 'absolute',
                            bottom: '20%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '22px',
                            height: '12px',
                            borderBottom: '2.5px solid #1a1a1a',
                            borderRadius: '0 0 20px 20px',
                          }} />
                        )}
                        {i === 1 && (
                          /* Neutral line for orange */
                          <div style={{
                            position: 'absolute',
                            bottom: '25%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '16px',
                            height: '2.5px',
                            background: '#1a1a1a',
                            borderRadius: '2px',
                          }} />
                        )}
                        {i === 2 && (
                          /* Sad frown for red */
                          <div style={{
                            position: 'absolute',
                            bottom: '18%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '18px',
                            height: '10px',
                            borderTop: '2.5px solid #1a1a1a',
                            borderRadius: '20px 20px 0 0',
                          }} />
                        )}
                      </div>
                      <span style={{ color: '#F5F0E8', fontSize: '14px', fontWeight: 600 }}>
                        {state.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom section: centered dots + branding */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '24px 40px',
            flexShrink: 0,
          }}
        >
          {/* Dot indicators - centered */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlide(i)
                  setProgress(0)
                }}
                style={{
                  width: i === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: i === currentSlide
                    ? '#E8784A'
                    : i < currentSlide
                    ? 'rgba(232, 120, 74, 0.5)'
                    : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {i === currentSlide && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      background: 'rgba(255,255,255,0.3)',
                      width: `${progress}%`,
                      borderRadius: '4px',
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Branding - below dots */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#5C5850',
              fontSize: '12px',
            }}
          >
            <span>Meesterproef 2026</span>
            <span>•</span>
            <span>Mio van Leenen</span>
          </div>
        </div>
      </div>

      {/* Right side - iPhone mockup + QR (1/4 width) */}
      <div
        style={{
          flex: '0 0 25%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'linear-gradient(180deg, rgba(232, 120, 74, 0.03) 0%, transparent 50%)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* iPhone with embedded app - bigger */}
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}>
          <IPhoneMockup>
            <iframe
              src="/"
              title="Balance Quest Demo"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '44px',
              }}
            />
          </IPhoneMockup>
        </div>

        {/* QR Code section - below iPhone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: '-30px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{
              padding: '6px',
              background: 'white',
              borderRadius: '6px',
              flexShrink: 0,
            }}
          >
            <QRCodeSVG
              value="https://balancequest.app"
              size={72}
              level="M"
              fgColor="#12141C"
              bgColor="white"
            />
          </div>

          <div>
            <p
              style={{
                margin: '0 0 2px 0',
                fontSize: '10px',
                color: '#8A857D',
              }}
            >
              Scan om te spelen
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: 700,
                color: '#E8784A',
              }}
            >
              BalanceQuest.App
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
