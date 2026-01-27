import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Habit, Choice } from './gameState'
import { initialGameState, getBubbleState, BADGES, BUBBLE_STATE_INFO } from './gameState'
import { SCENES } from './scenes'
import { WelcomeScreen, NameScreen, HabitsScreen, BubbleIntroScreen } from './components/Onboarding'
import { SceneView } from './components/SceneView'
import { BQNotification } from './components/BQNotification'
import { AppShell } from './components/AppShell'
import type { TabId } from './components/AppShell/NavBar'
import { InsightsView, ProfileView, SettingsView, CompletedHomeView } from './components/Views'
import { PresentationView } from './components/Presentation'
import './index.css'


function App() {
  // Check if we're in presentation mode (path-based routing)
  const [isPresentationMode, setIsPresentationMode] = useState(
    window.location.pathname === '/presentatie'
  )

  useEffect(() => {
    const handlePopState = () => {
      setIsPresentationMode(window.location.pathname === '/presentatie')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // If presentation mode, render only the presentation
  if (isPresentationMode) {
    return <PresentationView />
  }
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [notification, setNotification] = useState<{
    message: string
    quote?: string
    points?: number
    badge?: { name: string; icon: string }
  } | null>(null)
  const [showBubbleStatus, setShowBubbleStatus] = useState(false)

  const bubbleState = getBubbleState(gameState.bubbleScore)

  // Game actions
  const startGame = useCallback(() => {
    setGameState(s => ({ ...s, phase: 'name' }))
  }, [])

  const setName = useCallback((name: string) => {
    setGameState(s => ({ ...s, playerName: name, phase: 'habits' }))
  }, [])

  const setHabits = useCallback((habits: Habit[]) => {
    setGameState(s => ({ ...s, selectedHabits: habits, phase: 'bubbleIntro' }))
  }, [])

  const startPlaying = useCallback(() => {
    setGameState(s => ({ ...s, phase: 'playing' }))
  }, [])

  const handleBubbleClick = useCallback(() => {
    setShowBubbleStatus(true)
    // Auto-close after 3 seconds
    setTimeout(() => setShowBubbleStatus(false), 3000)
  }, [])

  const handleChoice = useCallback((choice: Choice) => {
    const currentScene = SCENES[gameState.currentSceneIndex]
    const response = currentScene.bqResponses[choice.id]

    // Calculate new state
    const newPoints = gameState.points + choice.points
    const newBubbleScore = Math.max(-10, Math.min(10, gameState.bubbleScore + choice.bubbleEffect))
    const newBadges = [...gameState.badges]

    if (response.badge && !newBadges.includes(response.badge)) {
      newBadges.push(response.badge)
    }

    // Calculate day progress
    const newDayProgress = (gameState.currentSceneIndex + 1) / SCENES.length

    // Update game state
    setGameState(s => ({
      ...s,
      choices: [...s.choices, {
        sceneId: currentScene.id,
        choiceId: choice.id,
        category: choice.category,
      }],
      points: newPoints,
      bubbleScore: newBubbleScore,
      badges: newBadges,
      dayProgress: newDayProgress,
    }))

    // Show notification directly (speech bubble from the balance bubble)
    const badge = response.badge ? BADGES[response.badge as keyof typeof BADGES] : undefined
    setNotification({
      message: response.message.replace('{name}', gameState.playerName),
      quote: response.quote,
      points: choice.points > 0 ? choice.points : undefined,
      badge: badge ? { name: badge.name, icon: badge.icon } : undefined,
    })
  }, [gameState])

  const closeNotification = useCallback(() => {
    setNotification(null)

    // Move to next scene or end game
    const nextIndex = gameState.currentSceneIndex + 1
    if (nextIndex >= SCENES.length) {
      setGameState(s => ({ ...s, phase: 'reflection' }))
    } else {
      setGameState(s => ({ ...s, currentSceneIndex: nextIndex }))
    }
  }, [gameState.currentSceneIndex])

  const restart = useCallback(() => {
    setGameState(initialGameState)
    setActiveTab('home') // Reset to home tab on restart
  }, [])

  // Helper for rendering app content based on active tab
  const renderAppContent = () => {
    switch (activeTab) {
      case 'home':
        // During playing: show scene, after completion: show summary
        if (gameState.phase === 'playing') {
          const currentScene = SCENES[gameState.currentSceneIndex]
          return (
            <SceneView
              scene={currentScene}
              playerName={gameState.playerName}
              bubbleState={bubbleState}
              points={gameState.points}
              earnedBadges={gameState.badges}
              progress={(gameState.currentSceneIndex + 1) / SCENES.length}
              onChoice={handleChoice}
              onBubbleClick={handleBubbleClick}
            />
          )
        } else {
          // reflection or results phase - show completed home
          return <CompletedHomeView gameState={gameState} onRestart={restart} />
        }

      case 'insights':
        return <InsightsView gameState={gameState} />

      case 'profile':
        return <ProfileView gameState={gameState} />

      case 'settings':
        return <SettingsView onRestart={restart} />

      default:
        return null
    }
  }

  // Render current phase
  const renderContent = () => {
    switch (gameState.phase) {
      case 'welcome':
        return <WelcomeScreen onStart={startGame} />

      case 'name':
        return <NameScreen onSubmit={setName} />

      case 'habits':
        return <HabitsScreen onSubmit={setHabits} />

      case 'bubbleIntro':
        return (
          <BubbleIntroScreen
            playerName={gameState.playerName}
            onContinue={startPlaying}
          />
        )

      case 'playing':
      case 'reflection':
      case 'results':
        // All these phases use tab-based navigation
        return renderAppContent()

      default:
        return null
    }
  }

  // Determine if nav bar should show (during playing AND after completion)
  const showNavBar = ['playing', 'reflection', 'results'].includes(gameState.phase)

  return (
    <AppShell
      showNavBar={showNavBar}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Bubble status popup */}
      <AnimatePresence>
        {showBubbleStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: 'calc(var(--safe-area-top, 0px) + 320px)',
              right: 'var(--space-md)',
              zIndex: 110,
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-bg-glass)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-light)',
              maxWidth: '200px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
              <span style={{ color: BUBBLE_STATE_INFO[bubbleState].color, fontSize: '16px' }}>●</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
                {BUBBLE_STATE_INFO[bubbleState].label}
              </span>
            </div>
            <p style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              margin: 0,
              lineHeight: 1.4,
            }}>
              {BUBBLE_STATE_INFO[bubbleState].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content layer */}
      {renderContent()}

      {/* BQ Notification overlay */}
      <AnimatePresence>
        {notification && (
          <BQNotification
            message={notification.message}
            quote={notification.quote}
            points={notification.points}
            badge={notification.badge}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>
    </AppShell>
  )
}

export default App
