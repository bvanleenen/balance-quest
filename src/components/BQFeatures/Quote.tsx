import { motion } from 'framer-motion'

interface QuoteProps {
  text: string
}

export function Quote({ text }: QuoteProps) {
  return (
    <motion.div
      className="quote-block"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="quote-text">"{text}"</p>
    </motion.div>
  )
}
