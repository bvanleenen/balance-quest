import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshWobbleMaterial, Sphere, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { BubbleState, BubbleExpression } from '../gameState'
import { BUBBLE_STATE_INFO } from '../gameState'

// Get color for bubble state
function getStateColor(state: BubbleState): string {
  return BUBBLE_STATE_INFO[state].color
}

// Get animation parameters based on state
function getStateAnimation(state: BubbleState) {
  switch (state) {
    case 'energetic':
      return { wobbleSpeed: 3, wobbleFactor: 0.4, breatheSpeed: 1.2, eyeOpenness: 1.0 }
    case 'content':
      return { wobbleSpeed: 2, wobbleFactor: 0.3, breatheSpeed: 0.8, eyeOpenness: 0.9 }
    case 'attention':
      return { wobbleSpeed: 1.5, wobbleFactor: 0.25, breatheSpeed: 0.6, eyeOpenness: 0.8 }
    case 'tired':
      return { wobbleSpeed: 1, wobbleFactor: 0.2, breatheSpeed: 0.4, eyeOpenness: 0.5 }
    case 'outOfBalance':
      return { wobbleSpeed: 0.8, wobbleFactor: 0.15, breatheSpeed: 0.3, eyeOpenness: 0.4 }
  }
}

// Mouth shape types for expression overrides
type MouthShape = 'default' | 'o' | 'wide-smile'

// Micro-expression modifiers
function getExpressionModifiers(expression?: BubbleExpression) {
  switch (expression) {
    case 'curious':
      return { eyeScale: 1.15, eyeTilt: 0.1, mouthCurve: 0.02, mouthShape: 'o' as MouthShape }
    case 'concerned':
      return { eyeScale: 1.0, eyeTilt: -0.08, mouthCurve: -0.03, mouthShape: 'default' as MouthShape }
    case 'supportive':
      return { eyeScale: 1.05, eyeTilt: 0, mouthCurve: 0.04, mouthShape: 'default' as MouthShape }
    case 'celebratory':
      return { eyeScale: 1.2, eyeTilt: 0.05, mouthCurve: 0.08, mouthShape: 'wide-smile' as MouthShape }
    default:
      return { eyeScale: 1.0, eyeTilt: 0, mouthCurve: 0, mouthShape: 'default' as MouthShape }
  }
}

// Hook for device orientation (phone tilt)
function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({ x: 0, y: 0 })
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const x = (event.gamma || 0) / 45 // -1 to 1 (left/right tilt)
      const y = (event.beta || 0) / 45  // -1 to 1 (forward/back tilt)
      setOrientation({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y - 0.5)) // offset for natural phone holding angle
      })
    }

    // Request permission on iOS 13+
    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission === 'granted') {
            setHasPermission(true)
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } catch (e) {
          console.log('Device orientation permission denied')
        }
      } else {
        // Non-iOS or older iOS
        setHasPermission(true)
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return { orientation, hasPermission }
}

// Hook for mouse position fallback (desktop)
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}


// Main animated bubble mesh (only handles material animation, not position)
function AnimatedBubble({ state }: { state: BubbleState }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  const animation = getStateAnimation(state)
  const color = new THREE.Color(getStateColor(state))
  const baseScale = 0.55 // Smaller bubble to fit with hands

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Breathing via scale (subtle)
      const breathe = Math.sin(clock.elapsedTime * animation.breatheSpeed) * 0.03
      const scale = baseScale * (1 + breathe)
      meshRef.current.scale.setScalar(scale)
    }

    if (materialRef.current) {
      // Animate wobble factor for organic movement
      const wobbleBreath = Math.sin(clock.elapsedTime * animation.breatheSpeed * 0.7) * 0.15
      materialRef.current.factor = animation.wobbleFactor + wobbleBreath

      // Smooth color transition
      materialRef.current.color.lerp(color, 0.05)
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={baseScale}>
      <MeshWobbleMaterial
        ref={materialRef}
        color={getStateColor(state)}
        factor={animation.wobbleFactor}
        speed={animation.wobbleSpeed}
        roughness={0.3}
        metalness={0.05}
      />
    </Sphere>
  )
}

