import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Bot, Zap } from 'lucide-react'
import LiveChatSupport from './LiveChatSupport'

interface FloatingChatButtonProps {
  position?: 'bottom-right' | 'bottom-left'
  className?: string
}

const FloatingChatButton = ({ 
  position = 'bottom-right', 
  className = '' 
}: FloatingChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className={`fixed ${positionClasses[position]} z-40 ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className={`absolute bottom-16 ${
                position === 'bottom-right' ? 'right-0' : 'left-0'
              } bg-slate-800 border border-amber-500/20 rounded-xl p-4 shadow-2xl min-w-[280px]`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm mb-1">
                    GoldBackBond AI Assistant
                  </div>
                  <div className="text-gray-300 text-xs mb-2">
                    Get instant help with staking, lending, and technical questions
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Online</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-amber-400" />
                      <span className="text-amber-400 text-xs">Instant Response</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tooltip Arrow */}
              <div 
                className={`absolute top-full ${
                  position === 'bottom-right' ? 'right-4' : 'left-4'
                } w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-800`}
              ></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-2xl shadow-emerald-500/25 flex items-center justify-center text-white hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 group"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
          
          {/* Icon */}
          <MessageCircle className="h-7 w-7 relative z-10" />
          
          {/* Notification Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">AI</span>
          </motion.div>
        </motion.button>

        {/* Quick Action Indicators */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: showTooltip ? 1 : 0, 
            scale: showTooltip ? 1 : 0 
          }}
          transition={{ delay: 0.2 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-2"
        >
          {/* Quick indicators */}
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </motion.div>
      </motion.div>

      {/* Live Chat Modal */}
      <LiveChatSupport 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        initialCategory="general"
      />
    </>
  )
}

export default FloatingChatButton