import { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Billboard } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { BubbleState } from '../gameState'
import { BUBBLE_STATE_INFO } from '../gameState'

// Get color for bubble state
function getStateColor(state: BubbleState): string {
  return BUBBLE_STATE_INFO[state].color
}

// Get animation parameters based on state
function getStateAnimation(state: BubbleState) {
  switch (state) {
    case 'energetic':
      return { breatheSpeed: 1.0, distort: 0.35, rotationSpeed: 0.004, bounce: 0.08, eyeOpenness: 1.0 }
    case 'content':
      return { breatheSpeed: 0.8, distort: 0.3, rotationSpeed: 0.003, bounce: 0.05, eyeOpenness: 0.9 }
    case 'attention':
      return { breatheSpeed: 0.6, distort: 0.25, rotationSpeed: 0.002, bounce: 0.04, eyeOpenness: 0.8 }
    case 'tired':
      return { breatheSpeed: 0.4, distort: 0.2, rotationSpeed: 0.001, bounce: 0.03, eyeOpenness: 0.5 }
    case 'outOfBalance':
      return { breatheSpeed: 0.3, distort: 0.15, rotationSpeed: 0.001, bounce: 0.02, eyeOpenness: 0.4 }
  }
}

// Get eye expression based on state
function getEyeExpression(state: BubbleState) {
  switch (state) {
    case 'energetic':
      return { eyeY: 0.15, pupilSize: 0.12, eyeSpacing: 0.25, expression: 'happy' }
    case 'content':
      return { eyeY: 0.12, pupilSize: 0.11, eyeSpacing: 0.22, expression: 'neutral' }
    case 'attention':
      return { eyeY: 0.1, pupilSize: 0.1, eyeSpacing: 0.2, expression: 'worried' }
    case 'tired':
      return { eyeY: 0.08, pupilSize: 0.09, eyeSpacing: 0.2, expression: 'tired' }
    case 'outOfBalance':
      return { eyeY: 0.05, pupilSize: 0.08, eyeSpacing: 0.18, expression: 'sad' }
  }
}

interface BubbleProps {
  state: BubbleState
  size: 'full' | 'small' | 'medium'
  onClick?: () => void
}

function Bubble({ state, size, onClick }: BubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetColor = useMemo(() => new THREE.Color(getStateColor(state)), [state])
  const currentColor = useRef(new THREE.Color(getStateColor(state)))
  const animation = getStateAnimation(state)

  const bubbleSize = size === 'small' ? 0.8 : size === 'medium' ? 1.0 : 1.2

  // Handle click
  const handleClick = useCallback(() => {
    if (onClick) {
      // Subtle bounce feedback
      if (meshRef.current) {
        meshRef.current.scale.setScalar(bubbleSize * 0.9)
      }
      onClick()
    }
  }, [onClick, bubbleSize])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Breathing animation with state-specific speed
      const breathe = Math.sin(clock.elapsedTime * animation.breatheSpeed) * animation.bounce
      const scale = bubbleSize * (1 + breathe)

      // Smooth scale interpolation for click feedback
      const currentScale = meshRef.current.scale.x
      const targetScale = scale
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.1))

      // Rotation
      meshRef.current.rotation.y += animation.rotationSpeed
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1

      // Smooth color transition
      currentColor.current.lerp(targetColor, 0.02)
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      if (material.color) {
        material.color.copy(currentColor.current)
        material.emissive?.copy(currentColor.current)
      }
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 64]}
      onClick={handleClick}
    >
      <MeshDistortMaterial
        color={getStateColor(state)}
        distort={animation.distort}
        speed={1.5}
        roughness={0.2}
        metalness={0.3}
        emissive={getStateColor(state)}
        emissiveIntensity={state === 'energetic' ? 0.6 : 0.4}
        toneMapped={false}
      />
    </Sphere>
  )
}

