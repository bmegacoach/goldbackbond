import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Shield,
  Globe,
  Clock,
  DollarSign,
  Zap,
  Users,
  BarChart3,
  Coins,
  Lock,
  RefreshCw,
  Star,
  Gift,
  Rocket,
  ArrowRight
} from 'lucide-react'
import LiveStats from '../sections/LiveStats'
import BenefitsGrid from '../sections/BenefitsGrid'
import PremiumFeatures from '../sections/PremiumFeatures'
import AggressiveRewardsOffer from '../sections/AggressiveRewardsOffer'
import CCAAuctionModal from '../CCAAuctionModal'
import WalletConnectModal from '../WalletConnectModal'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseChain } from '../../lib/web3Config'
import TransactionService, { TransactionState } from '../../services/transactionService'
import { useToast } from '../ToastProvider'
import FloatingGoldParticles from '../FloatingGoldParticles'
import GoldPriceTicker from '../GoldPriceTicker'

interface WebsiteData {
  specifications: {
    usd_market_cap: string
    gold_certificates: number
    gold_kilograms: number
  }
  features: Array<{
    name: string
    description: string
  }>
}

const HomePage = () => {
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [isCcaModalOpen, setIsCcaModalOpen] = useState(false)
  const [showBonusProgramModal, setShowBonusProgramModal] = useState(false)
  const [transactionState, setTransactionState] = useState<TransactionState>({ status: 'idle' })

  // Wallet connection hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { showSuccess, showError, showInfo } = useToast()
  const transactionService = TransactionService.getInstance()

  useEffect(() => {
    // Load website data
    fetch('/data/goldbackbond_analysis.json')
      .then(response => response.json())
      .then(data => setWebsiteData(data))
      .catch(error => console.error('Error loading website data:', error))
  }, [])

  const handleJoinBonusProgram = async () => {
    if (!isConnected) {
      setShowBonusProgramModal(true)
      return
    }

    if (!address) {
      showError('Wallet Error', 'Please connect your wallet first')
      return
    }

    // Check and switch to Base chain if needed
    if (chainId !== baseChain.id) {
      try {
        await switchChain({ chainId: baseChain.id })
        showInfo('Network Switch', 'Switching to Base network...')
        // Wait a moment for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        showError('Network Error', 'Failed to switch to Base network. Please switch manually.')
        return
      }
    }

    // Execute the join bonus program transaction
    const success = await transactionService.joinBonusProgram(
      address,
      (state: TransactionState) => {
        setTransactionState(state)

        switch (state.status) {
          case 'waiting_approval':
            showInfo('Transaction Pending', 'Please approve the transaction in your wallet...')
            break
          case 'pending':
            showInfo('Transaction Submitted', 'Your transaction has been submitted to the blockchain', {
              label: 'View on Explorer',
              onClick: () => window.open(transactionService.getTransactionUrl(state.hash!), '_blank')
            })
            break
          case 'success':
            showSuccess(
              'Successfully Joined Bonus Program!',
              'Welcome to the DEX Launch Bonus Program. Start earning maximum rewards!',
              {
                label: 'View Transaction',
                onClick: () => window.open(transactionService.getTransactionUrl(state.hash!), '_blank')
              }
            )
            break
          case 'error':
            showError('Transaction Failed', state.error || 'Failed to join bonus program')
            break
        }
      }
    )

    if (!success && transactionState.status === 'error') {
      // Additional error handling if needed
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <GoldPriceTicker />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/hero-gold-bars.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
        </div>

        <FloatingGoldParticles />

        {/* Hero Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 relative">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent bg-300% animate-gradient-x">
                World's Largest
              </span>
              <br />
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Reserve Stablecoin</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 backdrop-blur-sm bg-black/10 rounded-xl py-2">
              USDGB is a tokenized asset backed by physical gold certificates,
              combining the stability of gold with the accessibility of crypto assets
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0.4)", "0 0 0 10px rgba(16, 185, 129, 0)"] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={() => setIsCcaModalOpen(true)}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-500/25 flex items-center justify-center min-h-[48px] touch-manipulation"
            >
              <Zap className="w-5 h-5 mr-2" />
              <span className="whitespace-nowrap">Uniswap CCA Launch</span>
            </motion.button>
            <Link to="/staking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-6 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 shadow-lg shadow-amber-500/25 flex items-center justify-center min-h-[48px] w-full sm:w-auto touch-manipulation"
              >
                <span className="whitespace-nowrap">Start Staking</span>
              </motion.button>
            </Link>
            <Link to="/lending">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-amber-500 text-amber-400 px-6 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-amber-500/10 transition-all duration-200 flex items-center justify-center min-h-[48px] w-full sm:w-auto touch-manipulation"
              >
                <span className="whitespace-nowrap">Explore Lending</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Key Stats Preview */}
          <motion.div variants={itemVariants}>
            <LiveStats data={websiteData?.specifications} />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Uniswap CCA Launch Banner */}
      <section className="py-16 bg-gradient-to-r from-violet-900/20 via-purple-900/20 to-indigo-900/20 border-y border-violet-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center bg-gradient-to-r from-violet-500 to-purple-600 rounded-full px-6 py-2 text-white font-bold text-sm animate-pulse">
                <Zap className="h-4 w-4 mr-2" />
                🦄 LIVE NOW: UNISWAP CCA LAUNCH — MARCH 16 TO JUNE 14, 2026
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Goldbackbond × <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Uniswap CCA</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              USDGB is launching via a <strong className="text-white">Uniswap Concentrated Capital Auction</strong> — 
              the most transparent, fair, and permissionless way to bootstrap deep on-chain liquidity.
              Buy pre-sale at <strong className="text-amber-400">$0.80</strong> (20% below $1.00 NAV), 
              earn <strong className="text-emerald-400">9% APR</strong> staking rewards, and access up to 
              <strong className="text-violet-400"> 70% LTV institutional lending</strong> with no price-based liquidation.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 px-4">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-violet-500/30 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-violet-400 mb-1">$0.80</div>
                <div className="text-white font-semibold text-xs sm:text-sm">Pre-Sale Price</div>
                <div className="text-gray-400 text-xs">20% below $1.00 NAV</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 mb-1">9% APR</div>
                <div className="text-white font-semibold text-xs sm:text-sm">sUSDGB Rewards</div>
                <div className="text-gray-400 text-xs">Current program target</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/30 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">$25M–$35M</div>
                <div className="text-white font-semibold text-xs sm:text-sm">Liquidity Target</div>
                <div className="text-gray-400 text-xs">Initial Uniswap pool depth</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/30 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">70% LTV</div>
                <div className="text-white font-semibold text-xs sm:text-sm">Borrow Power</div>
                <div className="text-gray-400 text-xs">Genesis Bank & Trust</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCcaModalOpen(true)}
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-500/25 flex items-center justify-center min-h-[48px] touch-manipulation"
              >
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {isConnected ? 'Join CCA Auction Now' : 'Connect Wallet to Participate'}
              </motion.button>

              <Link to="/uniswap-cca">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-700 border border-violet-500/40 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg hover:bg-slate-600 transition-all duration-200 flex items-center justify-center min-h-[48px] w-full sm:w-auto touch-manipulation"
                >
                  Learn More About CCA
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </motion.button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <div className="text-gray-400 text-sm mb-1">$2M USDGB Rewards Pool • No price-based liquidation • Genesis Bank & Trust lending • InterFi Security audited</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Premium DeFi Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Experience the next generation of gold-backed DeFi with advanced staking,
              lending, and multi-chain capabilities
            </p>
          </motion.div>

          <PremiumFeatures />
        </div>
      </section>

      {/* Aggressive Rewards Offer */}
      <AggressiveRewardsOffer onBuyClick={() => setIsCcaModalOpen(true)} />

      {/* Core Benefits Section */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Why Choose USDGB?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Discover the 12 core benefits that make USDGB the premier choice
              for gold-backed digital assets
            </p>
          </motion.div>

          <BenefitsGrid features={websiteData?.features} />
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Built on Trust & Security
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                Our gold certificates are stored in secure vaults with full transparency
                and regular audits to ensure your investments are protected.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Bank-Grade Security</h3>
                  <p className="text-gray-400 text-sm">Multi-layer protection</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Regular Audits</h3>
                  <p className="text-gray-400 text-sm">Transparent reporting</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/professional-gold-vault.png"
                alt="Professional Gold Vault Security"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 ">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 px-4">
              Join thousands of investors who trust USDGB for their digital gold investments
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/app">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 shadow-lg shadow-amber-500/25 w-full sm:w-auto touch-manipulation"
                >
                  Launch App
                </motion.button>
              </Link>
              <Link to="/whitepaper">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-amber-500 text-amber-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg hover:bg-amber-500/10 transition-all duration-200 w-full sm:w-auto touch-manipulation"
                >
                  Read Whitepaper
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CCA Auction Modal */}
      <CCAAuctionModal
        isOpen={isCcaModalOpen}
        onClose={() => setIsCcaModalOpen(false)}
      />

      {/* Bonus Program Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showBonusProgramModal}
        onClose={() => setShowBonusProgramModal(false)}
        title="Join Bonus Program"
        subtitle="Connect your wallet to join the DEX Launch Bonus Program"
        operation="bonus_program"
      />
    </div>
  )
}

export default HomePage
