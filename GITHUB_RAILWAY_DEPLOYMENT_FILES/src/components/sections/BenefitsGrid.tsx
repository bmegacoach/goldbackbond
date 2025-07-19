import { motion } from 'framer-motion'
import {
  Shield,
  TrendingUp,
  BarChart3,
  Zap,
  Scissors,
  Clock,
  RefreshCw,
  Globe,
  DollarSign,
  Banknote,
  Users,
  HeadphonesIcon
} from 'lucide-react'

interface Benefit {
  name: string
  description: string
}

interface BenefitsGridProps {
  features?: Benefit[]
}

const BenefitsGrid = ({ features }: BenefitsGridProps) => {
  // Map features to icons
  const getIcon = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'Store of Value': Shield,
      'Hedge Against Inflation': TrendingUp,
      'Portfolio Diversification': BarChart3,
      'Easy to Transport': Zap,
      'Easy Divisibility': Scissors,
      '24/7 Trading with Ease': Clock,
      'Easily Redeemable': RefreshCw,
      'Neutral Monetary Unit': Globe,
      'Direct Gold Exposure': DollarSign,
      'No Custodian Fees': Banknote,
      '24/7 Customer Support': HeadphonesIcon,
      'Gold Ownership': Users
    }
    
    return iconMap[name] || Shield
  }

  const getGradient = (index: number) => {
    const gradients = [
      'from-amber-400 to-yellow-600',
      'from-emerald-400 to-teal-600',
      'from-blue-400 to-indigo-600',
      'from-purple-400 to-pink-600',
      'from-red-400 to-orange-600',
      'from-cyan-400 to-blue-600',
      'from-green-400 to-emerald-600',
      'from-yellow-400 to-amber-600',
      'from-pink-400 to-rose-600',
      'from-indigo-400 to-purple-600',
      'from-orange-400 to-red-600',
      'from-teal-400 to-cyan-600'
    ]
    return gradients[index % gradients.length]
  }

  // Default benefits if data is not loaded
  const defaultBenefits = [
    {
      name: 'Store of Value',
      description: 'Leverages gold\'s long history as a stable store of value, maintaining value throughout ages.'
    },
    {
      name: 'Hedge Against Inflation',
      description: 'Gold is traditionally viewed as a potential hedge against inflation and economic uncertainty.'
    },
    {
      name: 'Portfolio Diversification',
      description: 'Gold exposure may help diversify investment portfolios across different asset classes.'
    },
    {
      name: 'Easy to Transport',
      description: 'Transporting USDGB tokens is as easy as other crypto-assets, unlike physical gold.'
    },
    {
      name: 'Easy Divisibility',
      description: 'USDGB tokens are highly divisible into small increments, unlike physical gold certificates.'
    },
    {
      name: '24/7 Trading with Ease',
      description: 'USDGB tokens can be traded around the clock, 365 days a year, from anywhere.'
    },
    {
      name: 'Easily Redeemable',
      description: 'USDGB tokens can be exchanged 1:1 USD on any exchange listing them.'
    },
    {
      name: 'Neutral Monetary Unit',
      description: 'Gold certificates are a uniquely scarce monetary asset with discontinued production.'
    },
    {
      name: 'Direct Gold Exposure',
      description: 'Combines gold certificate value, USD stability, and crypto accessibility.'
    },
    {
      name: 'No Custodian Fees',
      description: 'Users incur no custody fees, allowing trade at 1:1 USD currency value.'
    },
    {
      name: '24/7 Customer Support',
      description: 'Global customer support team available in any location or time zone.'
    },
    {
      name: 'Gold Ownership',
      description: 'Grants ownership of real physical gold certificates through blockchain technology.'
    }
  ]

  const benefitsToShow = features || defaultBenefits

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {benefitsToShow.map((benefit, index) => {
        const Icon = getIcon(benefit.name)
        const gradient = getGradient(index)
        
        return (
          <motion.div
            key={benefit.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 hover:bg-slate-800/80 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
              {benefit.name}
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

export default BenefitsGrid
