import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseChain } from '../../lib/web3Config'
import WalletConnectModal from '../WalletConnectModal'
import { 
  Globe, 
  ArrowRight, 
  Shield,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Gift,
  Star,
  Rocket,
  Layers,
  Zap
} from 'lucide-react'

const MultichainPage = () => {
  const [showWalletModal, setShowWalletModal] = useState(false)
  
  // Wallet connection hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Mock blockchain data
  const blockchains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', logo: '⟠', gasPrice: 25, status: 'active' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', logo: '🟣', gasPrice: 0.01, status: 'active' },
    { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', logo: '🟡', gasPrice: 0.3, status: 'active' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', logo: '🔺', gasPrice: 0.5, status: 'active' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', logo: '🔵', gasPrice: 0.1, status: 'active' },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', logo: '🔴', gasPrice: 0.08, status: 'active' },
    { id: 'fantom', name: 'Fantom', symbol: 'FTM', logo: '👻', gasPrice: 0.02, status: 'active' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', logo: '☀️', gasPrice: 0.001, status: 'active' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', logo: '🅰️', gasPrice: 0.15, status: 'active' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', logo: '🔗', gasPrice: 0.05, status: 'active' },
    { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM', logo: '⚛️', gasPrice: 0.02, status: 'active' },
    { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', logo: '🌐', gasPrice: 0.001, status: 'active' }
  ]

  const multichainStats = {
    totalChains: 108
  }



  const handleJoinMultiChainProgram = async () => {
    if (!isConnected) {
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

    // Here you would implement the actual multi-chain program join logic
    console.log('Joining multi-chain bonus program with address:', address)
    alert('Joining Multi-Chain Bonus Program - This would connect to your smart contract!')
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/multi-chain.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                Multi-Chain Access
              </span>
              <br />
              <span className="text-white">100+ Blockchains</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trade USDGB seamlessly across all major blockchains with LayerZero's omnichain infrastructure
            </p>
          </motion.div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { label: 'Supported Chains', value: multichainStats.totalChains.toString(), icon: Globe },
              { label: 'Reward Pool', value: '$2M USDGB', icon: Gift },
              { label: 'Max APY Available', value: '65%', icon: Star }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 text-center"
                >
                  <Icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DEX Launch Bonus Program - Multi-Chain Benefits */}
      <section className="py-16 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 border-y border-blue-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full px-6 py-2 text-white font-bold text-sm animate-pulse">
                <Layers className="h-4 w-4 mr-2" />
                🚀 MULTI-CHAIN BONUS PROGRAM
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                100+ Blockchain Access
              </span>
              {" "}with DEX Launch Rewards
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Our DEX launch bonus program is enhanced by <strong className="text-blue-400">LayerZero integration</strong>, 
              giving you <strong className="text-indigo-400">seamless access to 100+ blockchains</strong> without bridging complexity. 
              Earn <strong className="text-purple-400">maximum rewards across all supported networks</strong>!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-2">100+</div>
                <div className="text-white font-semibold text-sm mb-1">Blockchains Supported</div>
                <div className="text-gray-400 text-xs">LayerZero omnichain technology</div>
              </div>
              
              <div className="bg-slate-800/60 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-indigo-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-400 mb-2">0</div>
                <div className="text-white font-semibold text-sm mb-1">Bridging Required</div>
                <div className="text-gray-400 text-xs">Seamless cross-chain access</div>
              </div>
              
              <div className="bg-slate-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-400 mb-2">65%</div>
                <div className="text-white font-semibold text-sm mb-1">Max APY Available</div>
                <div className="text-gray-400 text-xs">Across all supported chains</div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">🌐 Cross-Chain Bonus Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Unified Staking:</strong> Stake USDGB from any supported blockchain via LayerZero omnichain protocol</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Cross-Chain Rewards:</strong> Earn bonus APY regardless of your chain</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Settlement:</strong> No waiting for bridge confirmations</span>
                  </div>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Portfolio Unification:</strong> Manage all positions from one interface</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Gas Optimization:</strong> Choose your preferred chain for transactions</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Liquidity Access:</strong> Tap into liquidity pools across all chains</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 mb-8 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-3">📱 Perfect for Content Creators</h3>
              <p className="text-gray-300 text-sm mb-4">
                The multi-chain story adds incredible depth to your content! Cover DeFi on Ethereum, 
                gaming on Polygon, NFTs on Solana - all while earning maximum rewards from one program.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Ethereum', 'Polygon', 'BSC', 'Avalanche', 'Arbitrum', 'Solana', '+94 more'].map((chain, index) => (
                  <span key={chain} className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-gray-300">
                    {chain}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinMultiChainProgram}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-400 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center"
              >
                <Rocket className="h-5 w-5 mr-2" />
                {isConnected ? 'Join Multi-Chain Program' : 'Connect Wallet to Join'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-600 transition-all duration-200 flex items-center justify-center"
              >
                Explore Supported Chains
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.button>
            </div>

            <div className="mt-6 text-center">
              <div className="text-gray-400 text-sm mb-1">Access your $2M USDGB reward pool from any blockchain</div>
              <div className="text-blue-400 font-semibold">LayerZero-powered omnichain experience</div>
              <div className="text-xs text-gray-500 mt-2 max-w-2xl mx-auto">
                * LayerZero integration enables native staking from any supported blockchain. 
                Your USDGB tokens are seamlessly unified across all chains for staking in Uniswap pools, 
                eliminating the need for traditional bridging while maintaining full reward eligibility.
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Supported Blockchains Grid */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Supported Blockchains
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access USDGB on all major blockchain networks with seamless interoperability
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {blockchains.map((chain, index) => (
              <motion.div
                key={chain.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 text-center hover:bg-slate-800/80 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {chain.logo}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors">
                  {chain.name}
                </h3>
                <p className="text-gray-400 text-xs mb-2">{chain.symbol}</p>
                <div className="flex items-center justify-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    chain.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                  } animate-pulse`}></div>
                  <span className="text-xs text-gray-400 capitalize">{chain.status}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* More Chains Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-slate-800/60 border border-blue-500/20 rounded-full px-6 py-3">
              <span className="text-white font-medium">+{multichainStats.totalChains - blockchains.length} more chains</span>
              <Globe className="h-4 w-4 text-blue-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* LayerZero Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Powered by LayerZero
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience true omnichain functionality with the most advanced cross-chain protocol
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Ultra Secure',
                description: 'Immutable smart contracts with built-in security validation and monitoring across all chains'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Near-instant cross-chain transfers with optimized routing and minimal confirmation times'
              },
              {
                icon: DollarSign,
                title: 'Cost Efficient',
                description: 'Minimal fees with gas optimization and the best rates across all supported networks'
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 text-center"
                >
                  <Icon className="h-12 w-12 text-blue-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Join Multi-Chain Program"
        subtitle="Connect your wallet to access 100+ blockchain staking"
        operation="multichain_program"
      />
    </div>
  )
}

export default MultichainPage
