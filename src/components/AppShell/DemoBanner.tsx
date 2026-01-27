import { motion } from 'framer-motion'

export function DemoBanner() {
  return (
    <motion.div
      className="demo-banner"
      initial={{ y: -28 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <span className="demo-banner-text">
        Demo - Meesterproef Mio van Leenen
      </span>
    </motion.div>
  )
}
