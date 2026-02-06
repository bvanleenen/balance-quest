// Game state management for Balance Quest

// Enhanced bubble states for more nuanced feedback
export type BubbleState = 'energetic' | 'content' | 'attention' | 'tired' | 'outOfBalance'

// Friendly mood names that map to BubbleState (for presentation/content use)
export type BubbleMood = 'happy' | 'thinking' | 'neutral' | 'proud' | 'excited' | 'worried'

export const MOOD_TO_BUBBLE_STATE: Record<BubbleMood, BubbleState> = {
  happy: 'energetic',
  thinking: 'attention',
  neutral: 'content',
  proud: 'energetic',
  excited: 'energetic',
  worried: 'tired',
}

// Legacy 3-color mapping for backward compatibility
export type BubbleColor = 'green' | 'orange' | 'red'

export type Habit =
  | 'less-phone'
  | 'take-breaks'
  | 'sleep-on-time'
  | 'more-exercise'
  | 'finish-tasks'

export const HABIT_LABELS: Record<Habit, string> = {
  'less-phone': 'Minder op mijn telefoon',
  'take-breaks': 'Genoeg pauzes nemen',
  'sleep-on-time': 'Op tijd naar bed',
  'more-exercise': 'Meer bewegen',
  'finish-tasks': 'Taken afmaken',
}

// Icon names map to Lucide React components
export const HABIT_ICONS: Record<Habit, string> = {
  'less-phone': 'Smartphone',
  'take-breaks': 'Coffee',
  'sleep-on-time': 'Moon',
  'more-exercise': 'Activity',
  'finish-tasks': 'CheckSquare',
}

export type ChoiceCategory = 'rest' | 'work' | 'social' | 'scroll' | 'neutral'

export interface Choice {
  id: string
  label: string
  subtext: string
  category: ChoiceCategory
  points: number
  bubbleEffect: number // positive = better, negative = worse
}

// Timed alerts that appear during a scene (simulates real-time bubble observations)
export type BubbleExpression = 'curious' | 'concerned' | 'supportive' | 'celebratory'

export interface TimedAlert {
  delay: number // seconds before alert appears
  message: string // the observation (non-judgmental)
  type: 'time' | 'pattern' | 'reflection' // type of observation
  expression?: BubbleExpression // how the bubble "feels"
}

export interface Scene {
  id: string
  title?: string
  time?: string
  location?: string
  intro: string
  text: string
  choices: Choice[]
  relevantHabits?: Habit[] // Which habits this scene relates to for personalization
  isCore?: boolean // Core scenes are always shown regardless of habit selection
  day: 1 | 2 | 3 // Which day this scene belongs to
  timedAlert?: TimedAlert // Optional real-time alert during scene
  bqResponses: Record<string, {
    message: string
    quote?: string
    bubbleChange?: BubbleColor
    badge?: string
    habitMessage?: Partial<Record<Habit, string>> // Personalized messages per habit
  }>
}

// Filter scenes based on selected habits
export function filterScenesForHabits(scenes: Scene[], selectedHabits: Habit[]): Scene[] {
  // If all 6 habits selected, show all scenes
  if (selectedHabits.length >= 5) {
    return scenes
  }

  const filteredScenes: Scene[] = []
  let hasEyeOpener = false

  for (const scene of scenes) {
    // Core scenes are always included
    if (scene.isCore) {
      filteredScenes.push(scene)
      continue
    }

    // Check if scene matches any selected habit
    const matchesHabit = scene.relevantHabits?.some(habit =>
      selectedHabits.includes(habit)
    )

    if (matchesHabit) {
      filteredScenes.push(scene)
    } else if (!hasEyeOpener && selectedHabits.length <= 2) {
      // Add one eye-opener scene for users with few habits selected
      filteredScenes.push(scene)
      hasEyeOpener = true
    }
  }

  return filteredScenes
}

export type GamePhase = 'welcome' | 'name' | 'habits' | 'bubbleIntro' | 'playing' | 'dayEnd' | 'reflection' | 'results'

export interface GameState {
  phase: GamePhase
  playerName: string
  selectedHabits: Habit[]
  currentSceneIndex: number
  currentDay: 1 | 2 | 3
  choices: { sceneId: string; choiceId: string; category: ChoiceCategory }[]
  points: number
  badges: string[]
  bubbleScore: number // -10 to +10, determines bubble state
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayProgress: number // 0 to 1, represents progress through the simulated day
  filteredScenes: Scene[] // Scenes filtered based on selected habits
}

export const initialGameState: GameState = {
  phase: 'welcome',
  playerName: '',
  selectedHabits: [],
  currentSceneIndex: 0,
  currentDay: 1,
  choices: [],
  points: 0,
  badges: [],
  bubbleScore: 6, // Start solidly in content
  timeOfDay: 'afternoon',
  dayProgress: 0,
  filteredScenes: [],
}

// Enhanced bubble state calculation with 5 states
export function getBubbleState(score: number): BubbleState {
  if (score >= 8) return 'energetic'
  if (score >= 4) return 'content'
  if (score >= 0) return 'attention'
  if (score >= -4) return 'tired'
  return 'outOfBalance'
}

