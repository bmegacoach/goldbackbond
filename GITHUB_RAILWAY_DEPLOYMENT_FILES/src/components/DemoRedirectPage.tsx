/**
 * DemoRedirectPage - Component for demo pages that redirect to the app
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Clock, Shield, ArrowRight } from 'lucide-react'

interface DemoRedirectPageProps {
  title: string
  target: string
}

const DemoRedirectPage = ({ title, target }: DemoRedirectPageProps) => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate(target)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, target])

  const handleLaunchNow = () => {
    navigate(target)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 text-center"
      >
        {/* Demo Badge */}
        <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
          <Shield className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400 font-semibold text-sm">DEMO VERSION</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        
        {/* Description */}
        <p className="text-gray-400 text-lg mb-8">
          This is a demonstration version of our {title.toLowerCase()}. 
          For full functionality and real-time data, please access the complete application.
        </p>

        {/* Countdown */}
        <div className="bg-slate-700/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Clock className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400 font-medium">Auto-redirecting in</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">{countdown}</div>
          <div className="text-gray-400 text-sm">seconds</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleLaunchNow}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25"
          >
            <span>LAUNCH APP NOW</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="bg-slate-700/50 border border-slate-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Back to Homepage</span>
          </button>
        </div>

        {/* Features Notice */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-blue-400 text-sm">
            <ExternalLink className="h-4 w-4 inline mr-2" />
            Full application includes real-time data, wallet integration, and advanced analytics
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default DemoRedirectPage