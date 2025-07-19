/**
 * DemoBanner - Banner to indicate demo content and redirect to app
 */

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight, Shield } from 'lucide-react'

interface DemoBannerProps {
  page?: string
  className?: string
}

const DemoBanner = ({ page = 'feature', className = '' }: DemoBannerProps) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-lg p-4 mb-6 ${className}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-amber-400" />
          <div>
            <div className="text-amber-400 font-semibold text-sm">
              🎯 Demo Version - {page}
            </div>
            <div className="text-gray-300 text-xs">
              For full functionality, access the complete DeFi application
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/app')}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 flex items-center space-x-2 text-sm"
          >
            <span>LAUNCH APP</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          
          <a
            href="/"
            className="text-amber-400 hover:text-amber-300 transition-colors text-sm flex items-center space-x-1"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Homepage</span>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default DemoBanner