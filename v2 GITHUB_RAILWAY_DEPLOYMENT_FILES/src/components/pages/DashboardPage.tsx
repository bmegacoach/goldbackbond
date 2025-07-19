import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Lock,
  Users,
  Globe,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseChain } from '../../lib/web3Config'
import WalletConnectModal from '../WalletConnectModal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const DashboardPage = () => {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [operationType, setOperationType] = useState<'deposit' | 'withdraw' | null>(null)
  const navigate = useNavigate()
  
  // Wallet connection hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const [portfolioData, setPortfolioData] = useState({
    totalValue: 28500,
    dailyChange: 2.45,
    dailyChangeValue: 680,
    stakingBalance: 15000,
    lendingBalance: 8000,
    multichainBalance: 5500,
    availableBalance: 12000
  })

  const [activityData] = useState([
    { type: 'stake', amount: 5000, date: '2024-06-25', status: 'completed' },
    { type: 'bridge', amount: 2500, date: '2024-06-24', status: 'completed' },
    { type: 'lend', amount: 3000, date: '2024-06-23', status: 'completed' },
    { type: 'unstake', amount: 1000, date: '2024-06-22', status: 'pending' }
  ])

  const handleDeposit = async () => {
    if (!isConnected) {
      setOperationType('deposit')
      setShowWalletModal(true)
      return
    }

    if (chainId !== baseChain.id) {
      try {
        switchChain({ chainId: baseChain.id })
      } catch (error) {
        console.error('Failed to switch to Base network:', error)
        return
      }
    }

    // Here you would implement the actual deposit logic
    console.log('Initiating deposit...')
    alert('Deposit functionality - This would connect to your smart contract!')
  }

  const handleWithdraw = async () => {
    if (!isConnected) {
      setOperationType('withdraw')
      setShowWalletModal(true)
      return
    }

    if (chainId !== baseChain.id) {
      try {
        switchChain({ chainId: baseChain.id })
      } catch (error) {
        console.error('Failed to switch to Base network:', error)
        return
      }
    }

    // Here you would implement the actual withdraw logic
    console.log('Initiating withdrawal...')
    alert('Withdrawal functionality - This would connect to your smart contract!')
  }

  // Mock chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [20000, 22500, 21800, 25200, 27100, 28500],
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value: any) {
            return '$' + value.toLocaleString()
          }
        }
      }
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'stake': return Lock
      case 'bridge': return Globe
      case 'lend': return Users
      case 'unstake': return Zap
      default: return DollarSign
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'stake': return 'text-amber-400'
      case 'bridge': return 'text-blue-400'
      case 'lend': return 'text-emerald-400'
      case 'unstake': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Portfolio Dashboard</h1>
              <p className="text-gray-300">Welcome back! Here's your USDGB portfolio overview.</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button 
                onClick={handleDeposit}
                className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg font-medium hover:bg-amber-500/30 transition-colors flex items-center space-x-2"
              >
                {!isConnected ? (
                  <>
                    <Wallet className="h-4 w-4" />
                    <span>Connect to Deposit</span>
                  </>
                ) : (
                  <span>Deposit</span>
                )}
              </button>
              <button 
                onClick={handleWithdraw}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center space-x-2"
              >
                {!isConnected ? (
                  <>
                    <Wallet className="h-4 w-4" />
                    <span>Connect to Withdraw</span>
                  </>
                ) : (
                  <span>Withdraw</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Overview */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Total Portfolio Value */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="lg:col-span-2 bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Total Portfolio Value</h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl font-bold text-white">
                      ${portfolioData.totalValue.toLocaleString()}
                    </span>
                    <div className={`flex items-center space-x-1 ${
                      portfolioData.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {portfolioData.dailyChange >= 0 ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                      <span className="font-semibold">
                        {portfolioData.dailyChange >= 0 ? '+' : ''}{portfolioData.dailyChange}%
                      </span>
                      <span className="text-gray-400">
                        (${portfolioData.dailyChangeValue >= 0 ? '+' : ''}${portfolioData.dailyChangeValue})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                  <p className="text-gray-400 text-sm">Last updated: Now</p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Lock className="h-6 w-6 text-amber-400" />
                  </div>
                  <span className="text-amber-400 text-sm font-medium">Staking</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  ${portfolioData.stakingBalance.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">12.5% APY</p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-emerald-400" />
                  </div>
                  <span className="text-emerald-400 text-sm font-medium">Lending</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  ${portfolioData.lendingBalance.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">8.2% APR</p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-blue-400 text-sm font-medium">Multi-Chain</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  ${portfolioData.multichainBalance.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">4 chains</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Earnings & Activity */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Earnings Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-amber-400 mr-3" />
                Earnings Overview
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">Staking Rewards</p>
                    <p className="text-gray-400 text-sm">Last 30 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold text-lg">$156.25</p>
                    <p className="text-green-400 text-sm">+12.5%</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">Lending Interest</p>
                    <p className="text-gray-400 text-sm">Last 30 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-lg">$54.67</p>
                    <p className="text-green-400 text-sm">+8.2%</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">Bridge Rewards</p>
                    <p className="text-gray-400 text-sm">Last 30 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-bold text-lg">$23.15</p>
                    <p className="text-green-400 text-sm">+2.1%</p>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-white font-semibold text-lg">Total Earnings</p>
                    <p className="text-amber-400 font-bold text-xl">$234.07</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 text-amber-400 mr-3" />
                Recent Activity
              </h2>

              <div className="space-y-4">
                {activityData.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  const colorClass = getActivityColor(activity.type)
                  
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium capitalize">{activity.type}</p>
                        <p className="text-gray-400 text-sm">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${activity.amount.toLocaleString()}</p>
                        <p className={`text-sm ${
                          activity.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {activity.status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6">
                <button className="w-full bg-slate-700 text-white py-3 rounded-xl font-medium hover:bg-slate-600 transition-colors">
                  View All Activity
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Stake USDGB', icon: Lock, color: 'amber', href: '/staking' },
                { label: 'Get Loan', icon: Users, color: 'emerald', href: '/lending' },
                { label: 'Bridge Tokens', icon: Globe, color: 'blue', href: '/multichain' },
                { label: 'Buy USDGB', icon: DollarSign, color: 'purple', href: '/' }
              ].map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(action.href)}
                    className={`bg-${action.color}-500/20 border border-${action.color}-500/30 rounded-2xl p-6 text-center hover:bg-${action.color}-500/30 transition-all duration-200 group cursor-pointer`}
                  >
                    <Icon className={`h-8 w-8 text-${action.color}-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`} />
                    <p className={`text-${action.color}-400 font-semibold`}>{action.label}</p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Standardized Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title={`Connect to ${operationType === 'deposit' ? 'Deposit' : 'Withdraw'}`}
        subtitle={`Connect your wallet to ${operationType === 'deposit' ? 'deposit funds' : 'withdraw funds'}`}
        operation={operationType || 'dashboard'}
      />
    </div>
  )
}

export default DashboardPage
