const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

const sizes = [192, 512]
const outputDir = path.join(__dirname, '../public')

// Colors from design system
const COLORS = {
  background: '#12141C',
  bubble: '#6BCB9A',
  bubbleGlow: 'rgba(107, 203, 154, 0.4)',
  accent: '#E8784A',
}

function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, size, size)

  // Bubble glow
  const centerX = size / 2
  const centerY = size / 2
  const bubbleRadius = size * 0.32

  const glowGradient = ctx.createRadialGradient(
    centerX, centerY, bubbleRadius * 0.5,
    centerX, centerY, bubbleRadius * 1.8
  )
  glowGradient.addColorStop(0, COLORS.bubbleGlow)
  glowGradient.addColorStop(1, 'transparent')

  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, bubbleRadius * 1.8, 0, Math.PI * 2)
  ctx.fill()

  // Bubble gradient
  const bubbleGradient = ctx.createRadialGradient(
    centerX - bubbleRadius * 0.3,
    centerY - bubbleRadius * 0.3,
    0,
    centerX,
    centerY,
    bubbleRadius
  )
  bubbleGradient.addColorStop(0, '#8DE4B4')
  bubbleGradient.addColorStop(0.5, COLORS.bubble)
  bubbleGradient.addColorStop(1, '#4BA87C')

  ctx.fillStyle = bubbleGradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, bubbleRadius, 0, Math.PI * 2)
  ctx.fill()

  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.beginPath()
  ctx.ellipse(
    centerX - bubbleRadius * 0.25,
    centerY - bubbleRadius * 0.25,
    bubbleRadius * 0.35,
    bubbleRadius * 0.2,
    -Math.PI / 4,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Eyes
  const eyeRadius = bubbleRadius * 0.12
  const eyeY = centerY - bubbleRadius * 0.1
  const eyeSpacing = bubbleRadius * 0.35

  // Left eye
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath()
  ctx.arc(centerX - eyeSpacing, eyeY, eyeRadius, 0, Math.PI * 2)
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.arc(centerX + eyeSpacing, eyeY, eyeRadius, 0, Math.PI * 2)
  ctx.fill()

  // Eye highlights
  ctx.fillStyle = 'white'
  const highlightRadius = eyeRadius * 0.4
  ctx.beginPath()
  ctx.arc(centerX - eyeSpacing - eyeRadius * 0.2, eyeY - eyeRadius * 0.2, highlightRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(centerX + eyeSpacing - eyeRadius * 0.2, eyeY - eyeRadius * 0.2, highlightRadius, 0, Math.PI * 2)
  ctx.fill()

  // Smile
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = bubbleRadius * 0.06
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(centerX, centerY + bubbleRadius * 0.1, bubbleRadius * 0.25, 0.2 * Math.PI, 0.8 * Math.PI)
  ctx.stroke()

  return canvas.toBuffer('image/png')
}

// Generate icons
sizes.forEach(size => {
  const buffer = generateIcon(size)
  const filePath = path.join(outputDir, `icon-${size}.png`)
  fs.writeFileSync(filePath, buffer)
  console.log(`Generated: ${filePath}`)
})

// Generate apple-touch-icon
const appleIcon = generateIcon(180)
fs.writeFileSync(path.join(outputDir, 'apple-touch-icon.png'), appleIcon)
console.log('Generated: apple-touch-icon.png')

// Generate favicon
const favicon = generateIcon(32)
fs.writeFileSync(path.join(outputDir, 'favicon.ico'), favicon)
console.log('Generated: favicon.ico')

console.log('\nAll icons generated successfully!')
