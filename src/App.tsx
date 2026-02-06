import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Habit, Choice } from './gameState'
import { initialGameState, getBubbleState, BADGES, filterScenesForHabits } from './gameState'
import { SCENES } from './scenes'
import { WelcomeScreen, NameScreen, HabitsScreen, BubbleIntroScreen } from './components/Onboarding'
import { SceneView } from './components/SceneView'
import { BQNotification } from './components/BQNotification'
import { AppShell } from './components/AppShell'
import type { TabId } from './components/AppShell/NavBar'
import { InsightsView, ProfileView, SettingsView, CompletedHomeView } from './components/Views'
import { DayEndScreen } from './components/DayEndScreen'
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
  const [bubbleGiggle, setBubbleGiggle] = useState<{ message: string; active: boolean } | null>(null)

  const bubbleState = getBubbleState(gameState.bubbleScore)

  // Game actions
  const startGame = useCallback(() => {
    setGameState(s => ({ ...s, phase: 'name' }))
  }, [])

  const setName = useCallback((name: string) => {
    setGameState(s => ({ ...s, playerName: name, phase: 'habits' }))
  }, [])

  const setHabits = useCallback((habits: Habit[]) => {
    // Filter scenes based on selected habits
    const filtered = filterScenesForHabits(SCENES, habits)
    setGameState(s => ({
      ...s,
      selectedHabits: habits,
      filteredScenes: filtered,
      phase: 'bubbleIntro'
    }))
  }, [])

  const startPlaying = useCallback(() => {
    setGameState(s => ({ ...s, phase: 'playing' }))
  }, [])

  const BUBBLE_GIGGLES = [
    'Hé, dat kietelt! 🫧',
    'Hihihi!',
    'Aiii! Voorzichtig!',
    'Bloop bloop!',
    '*giechelt*',
    'Nog een keer!',
    'Ik word er duizelig van!',
    'Pssst... neem een pauze 🤫',
    'Wie is hier de baas? 😏',
    'Ik ben je bubbel, niet je stressbal!',
    'Doe dat nog eens!',
    'Woehoe! 🫧',
  ]

  const handleBubbleClick = useCallback(() => {
    if (bubbleGiggle?.active) return // Don't stack giggles
    const message = BUBBLE_GIGGLES[Math.floor(Math.random() * BUBBLE_GIGGLES.length)]
    setBubbleGiggle({ message, active: true })
    setTimeout(() => setBubbleGiggle(null), 2500)
  }, [bubbleGiggle])

  // Use filtered scenes
  const activeScenes = gameState.filteredScenes.length > 0 ? gameState.filteredScenes : SCENES

  // Get scenes for current day
  const currentDayScenes = useMemo(() => {
    return activeScenes.filter(s => s.day === gameState.currentDay)
  }, [activeScenes, gameState.currentDay])

  // Find current scene index within current day
  const currentDaySceneIndex = useMemo(() => {
    const scenesBeforeCurrentDay = activeScenes.filter(s => s.day < gameState.currentDay).length
    return gameState.currentSceneIndex - scenesBeforeCurrentDay
  }, [activeScenes, gameState.currentSceneIndex, gameState.currentDay])

  const handleChoice = useCallback((choice: Choice) => {
    const currentScene = activeScenes[gameState.currentSceneIndex]
    const response = currentScene.bqResponses[choice.id]

    // Calculate new state
    const newPoints = gameState.points + choice.points
    const newBubbleScore = Math.max(-10, Math.min(10, gameState.bubbleScore + choice.bubbleEffect))
    const newBadges = [...gameState.badges]

    if (response.badge && !newBadges.includes(response.badge)) {
      newBadges.push(response.badge)
    }

    // Calculate day progress (within current day)
    const newDayProgress = (currentDaySceneIndex + 1) / currentDayScenes.length

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

    // Check for personalized habit message
    let personalizedMessage = response.message.replace('{name}', gameState.playerName)
    if (response.habitMessage) {
      // Find first matching habit from user's selected habits
      const matchingHabit = gameState.selectedHabits.find(
        habit => response.habitMessage?.[habit]
      )
      if (matchingHabit && response.habitMessage[matchingHabit]) {
        // Use personalized message for this habit
        personalizedMessage = response.habitMessage[matchingHabit]!.replace('{name}', gameState.playerName)
      }
    }

    // Show notification directly (speech bubble from the balance bubble)
    const badge = response.badge ? BADGES[response.badge as keyof typeof BADGES] : undefined
    setNotification({
      message: personalizedMessage,
      quote: response.quote,
      points: choice.points > 0 ? choice.points : undefined,
      badge: badge ? { name: badge.name, icon: badge.icon } : undefined,
    })
  }, [gameState, activeScenes, currentDaySceneIndex, currentDayScenes.length])

  const closeNotification = useCallback(() => {
    setNotification(null)

    // Move to next scene, day end, or end game
    const nextIndex = gameState.currentSceneIndex + 1

    if (nextIndex >= activeScenes.length) {
      // Game complete
      setGameState(s => ({ ...s, phase: 'reflection' }))
    } else {
      const nextScene = activeScenes[nextIndex]
      const currentScene = activeScenes[gameState.currentSceneIndex]

      // Check if we're moving to a new day
      if (nextScene.day !== currentScene.day) {
        setGameState(s => ({ ...s, phase: 'dayEnd' }))
      } else {
        setGameState(s => ({ ...s, currentSceneIndex: nextIndex }))
      }
    }
  }, [gameState.currentSceneIndex, activeScenes])

  const handleContinueToNextDay = useCallback(() => {
    const nextIndex = gameState.currentSceneIndex + 1
    const nextScene = activeScenes[nextIndex]
    setGameState(s => ({
      ...s,
      currentSceneIndex: nextIndex,
      currentDay: nextScene.day as 1 | 2 | 3,
      dayProgress: 0,
      phase: 'playing'
    }))
  }, [gameState.currentSceneIndex, activeScenes])

  const handleEndGame = useCallback(() => {
    setGameState(s => ({ ...s, phase: 'reflection' }))
  }, [])

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
          const currentScene = activeScenes[gameState.currentSceneIndex]
          return (
            <SceneView
              scene={currentScene}
              playerName={gameState.playerName}
              bubbleState={bubbleState}
              points={gameState.points}
              earnedBadges={gameState.badges}
              progress={(currentDaySceneIndex + 1) / currentDayScenes.length}
              day={gameState.currentDay}
              onChoice={handleChoice}
              onBubbleClick={handleBubbleClick}
              isGiggling={bubbleGiggle?.active}
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

      case 'dayEnd':
        return (
          <DayEndScreen
            day={gameState.currentDay}
            choices={gameState.choices}
            points={gameState.points}
            onContinue={handleContinueToNextDay}
            onEnd={handleEndGame}
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
      {/* Bubble speech bubble easter egg */}
      <AnimatePresence>
        {bubbleGiggle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              position: 'fixed',
              top: 'calc(var(--safe-area-top, 0px) + 60px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 110,
              padding: 'var(--space-sm) var(--space-lg)',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              maxWidth: '240px',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <p style={{
              fontSize: 'var(--font-size-base)',
              color: '#1E293B',
              margin: 0,
              fontWeight: 600,
              lineHeight: 1.4,
            }}>
              {bubbleGiggle.message}
            </p>
            {/* Speech bubble tail */}
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              marginLeft: '-8px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(255, 255, 255, 0.95)',
            }} />
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
