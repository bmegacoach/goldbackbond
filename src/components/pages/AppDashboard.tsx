/**
 * AppDashboard - Main dashboard for the DeFi dApp
 * User-focused interface for managing USDGB positions
 */

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Lock, 
  DollarSign, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Target,
  Zap,
  Shield,
  Clock,
  Award
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { Link } from 'react-router-dom'
import { useSmartContractData, useWalletBalance } from '../../hooks/useSmartContractData'

const AppDashboard = () => {
  const { isConnected } = useAccount()
  const { metrics, formatCurrency, formatPercentage } = useSmartContractData()
  const { 
    formattedBalance, 
    formattedStakedAmount, 
    formattedPortfolioValue,
    isConnected: walletConnected 
  } = useWalletBalance()

  const portfolioStats = [
    {
      label: 'Total Balance',
      value: formattedBalance,
      icon: Coins,
      color: 'from-blue-400 to-blue-600',
      trend: '+2.4%',
      trendUp: true
    },
    {
      label: 'Staked Amount',
      value: formattedStakedAmount,
      icon: Lock,
      color: 'from-amber-400 to-yellow-600',
      trend: '+12.8%',
      trendUp: true
    },
    {
      label: 'Total Portfolio',
      value: formattedPortfolioValue,
      icon: PieChart,
      color: 'from-emerald-400 to-emerald-600',
      trend: '+8.7%',
      trendUp: true
    }
  ]

  const protocolStats = [
    {
      label: 'Total Value Locked',
      value: metrics ? formatCurrency(metrics.totalValueLocked) : '$89.5M',
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-600'
    },
    {
      label: 'Active Stakers',
      value: metrics?.totalStakers?.toLocaleString() || '1,247',
      icon: Target,
      color: 'from-green-400 to-green-600'
    },
    {
      label: 'Current APY',
      value: metrics ? formatPercentage(metrics.currentAPY) : '50%',
      icon: Zap,
      color: 'from-yellow-400 to-orange-600'
    },
    {
      label: 'Gold Price',
      value: metrics ? `$${metrics.liveGoldPrice?.toFixed(2)}` : '$2,683.88',
      icon: Award,
      color: 'from-amber-400 to-yellow-600'
    }
  ]

  const quickActions = [
    {
      title: 'Stake USDGB',
      description: 'Earn up to 65% with our staking program, access to 3:1 asset value and loan offers',
      icon: Lock,
      href: '/app/asset-management?tab=staking',
      color: 'from-amber-500 to-yellow-600',
      highlight: true
    },
    {
      title: 'Apply for a Loan',
      description: 'Leverage your USDGB holdings to access capital',
      icon: DollarSign,
      href: '/app/asset-management?tab=lending',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Lend and Earn',
      description: 'Provide liquidity and earn competitive returns',
      icon: TrendingUp,
      href: '/app/asset-management?tab=lending',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Portfolio Analytics',
      description: 'Track your performance and earnings',
      icon: PieChart,
      href: '/app/asset-management?tab=analytics',
      color: 'from-purple-500 to-indigo-600'
    }
  ]

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome to GoldBackBond
                {isConnected && (
                  <span className="text-amber-400 ml-2">DeFi</span>
                )}
              </h1>
              <p className="text-gray-400 text-lg">
                {isConnected && walletConnected 
                  ? 'Manage your USDGB positions and maximize your returns'
                  : 'Connect your wallet to access all DeFi features'
                }
              </p>
            </div>
            {isConnected && (
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Wallet Connected</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="h-6 w-6 text-amber-400 mr-2" />
              Your Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm font-medium ${
                        stat.trendUp ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        <span>{stat.trend}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Protocol Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 text-amber-400 mr-2" />
            Protocol Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {protocolStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 text-amber-400 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className={`group bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 hover:bg-slate-800/80 transition-all duration-300 ${
                    action.highlight ? 'ring-2 ring-amber-400/50 shadow-lg shadow-amber-400/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {action.highlight && (
                      <div className="flex items-center space-x-1 text-xs text-amber-400 font-medium">
                        <Clock className="h-3 w-3" />
                        <span>Limited Time</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                  <div className="flex items-center mt-4 text-amber-400 text-sm font-medium">
                    <span>Get Started</span>
                    <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AppDashboard