/**
 * FloatingHeader - Floating announcement header for the website
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FloatingHeader = () => {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-black animate-pulse" />
              <span className="font-semibold text-sm md:text-base">
                🎉 <span className="hidden sm:inline">DEX Launch Bonus Program:</span> 
                <span className="sm:hidden">DEX Launch:</span> Earn up to 50% APY + Gold Bonus!
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/app')}
                className="bg-black/20 hover:bg-black/30 text-black px-4 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm flex items-center space-x-1"
              >
                <span>LAUNCH APP</span>
                <ArrowRight className="h-3 w-3" />
              </button>
              
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-black/20 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingHeader