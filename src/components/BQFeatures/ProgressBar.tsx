import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number // 0 to 1
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <motion.div
        className="progress-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, progress * 100)}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}