// Eye component
interface EyeProps {
  position: [number, number, number]
  isBlinking: boolean
  openness: number
  tiltX: number
  tiltY: number
  expressionMod: ReturnType<typeof getExpressionModifiers>
}

function Eye({ position, isBlinking, openness, tiltX, tiltY, expressionMod }: EyeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const pupilRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (groupRef.current) {
      // Eye squint when blinking
      const targetScaleY = isBlinking ? 0.1 : openness * expressionMod.eyeScale
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScaleY, 0.3)

      // Expression tilt
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        expressionMod.eyeTilt,
        0.1
      )
    }

    if (pupilRef.current) {
      // Pupil follows tilt/mouse
      pupilRef.current.position.x = THREE.MathUtils.lerp(pupilRef.current.position.x, tiltX * 0.03, 0.1)
      pupilRef.current.position.y = THREE.MathUtils.lerp(pupilRef.current.position.y, tiltY * 0.03, 0.1)
    }
  })

  return (
    <Billboard position={position}>
      <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
        {/* Eye white */}
        <mesh>
          <circleGeometry args={[0.14, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Pupil */}
        <mesh ref={pupilRef} position={[0, 0, 0.01]}>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
        {/* Eye shine */}
        <mesh position={[0.04, 0.04, 0.02]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </Billboard>
  )
}

// Mouth component
interface MouthProps {
  state: BubbleState
  expressionMod: ReturnType<typeof getExpressionModifiers>
}

function Mouth({ state, expressionMod }: MouthProps) {
  // Get base mouth curve based on state
  const getBaseCurve = () => {
    switch (state) {
      case 'energetic': return 0.06
      case 'content': return 0.04
      case 'attention': return 0
      case 'tired': return -0.02
      case 'outOfBalance': return -0.04
    }
  }

  const curve = getBaseCurve() + expressionMod.mouthCurve
  const shape = expressionMod.mouthShape ?? 'default'

  // Render the appropriate mouth shape
  const renderMouth = () => {
    // Expression-forced shapes take priority
    if (shape === 'o') {
      // "O" mouth — small surprised/curious circle
      return (
        <mesh>
          <ringGeometry args={[0.03, 0.065, 32]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
      )
    }

    if (shape === 'wide-smile') {
      // Wide celebratory smile — open mouth (filled arc + teeth hint)
      return (
        <group>
          {/* Wide smile arc */}
          <mesh rotation={[0, 0, Math.PI]}>
            <ringGeometry args={[0.1, 0.14, 32, 1, 0, Math.PI * 0.9]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
          {/* Inner fill for open-mouth effect */}
          <mesh rotation={[0, 0, Math.PI]} position={[0, 0, -0.001]}>
            <circleGeometry args={[0.1, 32, 0, Math.PI * 0.9]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        </group>
      )
    }

    // Default: curve-based mouth shapes
    if (curve > 0.10) {
      // Open mouth (very happy) — ellipse shape
      return (
        <group>
          <mesh rotation={[0, 0, Math.PI]} position={[0, 0.02, 0]}>
            <ringGeometry args={[0.06, 0.10, 32, 1, 0, Math.PI * 0.85]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI]} position={[0, 0.02, -0.001]}>
            <circleGeometry args={[0.06, 32, 0, Math.PI * 0.85]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        </group>
      )
    }

    if (curve > 0.08) {
      // Big smile — wider arc
      return (
        <mesh rotation={[0, 0, Math.PI]}>
          <ringGeometry args={[0.09, 0.13, 32, 1, 0, Math.PI * 0.85]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
      )
    }

    if (curve > 0.01) {
      // Small smile — original smile arc
      return (
        <mesh rotation={[0, 0, Math.PI]}>
          <ringGeometry args={[0.08, 0.12, 32, 1, 0, Math.PI * (0.5 + curve * 5)]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
      )
    }

    if (curve < -0.04) {
      // Big frown — wider, more pronounced
      return (
        <mesh>
          <ringGeometry args={[0.08, 0.11, 32, 1, Math.PI * 0.1, Math.PI * 0.8]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
      )
    }

    if (curve < -0.02) {
      // Small frown — original frown arc
      return (
        <mesh>
          <ringGeometry args={[0.06, 0.09, 32, 1, Math.PI * 0.15, Math.PI * 0.7]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
      )
    }

    // Neutral — flat line
    return (
      <mesh>
        <planeGeometry args={[0.15, 0.025]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>
    )
  }

  return (
    <Billboard position={[0, -0.15, 0.58]}>
      <group scale={[0.4, 0.4, 0.4]}>
        {renderMouth()}
      </group>
    </Billboard>
  )
}

// Mickey Mouse-style glove hand component
interface HandProps {
  side: 'left' | 'right'
  tiltX: number
}

function CartoonHand({ side, tiltX }: HandProps) {
  const groupRef = useRef<THREE.Group>(null)
  const isLeft = side === 'left'
  const xPos = isLeft ? -0.52 : 0.52
  const mirror = isLeft ? -1 : 1

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime
      const phase = isLeft ? 0 : Math.PI

      // Organic idle movement: gentle sway + small bounce
      const sway = Math.sin(t * 1.2 + phase) * 0.08
      const bounce = Math.sin(t * 2.0 + phase) * 0.015
      const tiltWiggle = Math.sin(t * 0.8 + phase) * 0.04

      // Base rotation: hands angled outward and down from bubble
      const baseZ = isLeft ? -0.6 : 0.6
      groupRef.current.rotation.z = baseZ + sway
      groupRef.current.rotation.x = -0.3 + tiltWiggle
      groupRef.current.position.y = -0.35 + bounce

      // React to tilt/mouse
      const tiltEffect = tiltX * (isLeft ? 0.05 : -0.05)
      groupRef.current.position.x = xPos + tiltEffect
    }
  })

  // Fingers fan downward/outward from the palm
  const fingers = [
    { x: -0.055, y: -0.1, angle: -0.2, length: 0.09 },   // Index
    { x: -0.02, y: -0.12, angle: -0.06, length: 0.10 },   // Middle
    { x: 0.02, y: -0.12, angle: 0.06, length: 0.10 },     // Ring
    { x: 0.055, y: -0.1, angle: 0.2, length: 0.09 },      // Pinky
  ]

  return (
    <group
      ref={groupRef}
      position={[xPos, -0.35, 0.25]}
      rotation={[0, isLeft ? 0.5 : -0.5, 0]}
      scale={0.8}
    >
      {/* Wrist cuff — at the top, connecting to bubble */}
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.065, 0.025, 12, 24]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
      </mesh>

      {/* Palm — big puffy sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.35} />
      </mesh>

      {/* Four spread fingers — pointing downward */}
      {fingers.map((f, i) => (
        <group key={i} position={[f.x * mirror, f.y, 0]} rotation={[0, 0, f.angle * mirror]}>
          <mesh position={[0, -f.length / 2, 0]}>
            <capsuleGeometry args={[0.036, f.length, 8, 8]} />
            <meshStandardMaterial color="#FAFAFA" roughness={0.35} />
          </mesh>
          <mesh position={[0, -(f.length + 0.02), 0]}>
            <sphereGeometry args={[0.036, 12, 12]} />
            <meshStandardMaterial color="#FAFAFA" roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Thumb — separated from palm, pointing inward */}
      <group
        position={[mirror * -0.18, 0.0, 0.06]}
        rotation={[0, 0, mirror * 1.2]}
      >
        <mesh position={[0, -0.05, 0]}>
          <capsuleGeometry args={[0.042, 0.1, 8, 8]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.11, 0]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.35} />
        </mesh>
      </group>

      {/* Three dark lines on back of hand */}
      {[-0.025, 0, 0.025].map((offset, i) => (
        <mesh key={`line-${i}`} position={[offset * mirror, -0.01, 0.14]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.007, 0.09]} />
          <meshBasicMaterial color="#94A3B8" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// Face container with blinking logic
interface BubbleFaceProps {
  state: BubbleState
  expression?: BubbleExpression
  tiltX: number
  tiltY: number
}

function BubbleFace({ state, expression, tiltX, tiltY }: BubbleFaceProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const animation = getStateAnimation(state)
  const expressionMod = getExpressionModifiers(expression)

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

  const eyeY = 0.04
  const eyeZ = 0.58
  const eyeSpacing = 0.12

  return (
    <group>
      {/* Left eye */}
      <Eye
        position={[-eyeSpacing, eyeY, eyeZ]}
        isBlinking={isBlinking}
        openness={animation.eyeOpenness}
        tiltX={tiltX}
        tiltY={tiltY}
        expressionMod={expressionMod}
      />
      {/* Right eye */}
      <Eye
        position={[eyeSpacing, eyeY, eyeZ]}
        isBlinking={isBlinking}
        openness={animation.eyeOpenness}
        tiltX={tiltX}
        tiltY={tiltY}
        expressionMod={expressionMod}
      />
      {/* Mouth */}
      <Mouth state={state} expressionMod={expressionMod} />
    </group>
  )
}

// Animated group that moves everything together based on tilt
function TiltGroup({ children, tiltX, tiltY, isGiggling }: { children: React.ReactNode; tiltX: number; tiltY: number; isGiggling?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const giggleStartRef = useRef(0)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Smooth position based on tilt
      const targetX = tiltX * 0.2
      const targetY = tiltY * 0.1
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.65 + targetY, 0.05)

      // Giggle wiggle when tapped
      let giggleRotation = 0
      let giggleScale = 1
      if (isGiggling) {
        if (giggleStartRef.current === 0) giggleStartRef.current = clock.elapsedTime
        const elapsed = clock.elapsedTime - giggleStartRef.current
        const intensity = Math.max(0, 1 - elapsed * 1.5) // Decay over ~0.7s
        giggleRotation = Math.sin(elapsed * 25) * 0.15 * intensity
        giggleScale = 1 + Math.sin(elapsed * 18) * 0.08 * intensity
      } else {
        giggleStartRef.current = 0
      }

      // Subtle rotation based on tilt + giggle
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -tiltX * 0.08 + giggleRotation, 0.15)
      const baseScale = 1 * giggleScale
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, baseScale, 0.15))
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.65, 0]}>
      {children}
    </group>
  )
}

// Scene component that handles tilt
function BubbleScene({ state, expression, isGiggling }: { state: BubbleState; expression?: BubbleExpression; isGiggling?: boolean }) {
  const { orientation } = useDeviceOrientation()
  const mousePos = useMousePosition()

  // Use device orientation on mobile, mouse on desktop
  const tiltX = orientation.x !== 0 ? orientation.x : mousePos.x
  const tiltY = orientation.y !== 0 ? orientation.y : mousePos.y

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, 2, 4]} intensity={0.4} color="#6366F1" />

      {/* Main group - moves everything together based on tilt */}
      <TiltGroup tiltX={tiltX} tiltY={tiltY} isGiggling={isGiggling}>

      {/* Main bubble */}
      <AnimatedBubble state={state} />

      {/* Face */}
      <BubbleFace
        state={state}
        expression={expression}
        tiltX={tiltX}
        tiltY={tiltY}
      />

      {/* Cartoon hands (Kilroy style) */}
      <CartoonHand side="left" tiltX={0} />
      <CartoonHand side="right" tiltX={0} />

      </TiltGroup>
    </>
  )
}

// Main export component
interface BalanceBubble3DProps {
  state?: BubbleState
  size?: 'full' | 'small' | 'medium'
  expression?: BubbleExpression
  showEyes?: boolean
  className?: string
  onClick?: () => void
  isGiggling?: boolean
}

export function BalanceBubble3D({
  state = 'content',
  size = 'full',
  expression,
  className = '',
  onClick,
  isGiggling,
}: BalanceBubble3DProps) {
  const cameraZ = size === 'small' ? 3.5 : size === 'medium' ? 3.2 : 3.2

  return (
    <div
      className={`bubble-3d-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <BubbleScene state={state} expression={expression} isGiggling={isGiggling} />
      </Canvas>
    </div>
  )
}

export default BalanceBubble3D
