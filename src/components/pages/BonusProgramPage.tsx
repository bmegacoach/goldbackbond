import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseChain } from '../../lib/web3Config'
import WalletConnectModal from '../WalletConnectModal'
import { 
  TrendingUp, 
  Coins, 
  Gift, 
  Clock, 
  Zap,
  Target,
  Award,
  BarChart3,
  Sparkles,
  Calendar,
  ArrowUp,
  Star,
  Rocket,
  DollarSign,
  Globe,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Percent,
  Timer,
  Flame
} from 'lucide-react'

const BonusProgramPage = () => {
  const [currentGoldPrice, setCurrentGoldPrice] = useState(2650)
  const [goldPriceChange, setGoldPriceChange] = useState(8.2)
  const [currentMonth, setCurrentMonth] = useState(1)
  const [showWalletModal, setShowWalletModal] = useState(false)
  
  // Wallet connection hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGoldPrice(prev => prev + (Math.random() - 0.5) * 10)
      setGoldPriceChange(prev => prev + (Math.random() - 0.5) * 0.5)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const apyStructure = [
    { month: 1, apy: 50, duration: "Month 1", status: "active", color: "from-red-500 to-orange-600", textColor: "text-red-400" },
    { month: 2, apy: 30, duration: "Month 2", status: "upcoming", color: "from-orange-500 to-yellow-600", textColor: "text-orange-400" },
    { month: 3, apy: 20, duration: "Month 3", status: "upcoming", color: "from-yellow-500 to-amber-600", textColor: "text-yellow-400" },
    { month: 4, apy: 9, duration: "Month 4+", status: "upcoming", color: "from-amber-500 to-yellow-600", textColor: "text-amber-400" }
  ]

  const goldBonusCalculation = () => {
    const increments = Math.floor(goldPriceChange / 5)
    const bonusAPY = Math.min(increments * 3, 15)
    return bonusAPY
  }

  const totalAPY = apyStructure[currentMonth - 1]?.apy + goldBonusCalculation()

  const handleJoinProgram = async () => {
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

    // Here you would implement the actual bonus program join logic
    console.log('Joining bonus program with address:', address)
    alert('Joining Bonus Program - This would connect to your smart contract!')
  }

  const programHighlights = [
    {
      icon: Flame,
      title: "50% APY Launch Month",
      description: "Massive first-month rewards for early liquidity providers",
      value: "50%",
      gradient: "from-red-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      title: "Gold Price Bonus",
      description: "3% additional APY per 5% gold price increase",
      value: `+${goldBonusCalculation()}%`,
      gradient: "from-amber-500 to-yellow-600"
    },
    {
      icon: Shield,
      title: "3:1 Leverage Unlock",
      description: "12-month stakers unlock 3:1 gold certificate value",
      value: "3:1",
      gradient: "from-emerald-500 to-blue-600"
    },
    {
      icon: Globe,
      title: "100+ Blockchains",
      description: "LayerZero integration for seamless cross-chain access",
      value: "100+",
      gradient: "from-blue-500 to-purple-600"
    }
  ]

  const programPhases = [
    {
      phase: "Phase 1: DEX Launch",
      timeline: "Month 1-3",
      apy: "50% → 30% → 20%",
      features: [
        "Uniswap USDGB/USDC or USDGB/USDT pool launch on Ethereum",
        "Time-decay APY structure for early adopters",
        "Gold price bonus activation",
        "$2M USDGB reward pool allocation"
      ],
      status: "active",
      color: "border-red-500/30 bg-red-500/10"
    },
    {
      phase: "Phase 2: CEX Expansion",
      timeline: "Month 4+",
      apy: "9% + Gold Bonus",
      features: [
        "Major centralized exchange listings",
        "Expanded trading pairs and liquidity",
        "Sustained 9% base APY",
        "Standard 9% APY (gold bonus concludes)"
      ],
      status: "upcoming",
      color: "border-blue-500/30 bg-blue-500/10"
    },
    {
      phase: "Phase 3: Institutional Integration",
      timeline: "Month 6+",
      apy: "9% + Premium Features",
      features: [
        "Third-party lender integration",
        "70% LTV leveraging activation",
        "Enterprise-grade staking rewards",
        "Premium institutional features"
      ],
      status: "planned",
      color: "border-emerald-500/30 bg-emerald-500/10"
    }
  ]

  const stakingBenefits = [
    {
      duration: "12-120 Month Commitment",
      multiplier: "3:1",
      benefits: ["3x gold certificate value", "70% LTV leveraging", "Premium lender access", "Maximum rewards", "Extended terms for larger loans"],
      recommended: true,
      note: "Terms subject to lender requirements"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ left: '10%', top: '20%' }}
        />
        
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
            scale: [1.2, 0.8, 1.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ right: '10%', bottom: '20%' }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-amber-400 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-red-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  DEX Launch
                </span>
                <br />
                <span className="text-white">Bonus Program</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Competitive yield opportunities with gold-backed security. Earn up to <span className="text-red-400 font-bold">65% APY</span> 
              with our time-decay structure plus dynamic gold bonuses on USDGB/USDC or USDGB/USDT pools.
            </p>
            
            {/* Live Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Live Program Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span className="text-white">Gold: ${currentGoldPrice.toLocaleString()}</span>
                <span className={goldPriceChange >= 0 ? "text-green-400" : "text-red-400"}>
                  {goldPriceChange >= 0 ? "+" : ""}{goldPriceChange.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-red-400" />
                <span className="text-white">Current APY: {totalAPY}%</span>
              </div>
            </div>
          </motion.div>

          {/* Program Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {programHighlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <div key={index} className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${highlight.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{highlight.value}</div>
                  <div className="text-lg font-semibold text-white mb-2">{highlight.title}</div>
                  <div className="text-gray-300 text-sm">{highlight.description}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* APY Structure Section */}
      <div className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Time-Decay APY Structure</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Massive rewards for early adopters with our innovative time-decay system. 
              The earlier you join, the higher your rewards!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {apyStructure.map((tier, index) => (
              <motion.div
                key={tier.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 ${
                  tier.status === 'active' ? 'border-red-500/50 shadow-red-500/20 shadow-lg' : 'border-gray-600/30'
                }`}
              >
                {tier.status === 'active' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      LIVE NOW
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.apy}%
                  </div>
                  <div className="text-white font-semibold mb-2">{tier.duration}</div>
                  <div className="text-gray-400 text-sm mb-4">Base APY</div>
                  
                  {goldBonusCalculation() > 0 && (
                    <div className="bg-amber-500/20 rounded-lg p-3 border border-amber-500/30">
                      <div className="text-amber-400 font-bold">+{goldBonusCalculation()}% Gold Bonus</div>
                      <div className="text-xs text-gray-300">Total: {tier.apy + goldBonusCalculation()}%</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gold Bonus Explanation */}
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl p-8 border border-amber-500/30 mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-amber-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Dynamic Gold Price Bonus (6 Months)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">+3%</div>
                <div className="text-white font-semibold mb-1">Per 5% Gold Increase</div>
                <div className="text-gray-300 text-sm">First 6 months only</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">15%</div>
                <div className="text-white font-semibold mb-1">Maximum Bonus</div>
                <div className="text-gray-300 text-sm">Capped at 25% gold increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">{goldBonusCalculation()}%</div>
                <div className="text-white font-semibold mb-1">Current Bonus</div>
                <div className="text-gray-300 text-sm">Based on {goldPriceChange.toFixed(1)}% gold rise</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Staking Incentive */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">12-Month Staking Incentive</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Unlock unprecedented leverage and lending opportunities with our long-term commitment rewards.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="max-w-md">
            {stakingBenefits.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`relative bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border-2 ${
                  option.recommended 
                    ? 'border-emerald-500/50 shadow-emerald-500/20 shadow-lg' 
                    : 'border-gray-600/30'
                }`}
              >
                {option.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      RECOMMENDED
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white mb-2">{option.duration}</div>
                  <div className={`text-2xl font-bold mb-4 ${
                    option.recommended ? 'text-emerald-400' : 'text-gray-400'
                  }`}>
                    {option.multiplier} Value
                  </div>
                </div>

                <div className="space-y-3">
                  {option.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center">
                      <CheckCircle className={`h-5 w-5 mr-3 ${
                        option.recommended ? 'text-emerald-400' : 'text-gray-400'
                      }`} />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                {option.recommended && (
                  <div className="mt-6 bg-emerald-500/20 rounded-lg p-4 border border-emerald-500/30">
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold mb-1">70% LTV Available</div>
                      <div className="text-xs text-gray-300">Leverage your 3:1 value with participating lenders</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Program Phases */}
      <div className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Program Roadmap</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our strategic rollout plan designed to maximize rewards and platform growth.
            </p>
          </div>

          <div className="space-y-8">
            {programPhases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`rounded-2xl p-8 border-2 ${phase.color}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{phase.phase}</h3>
                    <div className="text-gray-300 mb-4">{phase.timeline}</div>
                    <div className="text-2xl font-bold text-amber-400">{phase.apy}</div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.features.map((feature, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Technical Foundation</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Built on cutting-edge smart contract technology with enterprise-grade security and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">LayerZero Integration</h3>
              <p className="text-gray-300 text-sm mb-4">
                Seamless access across 100+ blockchains without traditional bridging complexity.
              </p>
              <div className="text-blue-400 font-semibold">Cross-Chain Ready</div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Smart Contract Security</h3>
              <p className="text-gray-300 text-sm mb-4">
                Audited contracts with automated peg stability and reward distribution mechanisms.
              </p>
              <div className="text-purple-400 font-semibold">Bank-Grade Security</div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Lender Integration</h3>
              <p className="text-gray-300 text-sm mb-4">
                Built-in third-party lender connectivity for leveraged borrowing opportunities.
              </p>
              <div className="text-emerald-400 font-semibold">Institutional Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-red-500/20 to-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Start Earning Maximum Rewards Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the most lucrative DeFi launch program. Early adopters earn the highest rewards!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinProgram}
                className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-400 hover:to-orange-500 transition-all duration-200 flex items-center justify-center"
              >
                <Rocket className="h-5 w-5 mr-2" />
                {isConnected ? 'Join Bonus Program' : 'Connect Wallet to Join'}
              </motion.button>
              

            </div>

            <div className="mt-8 text-center">
              <div className="text-gray-400 text-sm mb-2">Current rewards pool available:</div>
              <div className="text-2xl font-bold text-amber-400">$2,000,000 USDGB</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Join Bonus Program"
        subtitle="Connect your wallet to join the DEX Launch Bonus Program"
        operation="bonus_program"
      />
    </div>
  )
}

export default BonusProgramPage