// Convert to 3-color system for existing components
export function getBubbleColor(state: BubbleState): BubbleColor {
  switch (state) {
    case 'energetic':
    case 'content':
      return 'green'
    case 'attention':
    case 'tired':
      return 'orange'
    case 'outOfBalance':
      return 'red'
  }
}

// Bubble state descriptions for UI
export const BUBBLE_STATE_INFO: Record<BubbleState, {
  label: string
  description: string
  color: string
  glowColor: string
}> = {
  energetic: {
    label: 'Vol Energie',
    description: 'Je bubble voelt zich super! Blijf zo bezig.',
    color: '#34D399',
    glowColor: 'rgba(52, 211, 153, 0.5)',
  },
  content: {
    label: 'Tevreden',
    description: 'Je balans is goed. Lekker bezig!',
    color: '#6EE7B7',
    glowColor: 'rgba(110, 231, 183, 0.4)',
  },
  attention: {
    label: 'Aandacht Nodig',
    description: 'Je bubble begint wat te dimmen. Even checken?',
    color: '#FBBF24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
  },
  tired: {
    label: 'Vermoeid',
    description: 'Je bubble hangt wat. Misschien tijd voor rust?',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  outOfBalance: {
    label: 'Uit Balans',
    description: 'Je bubble is klein en mat. Tijd voor verandering.',
    color: '#F87171',
    glowColor: 'rgba(248, 113, 113, 0.4)',
  },
}

export function calculateStats(choices: GameState['choices']) {
  const stats = {
    rest: 0,
    work: 0,
    social: 0,
    scroll: 0,
    neutral: 0,
  }

  choices.forEach(c => {
    stats[c.category]++
  })

  return stats
}

// Pattern insights based on choices
export function getPatternInsights(choices: GameState['choices']): string[] {
  const stats = calculateStats(choices)
  const insights: string[] = []

  const total = choices.length

  if (stats.scroll >= total * 0.3) {
    insights.push('Je greep vaak naar je telefoon als ontspanning. Dat is herkenbaar!')
  }

  if (stats.rest >= total * 0.3) {
    insights.push('Je maakte bewust tijd voor rust. Goed voor je energie!')
  }

  if (stats.work >= total * 0.4) {
    insights.push('Je was productief vandaag. Vergeet niet ook te ontspannen.')
  }

  if (stats.social >= total * 0.25) {
    insights.push('Sociale connecties waren belangrijk voor je. Dat is mooi!')
  }

  if (stats.rest < total * 0.15) {
    insights.push('Je had weinig pauzes. Rust helpt je hersenen om te herstellen.')
  }

  return insights.slice(0, 3) // Max 3 insights
}

// Badge definitions - icon names map to Lucide React components
export const BADGES = {
  'bewuste-scroller': {
    id: 'bewuste-scroller',
    name: 'Bewuste Scroller',
    description: 'Je koos bewust om te stoppen met scrollen.',
    icon: 'Target',
  },
  'pauze-pro': {
    id: 'pauze-pro',
    name: 'Pauze Pro',
    description: 'Je nam minstens 2 pauzes.',
    icon: 'Coffee',
  },
  'nachtrust-held': {
    id: 'nachtrust-held',
    name: 'Nachtrust Held',
    description: 'Je koos voor slaap boven scherm.',
    icon: 'Moon',
  },
  'sociale-balancer': {
    id: 'sociale-balancer',
    name: 'Sociale Balancer',
    description: 'Je maakte tijd voor vrienden én verantwoordelijkheden.',
    icon: 'Users',
  },
  'ochtend-ritueel': {
    id: 'ochtend-ritueel',
    name: 'Ochtend Ritueel',
    description: 'Je begon de dag zonder direct te scrollen.',
    icon: 'Sunrise',
  },
  'uitgestelde-bevrediging': {
    id: 'uitgestelde-bevrediging',
    name: 'Uitgestelde Bevrediging',
    description: 'Je koos om iets op te slaan voor later.',
    icon: 'Clock',
  },
  'stem-gebruiken': {
    id: 'stem-gebruiken',
    name: 'Stem Gebruiken',
    description: 'Je sprak je uit, ook als het ongemakkelijk was.',
    icon: 'MessageCircle',
  },
  'fomo-fighter': {
    id: 'fomo-fighter',
    name: 'FOMO Fighter',
    description: 'Je koos rust boven angst om iets te missen.',
    icon: 'Shield',
  },
  'generatie-verbinder': {
    id: 'generatie-verbinder',
    name: 'Generatie-verbinder',
    description: 'Je maakte echt contact met iemand van een andere generatie.',
    icon: 'Heart',
  },
  'lichaam-luisteraar': {
    id: 'lichaam-luisteraar',
    name: 'Lichaam Luisteraar',
    description: 'Je stopte toen je lichaam signalen gaf.',
    icon: 'Activity',
  },
}

// Motivational quotes from the thesis
export const QUOTES = [
  'Kleine stappen brengen je verder dan je denkt.',
  'Niet perfect, wel vooruit.',
  'Een taak afronden is ook progressie.',
  'Ook rust is productief.',
  'Balans ziet er voor iedereen anders uit.',
  'Bewustzijn is de eerste stap naar verandering.',
  'Je hoeft niet alles vandaag te doen.',
  'Elke keuze is een nieuwe kans.',
]

export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}
