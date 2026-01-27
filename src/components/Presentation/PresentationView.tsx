import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { IPhoneMockup } from './IPhoneMockup'

const SLIDES = [
  {
    id: 'intro',
    title: 'Balance Quest',
    subtitle: 'Meesterproef Mio van Leenen',
    content: 'Een interactieve ervaring over gamification en gezonde gewoontes bij jongeren',
    icon: '🎓',
    highlight: 'Probeer het zelf!',
  },
  {
    id: 'problem',
    title: 'Het Probleem',
    subtitle: 'Schermtijd onder jongeren',
    content: 'Jongeren (12-18) spenderen gemiddeld 7+ uur per dag achter schermen. Dit beïnvloedt slaap, concentratie en welzijn.',
    icon: '📱',
    quote: '"Na school ben ik zo moe, dan ga ik toch maar gewoon even scrollen"',
  },
  {
    id: 'research',
    title: 'Onderzoeksvraag',
    subtitle: 'Hoe kan gamification helpen?',
    content: 'Hoe kan een app met ethische gamification jongeren helpen bewuster om te gaan met schermtijd zonder schuldgevoel te creëren?',
    icon: '🔬',
    highlight: 'Ethische gamification',
  },
  {
    id: 'octalysis',
    title: 'Octalysis Framework',
    subtitle: 'Core Drive 2: Development & Accomplishment',
    content: 'Niet manipuleren, maar motiveren. Focus op intrinsieke motivatie en het gevoel van vooruitgang.',
    icon: '🎮',
    points: [
      'Geen FOMO-tactieken',
      'Geen harde streaks',
      'Geen schuldgevoelens',
    ],
  },
  {
    id: 'sdt',
    title: 'Self-Determination Theory',
    subtitle: 'De drie basisbehoeften',
    content: 'Een wetenschappelijk onderbouwde aanpak voor duurzame gedragsverandering.',
    icon: '🧠',
    points: [
      '🎯 Autonomie - Jij maakt de keuzes',
      '⭐ Competentie - Voortgang zien',
      '💚 Verbondenheid - Je bubble als buddy',
    ],
  },
  {
    id: 'bubble',
    title: 'De Balansbubbel',
    subtitle: 'Je digitale buddy',
    content: 'Een visuele metafoor voor je welzijn. Geen oordeel, alleen bewustwording.',
    icon: '🫧',
    bubbleStates: [
      { color: '#6BCB9A', label: 'In balans' },
      { color: '#F5B742', label: 'Even checken' },
      { color: '#E87B7B', label: 'Uit balans' },
    ],
  },
  {
    id: 'features',
    title: 'BQ Features',
    subtitle: 'Bewustwording zonder dwang',
    content: 'Kleine momenten van reflectie, geen grote interventies.',
    icon: '✨',
    points: [
      '💬 Micro-reflecties',
      '🏆 Positieve badges',
      '💡 Motiverende quotes',
      '📊 Patroon-inzichten',
    ],
  },
  {
    id: 'conclusion',
    title: 'De Conclusie',
    subtitle: 'Gamification kan ethisch zijn',
    content: 'Door te focussen op bewustwording in plaats van gedragsmanipulatie, kan gamification jongeren helpen zonder ze te schaden.',
    icon: '💡',
    quote: '"Balans ziet er voor iedereen anders uit."',
  },
]

const SLIDE_DURATION = 8000 // 8 seconds per slide

export function PresentationView() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
      setProgress(0)
    }, SLIDE_DURATION)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100))
    }, SLIDE_DURATION / 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [currentSlide])

  const slide = SLIDES[currentSlide]

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0b0f 0%, #12141C 50%, #0a0b0f 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Left side - Presentation slides */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Slide indicators */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '60px',
            right: '60px',
            display: 'flex',
            gap: '8px',
          }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              onClick={() => {
                setCurrentSlide(i)
                setProgress(0)
              }}
              style={{
                flex: 1,
                height: '4px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: i === currentSlide
                    ? 'linear-gradient(90deg, #E8784A, #F4A574)'
                    : i < currentSlide
                    ? '#E8784A'
                    : 'transparent',
                  width: i === currentSlide ? `${progress}%` : i < currentSlide ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
            style={{
              maxWidth: '700px',
            }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{
                fontSize: '64px',
                marginBottom: '24px',
              }}
            >
              {slide.icon}
            </motion.div>

            {/* Title */}
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 800,
                color: '#F5F0E8',
                margin: '0 0 12px 0',
                lineHeight: 1.1,
              }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#E8784A',
                margin: '0 0 32px 0',
              }}
            >
              {slide.subtitle}
            </h2>

            {/* Content */}
            <p
              style={{
                fontSize: '20px',
                color: '#C9C4BC',
                lineHeight: 1.7,
                margin: '0 0 32px 0',
              }}
            >
              {slide.content}
            </p>

            {/* Optional highlight */}
            {slide.highlight && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, rgba(232, 120, 74, 0.2), rgba(232, 120, 74, 0.05))',
                  border: '1px solid rgba(232, 120, 74, 0.3)',
                  borderRadius: '12px',
                  color: '#F4A574',
                  fontWeight: 600,
                }}
              >
                {slide.highlight}
              </motion.div>
            )}

            {/* Optional quote */}
            {slide.quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  margin: 0,
                  padding: '20px 24px',
                  background: 'linear-gradient(135deg, rgba(232, 120, 74, 0.1), transparent)',
                  borderLeft: '3px solid #E8784A',
                  borderRadius: '0 12px 12px 0',
                  fontStyle: 'italic',
                  color: '#F4A574',
                  fontSize: '18px',
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
                transition={{ delay: 0.3 }}
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {slide.points.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '12px',
                      color: '#F5F0E8',
                      fontSize: '18px',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
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
                transition={{ delay: 0.3 }}
                style={{
                  display: 'flex',
                  gap: '24px',
                  marginTop: '16px',
                }}
              >
                {slide.bubbleStates.map((state, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.15, type: 'spring' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 20px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: state.color,
                        boxShadow: `0 0 20px ${state.color}66`,
                      }}
                    />
                    <span style={{ color: '#F5F0E8', fontSize: '16px' }}>
                      {state.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#5C5850',
            fontSize: '14px',
          }}
        >
          <span>Meesterproef 2024</span>
          <span>•</span>
          <span>Mio van Leenen</span>
        </div>
      </div>

      {/* Right side - iPhone mockup + QR */}
      <div
        style={{
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: 'linear-gradient(180deg, rgba(232, 120, 74, 0.05) 0%, transparent 50%)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* iPhone with embedded app */}
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

        {/* QR Code section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '16px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
          >
            <QRCodeSVG
              value="https://balancequest.app"
              size={120}
              level="M"
              fgColor="#12141C"
              bgColor="white"
            />
          </div>

          <div
            style={{
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                color: '#8A857D',
              }}
            >
              Scan om te spelen
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                color: '#E8784A',
                letterSpacing: '0.5px',
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