// Animated eye component using Billboard to always face camera
function Eye({ position, state, isBlinking }: { position: [number, number, number]; state: BubbleState; isBlinking: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const pupilRef = useRef<THREE.Group>(null)
  const expression = getEyeExpression(state)
  const animation = getStateAnimation(state)

  useFrame(({ pointer }) => {
    if (pupilRef.current && groupRef.current) {
      // Pupil follows mouse slightly
      const targetX = pointer.x * 0.04
      const targetY = pointer.y * 0.04
      pupilRef.current.position.x = THREE.MathUtils.lerp(pupilRef.current.position.x, targetX, 0.1)
      pupilRef.current.position.y = THREE.MathUtils.lerp(pupilRef.current.position.y, targetY, 0.1)

      // Eye squint based on state (blink animation)
      const blinkScale = isBlinking ? 0.1 : animation.eyeOpenness
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, blinkScale, 0.3)
    }
  })

  return (
    <Billboard position={position}>
      <group ref={groupRef}>
        {/* Eye white - slightly 3D for depth */}
        <mesh>
          <circleGeometry args={[0.18, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Pupil */}
        <group ref={pupilRef}>
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[expression.pupilSize, 32]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
          {/* Eye shine - gives life */}
          <mesh position={[0.05, 0.05, 0.02]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>
    </Billboard>
  )
}

// Get mouth shape based on state
function getMouthShape(state: BubbleState) {
  switch (state) {
    case 'energetic':
      return { curve: 0.15, width: 0.18, yPos: -0.15, type: 'happy' as const }
    case 'content':
      return { curve: 0.08, width: 0.14, yPos: -0.12, type: 'smile' as const }
    case 'attention':
      return { curve: 0, width: 0.1, yPos: -0.1, type: 'neutral' as const }
    case 'tired':
      return { curve: -0.04, width: 0.1, yPos: -0.08, type: 'tired' as const }
    case 'outOfBalance':
      return { curve: -0.1, width: 0.12, yPos: -0.08, type: 'sad' as const }
  }
}

// Animated mouth component - uses simple shapes for cross-browser compatibility
function Mouth({ state, size }: { state: BubbleState; size: 'full' | 'small' | 'medium' }) {
  const mouth = getMouthShape(state)

  const scale = size === 'small' ? 0.7 : size === 'medium' ? 1.0 : 1.2
  const zPos = size === 'small' ? 0.85 : size === 'medium' ? 1.1 : 1.3

  // Render different mouth shapes based on expression
  const renderMouth = () => {
    switch (mouth.type) {
      case 'happy':
        // Big smile - half circle at bottom
        return (
          <group>
            {/* Smile arc using ring segment */}
            <mesh rotation={[0, 0, Math.PI]}>
              <ringGeometry args={[0.08, 0.12, 32, 1, 0, Math.PI]} />
              <meshBasicMaterial color="#1E293B" />
            </mesh>
          </group>
        )
      case 'smile':
        // Gentle smile - smaller arc
        return (
          <mesh rotation={[0, 0, Math.PI]}>
            <ringGeometry args={[0.05, 0.08, 32, 1, 0, Math.PI * 0.8]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
        )
      case 'neutral':
        // Straight line
        return (
          <mesh>
            <planeGeometry args={[0.12, 0.025]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
        )
      case 'tired':
        // Slight frown - small downward curve
        return (
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.04, 0.06, 32, 1, Math.PI * 0.2, Math.PI * 0.6]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
        )
      case 'sad':
        // Frown - upside down smile
        return (
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.06, 0.09, 32, 1, Math.PI * 0.15, Math.PI * 0.7]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
        )
    }
  }

  return (
    <Billboard position={[0, mouth.yPos * scale, zPos]}>
      <group scale={[scale, scale, scale]}>
        {renderMouth()}
      </group>
    </Billboard>
  )
}

// Eyes and mouth container with blinking
function BubbleFace({ state, size }: { state: BubbleState; size: 'full' | 'small' | 'medium' }) {
  const [isBlinking, setIsBlinking] = useState(false)
  const expression = getEyeExpression(state)

  // Random blinking - more frequent gives more life
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      const blinkChance = state === 'tired' ? 0.5 : state === 'energetic' ? 0.2 : 0.3
      if (Math.random() < blinkChance) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 120)
      }
    }, 1800)
    return () => clearInterval(blinkInterval)
  }, [state])

  // Scale and position based on bubble size
  const eyeScale = size === 'small' ? 0.7 : size === 'medium' ? 1.0 : 1.2
  // Eyes need to be in front of the distorted sphere (radius ~1 + distortion)
  const eyeZ = size === 'small' ? 0.85 : size === 'medium' ? 1.1 : 1.3

  return (
    <>
      {/* Eyes */}
      <group scale={[eyeScale, eyeScale, eyeScale]} position={[0, expression.eyeY * 0.8, eyeZ]}>
        <Eye
          position={[-expression.eyeSpacing * 1.2, 0, 0]}
          state={state}
          isBlinking={isBlinking}
        />
        <Eye
          position={[expression.eyeSpacing * 1.2, 0, 0]}
          state={state}
          isBlinking={isBlinking}
        />
      </group>

      {/* Mouth */}
      <Mouth state={state} size={size} />
    </>
  )
}

