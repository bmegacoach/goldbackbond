import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Star
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestedActions?: string[]
}

interface LiveChatProps {
  isOpen: boolean
  onClose: () => void
  initialCategory?: string
}

interface ChatResponse {
  response: string
  suggestedActions: string[]
  escalate: boolean
  responseTime: number
  timestamp: string
  sessionId?: string
}

const LiveChatSupport = ({ isOpen, onClose, initialCategory = 'general' }: LiveChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [category, setCategory] = useState(initialCategory)
  const [showFeedback, setShowFeedback] = useState(false)
  const [escalationRequested, setEscalationRequested] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'general', label: 'General Questions', emoji: '💬' },
    { value: 'staking', label: 'Staking & Rewards', emoji: '📈' },
    { value: 'lending', label: 'Lending & Borrowing', emoji: '💰' },
    { value: 'technical', label: 'Technical Support', emoji: '🔧' },
    { value: 'institutional', label: 'Institutional Services', emoji: '🏛️' }
  ]

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: ChatMessage = {
        id: 'greeting',
        type: 'ai',
        content: `Hello! I'm the GoldBackBond AI assistant. I'm here to help you with questions about our gold-backed stablecoin, staking rewards, lending opportunities, and more. How can I assist you today?`,
        timestamp: new Date(),
        suggestedActions: [
          'What is USDGB?',
          'How does staking work?',
          'Tell me about lending',
          'View bonus program'
        ]
      }
      setMessages([greeting])
    }
  }, [isOpen, messages.length])

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('https://e3fxjgkrri.space.minimax.io/api/support/live-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage.trim(),
          category,
          sessionId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: { success: boolean; data: ChatResponse } = await response.json()

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          type: 'ai',
          content: data.data.response,
          timestamp: new Date(),
          suggestedActions: data.data.suggestedActions
        }

        setMessages(prev => [...prev, aiMessage])

        // Handle escalation
        if (data.data.escalate && !escalationRequested) {
          setEscalationRequested(true)
          setTimeout(() => {
            const escalationMessage: ChatMessage = {
              id: `escalation_${Date.now()}`,
              type: 'ai',
              content: "🚨 I've detected this may need specialized attention. Would you like me to create a priority support ticket for you?",
              timestamp: new Date(),
              suggestedActions: ['Create Support Ticket', 'Continue with AI']
            }
            setMessages(prev => [...prev, escalationMessage])
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly.",
        timestamp: new Date(),
        suggestedActions: ['Try Again', 'Contact Support', 'View FAQ']
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedAction = (action: string) => {
    if (action === 'Create Support Ticket') {
      window.open('/contact', '_blank')
      return
    }
    
    if (action === 'Try Again') {
      // Retry last message
      const lastUserMessage = messages.filter(m => m.type === 'user').pop()
      if (lastUserMessage) {
        setCurrentMessage(lastUserMessage.content)
      }
      return
    }

    // Send as message
    setCurrentMessage(action)
    setTimeout(() => sendMessage(), 100)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add toast notification here
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-2xl border border-amber-500/20 w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-amber-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">GoldBackBond Support</h3>
                <p className="text-sm text-gray-400">AI-powered instant assistance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Category Selector */}
          <div className="px-6 py-3 border-b border-slate-700">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    category === cat.value
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-r from-amber-500 to-yellow-600'
                  }`}>
                    {message.type === 'user' ? 
                      <User className="h-4 w-4 text-white" /> : 
                      <Bot className="h-4 w-4 text-white" />
                    }
                  </div>

                  {/* Message Content */}
                  <div className={`relative ${message.type === 'user' ? 'mr-3' : 'ml-3'}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-100'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Copy button for AI messages */}
                      {message.type === 'ai' && (
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-xs text-gray-500 mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>

                    {/* Suggested Actions */}
                    {message.suggestedActions && message.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestedActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedAction(action)}
                            className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full hover:bg-amber-500/20 transition-colors border border-amber-500/30"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-700 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                      <span className="text-sm text-gray-300">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-amber-500/20">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none disabled:opacity-50"
                  maxLength={2000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {currentMessage.length}/2000 characters
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-3 rounded-xl hover:from-amber-400 hover:to-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['What is USDGB?', 'How to stake?', 'Lending rates?', 'Technical issue'].map((quick) => (
                <button
                  key={quick}
                  onClick={() => handleSuggestedAction(quick)}
                  className="px-3 py-1 bg-slate-700 text-gray-300 text-xs rounded-full hover:bg-slate-600 transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LiveChatSupport