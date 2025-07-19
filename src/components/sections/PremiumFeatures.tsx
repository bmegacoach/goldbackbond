import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Lock, 
  Users, 
  Globe, 
  TrendingUp, 
  BarChart3, 
  Wallet,
  ArrowRight,
  Shield,
  Zap,
  Target
} from 'lucide-react'

const PremiumFeatures = () => {
  const features = [
    {
      id: 'staking',
      title: 'Advanced Staking',
      description: 'Stake your USDGB tokens for 12 months and earn premium rewards with our 3:1 gold certificate value system.',
      href: '/staking',
      icon: Lock,
      gradient: 'from-amber-400 to-yellow-600',
      bgImage: '/images/staking-interface.png',
      stats: [
        { label: 'Lock Period', value: '12 Months' },
        { label: 'Ratio', value: '3:1 Gold' },
        { label: 'Rewards', value: 'Premium APY' }
      ]
    },
    {
      id: 'lending',
      title: 'Lending Platform',
      description: 'Access liquidity with our 70% LTV lending system. Borrow against your USDGB holdings with competitive rates.',
      href: '/lending',
      icon: Users,
      gradient: 'from-emerald-400 to-teal-600',
      bgImage: '/images/lending-platform.jpg',
      stats: [
        { label: 'Max LTV', value: '70%' },
        { label: 'Lenders', value: 'Vetted Pool' },
        { label: 'Rates', value: 'Competitive' }
      ]
    },
    {
      id: 'multichain',
      title: 'Multi-Chain Access',
      description: 'Trade USDGB across 100+ blockchains with LayerZero integration. Seamless cross-chain experience.',
      href: '/multichain',
      icon: Globe,
      gradient: 'from-blue-400 to-indigo-600',
      bgImage: '/images/multi-chain.png',
      stats: [
        { label: 'Chains', value: '100+' },
        { label: 'Protocol', value: 'LayerZero' },
        { label: 'Fees', value: 'Optimized' }
      ]
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => {
        const Icon = feature.icon
        
        return (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="group"
          >
            <Link to={feature.href} className="block">
              <div className="relative bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 hover:bg-slate-800/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden">
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-5 bg-cover bg-center rounded-3xl"
                  style={{
                    backgroundImage: `url(${feature.bgImage})`
                  }}
                />
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <p className="text-amber-400 font-bold text-lg">{stat.value}</p>
                      <p className="text-gray-500 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
                  <span className="font-semibold">Explore Feature</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

export default PremiumFeatures
