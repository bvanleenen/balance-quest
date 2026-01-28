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

// Micro-expression modifiers
function getExpressionModifiers(expression?: BubbleExpression) {
  switch (expression) {
    case 'curious':
      return { eyeScale: 1.15, eyeTilt: 0.1, mouthCurve: 0.02 }
    case 'concerned':
      return { eyeScale: 1.0, eyeTilt: -0.08, mouthCurve: -0.03 }
    case 'supportive':
      return { eyeScale: 1.05, eyeTilt: 0, mouthCurve: 0.04 }
    case 'celebratory':
      return { eyeScale: 1.2, eyeTilt: 0.05, mouthCurve: 0.08 }
    default:
      return { eyeScale: 1.0, eyeTilt: 0, mouthCurve: 0 }
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

interface AnimatedBubbleProps {
  state: BubbleState
  tiltX: number
  tiltY: number
}

// Main animated bubble mesh
function AnimatedBubble({ state, tiltX, tiltY }: AnimatedBubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  const animation = getStateAnimation(state)
  const color = new THREE.Color(getStateColor(state))

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Smooth position based on tilt
      const targetX = tiltX * 0.3
      const targetY = tiltY * 0.15
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05)

      // Subtle rotation based on tilt
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -tiltX * 0.1, 0.05)
    }

    if (materialRef.current) {
      // Animate wobble factor for breathing effect
      const breathe = Math.sin(clock.elapsedTime * animation.breatheSpeed) * 0.1
      materialRef.current.factor = animation.wobbleFactor + breathe

      // Smooth color transition
      materialRef.current.color.lerp(color, 0.05)
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={0.9}>
      <MeshWobbleMaterial
        ref={materialRef}
        color={getStateColor(state)}
        factor={animation.wobbleFactor}
        speed={animation.wobbleSpeed}
        roughness={0.2}
        metalness={0.1}
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
      <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
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
  const isSmiling = curve > 0

  return (
    <Billboard position={[0, -0.15, 0.92]}>
      <group scale={[0.7, 0.7, 0.7]}>
        {isSmiling ? (
          // Smile - arc facing down
          <mesh rotation={[0, 0, Math.PI]}>
            <ringGeometry args={[0.08, 0.12, 32, 1, 0, Math.PI * (0.5 + curve * 5)]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
        ) : curve < -0.02 ? (
          // Frown - arc facing up
          <mesh>
            <ringGeometry args={[0.06, 0.09, 32, 1, Math.PI * 0.15, Math.PI * 0.7]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
        ) : (
          // Neutral - straight line
          <mesh>
            <planeGeometry args={[0.15, 0.025]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
        )}
      </group>
    </Billboard>
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

  const eyeY = 0.08
  const eyeZ = 0.92
  const eyeSpacing = 0.2

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

// Scene component that handles tilt
function BubbleScene({ state, expression }: { state: BubbleState; expression?: BubbleExpression }) {
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

      {/* Main bubble */}
      <AnimatedBubble
        state={state}
        tiltX={tiltX}
        tiltY={tiltY}
      />

      {/* Face */}
      <BubbleFace
        state={state}
        expression={expression}
        tiltX={tiltX}
        tiltY={tiltY}
      />
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
}

export function BalanceBubble3D({
  state = 'content',
  size = 'full',
  expression,
  className = '',
  onClick,
}: BalanceBubble3DProps) {
  const cameraZ = size === 'small' ? 3 : size === 'medium' ? 2.8 : 2.5

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
        <BubbleScene state={state} expression={expression} />
      </Canvas>
    </div>
  )
}

export default BalanceBubble3D
