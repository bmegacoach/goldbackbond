import { motion } from 'framer-motion'
import { TrendingUp, Clock, Shield, Star } from 'lucide-react'

interface AggressiveRewardsOfferProps {
  onBuyClick?: () => void
}

const AggressiveRewardsOffer = ({ onBuyClick }: AggressiveRewardsOfferProps) => {
  const rewardsStructure = [
    { 
      period: 'Month 1', 
      apr: '50%', 
      highlight: true, 
      description: 'Launch Bonus' 
    },
    { 
      period: 'Month 2', 
      apr: '30%', 
      highlight: false, 
      description: 'Early Adopter' 
    },
    { 
      period: 'Month 3', 
      apr: '20%', 
      highlight: false, 
      description: 'Growth Phase' 
    },
    { 
      period: 'Month 4+', 
      apr: '9%', 
      highlight: false, 
      description: 'Sustainable Rate' 
    }
  ]

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 rounded-full px-6 py-2 mb-6">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
              Limited Time Launch Offer
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
            Aggressive <span className="text-gradient bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">Rewards</span> Launch
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Get incredible rewards with our time-decay APR structure designed to reward early adopters who participate in ecosystem growth.
          </p>
        </motion.div>

        {/* Rewards Structure Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
          {rewardsStructure.map((tier, index) => (
            <motion.div
              key={tier.period}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative p-6 sm:p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                tier.highlight 
                  ? 'bg-gradient-to-br from-amber-500/20 to-red-500/20 border-amber-500/50 shadow-2xl shadow-amber-500/25' 
                  : 'bg-slate-800/60 border-slate-700/50 hover:border-amber-500/30'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-red-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    BEST VALUE
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{tier.period}</h3>
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${
                  tier.highlight ? 'text-amber-400' : 'text-white'
                }`}>
                  {tier.apr}
                </div>
                <p className="text-xs sm:text-sm font-medium text-amber-400 mb-3 sm:mb-4">APR</p>
                <p className="text-gray-400 text-xs sm:text-sm">{tier.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-slate-800/40 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">$2M Reward Pool</h4>
              <p className="text-gray-400 text-sm">Funded rewards pool plus 0.3% platform fees for sustainable rewards</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">USDGB Rewards</h4>
              <p className="text-gray-400 text-sm">All rewards paid in USDGB tokens backed by gold certificates</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Gold Certificate Backed</h4>
              <p className="text-gray-400 text-sm">Each USDGB token backed by physical gold certificates with 3:1 value ratio</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBuyClick}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl text-sm sm:text-base shadow-2xl shadow-amber-500/25 transition-all duration-300 flex items-center justify-center touch-manipulation"
          >
            <span className="whitespace-nowrap">Start Earning 50% APR Now</span>
          </motion.button>
          <p className="text-gray-400 text-sm mt-4">
            Limited time offer • Terms and conditions apply
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default AggressiveRewardsOffer