// Legacy alias for backwards compatibility
const BubbleEyes = BubbleFace

// Floating particles with state-aware behavior
function FloatingParticles({ count = 60, state }: { count?: number; state: BubbleState }) {
  const ref = useRef<THREE.Points>(null)

  // Particles are more active when energetic
  const particleSpeed = state === 'energetic' ? 0.05 : state === 'tired' ? 0.01 : 0.03

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3
    }
    return pos
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * particleSpeed
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6366F1"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={state === 'energetic' ? 0.8 : 0.5}
      />
    </points>
  )
}

// Click handler wrapper
function ClickHandler({ onClick }: { onClick?: () => void }) {
  const { gl } = useThree()

  useMemo(() => {
    if (onClick) {
      gl.domElement.style.cursor = 'pointer'
    }
  }, [gl, onClick])

  return null
}

// Ensure true transparency for the scene
function TransparentBackground() {
  const { gl, scene } = useThree()

  useEffect(() => {
    gl.setClearColor(0x000000, 0)
    scene.background = null
  }, [gl, scene])

  return null
}

interface BalanceBubbleProps {
  state?: BubbleState
  size?: 'full' | 'small' | 'medium'
  showParticles?: boolean
  showEyes?: boolean
  className?: string
  onClick?: () => void
}

export function BalanceBubble({
  state = 'content',
  size = 'full',
  showParticles = true,
  showEyes = true,
  className = '',
  onClick,
}: BalanceBubbleProps) {
  const cameraPos = size === 'small' ? [0, 0, 3] : size === 'medium' ? [0, 0, 3.5] : [0, 0, 3.2]

  return (
    <div className={`w-full h-full ${className}`} style={{ background: 'transparent' }}>
      <Canvas
        camera={{ position: cameraPos as [number, number, number], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        {/* Ensure transparent background */}
        <TransparentBackground />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#6366F1" />
        {(size === 'full' || size === 'medium') && (
          <spotLight
            position={[0, 5, 3]}
            intensity={0.6}
            color="#A78BFA"
            angle={0.5}
            penumbra={1}
          />
        )}

        {/* Main bubble */}
        <Bubble state={state} size={size} onClick={onClick} />

        {/* Eyes - gives the bubble personality */}
        {showEyes && <BubbleEyes state={state} size={size} />}

        {/* Particles */}
        {showParticles && (size === 'full' || size === 'medium') && <FloatingParticles state={state} count={size === 'medium' ? 30 : 60} />}

        {/* Click handler */}
        <ClickHandler onClick={onClick} />

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={size === 'small' ? 0.5 : 0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default BalanceBubble
