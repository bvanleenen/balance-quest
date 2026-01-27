import { motion } from 'framer-motion'

interface IPhoneMockupProps {
  children: React.ReactNode
}

export function IPhoneMockup({ children }: IPhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="iphone-mockup"
      style={{
        position: 'relative',
        width: '375px',
        height: '812px',
        background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        borderRadius: '55px',
        padding: '14px',
        boxShadow: `
          0 50px 100px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 2px 10px rgba(255, 255, 255, 0.1)
        `,
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '126px',
          height: '37px',
          background: '#000',
          borderRadius: '20px',
          zIndex: 10,
        }}
      />

      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--color-bg-dark, #12141C)',
          borderRadius: '44px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>

      {/* Side buttons */}
      {/* Volume up */}
      <div
        style={{
          position: 'absolute',
          left: '-3px',
          top: '180px',
          width: '3px',
          height: '30px',
          background: '#2d2d2d',
          borderRadius: '2px 0 0 2px',
        }}
      />
      {/* Volume down */}
      <div
        style={{
          position: 'absolute',
          left: '-3px',
          top: '220px',
          width: '3px',
          height: '30px',
          background: '#2d2d2d',
          borderRadius: '2px 0 0 2px',
        }}
      />
      {/* Power button */}
      <div
        style={{
          position: 'absolute',
          right: '-3px',
          top: '200px',
          width: '3px',
          height: '60px',
          background: '#2d2d2d',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </motion.div>
  )
}
