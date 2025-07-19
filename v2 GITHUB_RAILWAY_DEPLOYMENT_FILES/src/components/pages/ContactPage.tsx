import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Facebook, 
  Twitter,
  MessageSquare,
  Mail,
  Bot,
  Zap
} from 'lucide-react'
import LiveChatSupport from '../LiveChatSupport'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', href: '#', color: 'text-blue-400' },
    { icon: Send, name: 'Telegram', href: '#', color: 'text-blue-400' },
    { icon: Twitter, name: 'Twitter', href: '#', color: 'text-blue-400' }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-gradient bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get instant help with our AI assistant or send us a message for personalized support.
          </p>
          
          {/* Instant Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <motion.button
              onClick={() => setIsLiveChatOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3"
            >
              <Bot className="h-6 w-6" />
              💬 Chat with AI Assistant
              <Zap className="h-5 w-5" />
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 px-6 py-4 rounded-xl flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-emerald-400 font-bold text-lg">Instant Responses</div>
                <div className="text-gray-400 text-sm">Available 24/7</div>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                <p className="text-gray-400">An agent will contact you within 24 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you with USDGB..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
                    : submitStatus === 'success'
                    ? 'bg-green-600 text-white'
                    : submitStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-500/25'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <Send className="w-5 h-5" />
                    Message Sent Successfully!
                  </>
                ) : submitStatus === 'error' ? (
                  'Error - Please Try Again'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-4 bg-green-600/20 border border-green-500/30 rounded-xl"
                >
                  <p className="text-green-400 font-medium">
                    Thank you for your message! Our team will contact you within 24 hours.
                  </p>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">Connect with us on social media</p>
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl flex items-center justify-center ${social.color} hover:border-amber-500/30 transition-all duration-200`}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 p-8 bg-slate-800/30 backdrop-blur-sm border border-amber-500/20 rounded-3xl"
        >
          <h3 className="text-2xl font-bold text-white mb-4">24/7 Global Support</h3>
          <p className="text-gray-300 mb-6">
            Our expert team is available around the clock to assist you with USDGB staking, lending, 
            and multi-chain operations. We're committed to providing world-class support for your 
            gold-backed digital asset journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-amber-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Quick Response</h4>
              <p className="text-gray-400 text-sm">Within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-amber-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Expert Team</h4>
              <p className="text-gray-400 text-sm">Professional support</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-amber-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Global Reach</h4>
              <p className="text-gray-400 text-sm">Worldwide availability</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Live Chat Component */}
      <LiveChatSupport 
        isOpen={isLiveChatOpen} 
        onClose={() => setIsLiveChatOpen(false)}
        initialCategory="general"
      />
    </div>
  )
}

export default ContactPage