// 5-wide x 7-tall pixel font definitions (1 = filled, 0 = empty)
const PIXEL_FONT: Record<string, number[][]> = {
  B: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  L: [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  N: [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  C: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,1],
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  Q: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,0],
    [0,1,1,0,1],
  ],
  U: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  S: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  T: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
}

interface PixelLogoProps {
  /** Block size in pixels */
  blockSize?: number
  /** Gap between blocks */
  gap?: number
  /** Delay before animation starts (seconds) */
  delay?: number
  /** Show the green bubble above the logo */
  showBubble?: boolean
  /** Alignment: 'center' or 'left' */
  align?: 'center' | 'left'
}

// Inject CSS keyframe animation once
const STYLE_ID = 'pixel-logo-keyframes'
function ensureKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes pixelBlockIn {
      0% { opacity: 0; transform: scale(0); }
      60% { opacity: 1; transform: scale(1.15); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes bubbleIn {
      0% { opacity: 0; transform: scale(0) translateY(30px); }
      60% { opacity: 1; transform: scale(1.1) translateY(-5px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes bubbleFloat {
      0%, 100% { transform: translateY(-3px) scale(1); }
      50% { transform: translateY(3px) scale(1.05); }
    }
  `
  document.head.appendChild(style)
}

export function PixelLogo({ blockSize = 11, gap = 2, delay = 0.8, showBubble = true, align = 'center' }: PixelLogoProps) {
  ensureKeyframes()

  const word1 = 'BALANCE'
  const word2 = 'QUEST'

  // Build a flat row-by-row representation with letter spacing
  const buildRows = (word: string): { filled: boolean }[][] => {
    const glyphs = [...word].map(ch => PIXEL_FONT[ch]).filter(Boolean) as number[][][]
    const rows: { filled: boolean }[][] = []

    for (let row = 0; row < 7; row++) {
      const rowCells: { filled: boolean }[] = []
      glyphs.forEach((glyph, gi) => {
        const charWidth = glyph[0].length
        for (let c = 0; c < charWidth; c++) {
          rowCells.push({ filled: glyph[row][c] === 1 })
        }
        // Add letter gap (except after last letter)
        if (gi < glyphs.length - 1) {
          rowCells.push({ filled: false })
        }
      })
      rows.push(rowCells)
    }

    return rows
  }

  const rows1 = buildRows(word1)
  const rows2 = buildRows(word2)

  // Count total filled blocks for stagger timing
  const countFilled = (rows: { filled: boolean }[][]) =>
    rows.flat().filter(c => c.filled).length

  const alignItems = align === 'left' ? 'flex-start' : 'center'

  const renderWord = (rows: { filled: boolean }[][], baseDelay: number) => {
    const total = countFilled(rows)
    let blockIdx = 0

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap, alignItems: alignItems }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap }}>
            {row.map((cell, ci) => {
              if (!cell.filled) {
                return (
                  <div
                    key={ci}
                    style={{ width: blockSize, height: blockSize }}
                  />
                )
              }

              const currentIdx = blockIdx++
              const staggerDelay = baseDelay + (currentIdx / total) * 0.5

              return (
                <div
                  key={ci}
                  style={{
                    width: blockSize,
                    height: blockSize,
                    borderRadius: 2,
                    background: '#F5F0E8',
                    boxShadow: '0 0 6px rgba(232, 120, 74, 0.3)',
                    border: '1px solid #E8784A',
                    opacity: 0,
                    animation: `pixelBlockIn 0.4s ease-out ${staggerDelay}s forwards`,
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: alignItems, gap: blockSize }}>
      {/* Bubble above the logo */}
      {showBubble && (
        <div
          style={{
            opacity: 0,
            animation: `bubbleIn 0.6s ease-out ${Math.max(0, delay - 0.3)}s forwards`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #5EEAD4, #34D399, #059669)',
              boxShadow: `
                0 0 40px rgba(52, 211, 153, 0.4),
                0 0 80px rgba(52, 211, 153, 0.15),
                inset 0 -12px 24px rgba(0,0,0,0.2),
                inset 0 12px 24px rgba(255,255,255,0.25)
              `,
              position: 'relative',
              animation: `bubbleFloat 3s ease-in-out ${delay + 0.3}s infinite`,
            }}
          >
            {/* Shine highlight */}
            <div
              style={{
                position: 'absolute',
                top: '18%',
                left: '22%',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.5)',
                filter: 'blur(4px)',
              }}
            />
          </div>
        </div>
      )}

      {/* BALANCE */}
      {renderWord(rows1, delay)}

      {/* QUEST */}
      {renderWord(rows2, delay + 0.4)}
    </div>
  )
}
