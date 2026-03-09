import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Lock,
  Clock,
  TrendingUp,
  Calculator,
  Coins,
  Plus,
  Minus,
  Calendar,
  Target,
  ArrowRight,
  Award,
  Wallet,
  Flame,
  Gift,
  Zap,
  Star
} from 'lucide-react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { activeChain } from '../../lib/web3Config'
import WalletConnectModal from '../WalletConnectModal'
import TransactionService, { TransactionState } from '../../services/transactionService'
import { useSmartContractData, useWalletBalance } from '../../hooks/useSmartContractData'

const StakingPage = () => {
  const [stakeAmount, setStakeAmount] = useState(1000)
  const [stakingTermMonths, setStakingTermMonths] = useState(12)
  const [showWalletModal, setShowWalletModal] = useState(false)

  // Wallet connection hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Smart contract data hooks
  const { metrics, formatCurrency } = useSmartContractData()
  const walletBalance = useWalletBalance()
  const transactionService = TransactionService.getInstance()
  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' })

  // Live APR from contract — falls back to 50% (launch APR)
  const liveAPR = metrics?.currentAPR ?? 50
  const goldPriceChange = metrics?.goldPriceChange ?? 0

  const [stakingData, setStakingData] = useState({
    currentAPR: 50,
    goldPriceChange: 0,
    rewardPool: 2000000,
    nextRewardDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
  })

  // Sync live contract data into stakingData
  useEffect(() => {
    if (metrics) {
      setStakingData(prev => ({
        ...prev,
        currentAPR: metrics.currentAPR || 50,
        goldPriceChange: metrics.goldPriceChange || 0,
      }))
    }
  }, [metrics])

  // Gold Bonus calculation: 3% APR per 5% gold price increase, max 15%, ends after 6 months
  const calculateGoldBonus = () => {
    const increments = Math.floor(stakingData.goldPriceChange / 5) // Number of 5% increments
    const bonus = Math.min(increments * 3, 15) // 3% per increment, max 15%
    return bonus
  }

  const goldBonus = calculateGoldBonus()

  // PRE-LAUNCH: User positions will be fetched from staking contract once deployed
  // Live user position from wallet balance hook
  const hasLpStake = parseFloat(walletBalance.lpStakeAmount) > 0
  const hasCertStake = parseFloat(walletBalance.certificateStakeAmount) > 0

  const handleStake = async () => {
    if (!isConnected) {
      setShowWalletModal(true)
      return
    }

    if (chainId !== activeChain.id) {
      try {
        switchChain({ chainId: activeChain.id })
      } catch (error) {
        console.error('Failed to switch to Base network:', error)
        return
      }
    }

    // Execute staking via CertificateStaking contract (365-day lockup)
    await transactionService.stakeUSDGB(
      stakeAmount.toString(),
      address!,
      (state: TransactionState) => {
        setTxState(state)
      }
    )
  }

  const calculateRewards = (amount: number) => {
    const baseAPR = stakingData.currentAPR / 100  // 50% for Month 1
    const goldBonusAPR = goldBonus / 100  // Dynamic gold bonus
    const totalAPR = baseAPR + goldBonusAPR
    const goldMultiplier = 3 // 3:1 gold certificate value

    // Time-decay structure calculations for first year
    const month1Rewards = amount * 0.50 * (1 / 12)  // 50% APR for Month 1
    const month2Rewards = amount * 0.30 * (1 / 12)  // 30% APR for Month 2  
    const month3Rewards = amount * 0.20 * (1 / 12)  // 20% APR for Month 3
    const remaining9MonthsRewards = amount * 0.09 * (9 / 12)  // 9% APR for Months 4-12

    const goldBonusYearly = amount * goldBonusAPR  // Gold bonus applies all year
    const totalYearlyRewards = month1Rewards + month2Rewards + month3Rewards + remaining9MonthsRewards + goldBonusYearly

    return {
      yearlyRewards: Math.round(totalYearlyRewards),
      goldValue: amount * goldMultiplier,
      monthlyRewards: totalYearlyRewards / 12,
      currentMonthAPR: stakingData.currentAPR + goldBonus,
      goldBonus: amount * goldBonusAPR,
      breakdownRewards: {
        month1: month1Rewards,
        month2: month2Rewards,
        month3: month3Rewards,
        remaining: remaining9MonthsRewards,
        goldBonus: goldBonusYearly
      }
    }
  }

  const rewards = calculateRewards(stakeAmount)

  const getRemainingTime = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return { days, hours }
  }

  return (
    <div className="min-h-screen pt-8">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/staking-interface.png)',
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
              <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                Premium Staking
              </span>
              <br />
              <span className="text-white">12-Month Lock Program</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stake your USDGB tokens for enhanced rewards with our exclusive 3:1 gold certificate value system
            </p>
          </motion.div>

          {/* DEX Launch Bonus Program Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/30 rounded-3xl p-8 mb-16"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center bg-gradient-to-r from-red-500 to-orange-600 rounded-full px-6 py-2 text-white font-bold text-sm animate-pulse">
                  <Flame className="h-4 w-4 mr-2" />
                  🚀 DEX LAUNCH BONUS PROGRAM ACTIVE
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Time-Decay APR Structure + Gold Bonus
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/60 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
                  <div className="text-xl font-bold text-red-400 mb-1">50%</div>
                  <div className="text-white font-semibold text-sm">Month 1</div>
                  <div className="text-gray-400 text-xs">Current APR</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm border border-orange-500/30 rounded-xl p-4">
                  <div className="text-xl font-bold text-orange-400 mb-1">30%</div>
                  <div className="text-white font-semibold text-sm">Month 2</div>
                  <div className="text-gray-400 text-xs">Next tier</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
                  <div className="text-xl font-bold text-yellow-400 mb-1">20%</div>
                  <div className="text-white font-semibold text-sm">Month 3</div>
                  <div className="text-gray-400 text-xs">Third tier</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4">
                  <div className="text-xl font-bold text-amber-400 mb-1">+{goldBonus}%</div>
                  <div className="text-white font-semibold text-sm">Gold Bonus</div>
                  <div className="text-gray-400 text-xs">Dynamic reward</div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">
                <strong className="text-amber-400">Total Current APR: {stakingData.currentAPR + goldBonus}%</strong>
                {" "}(Base 50% + {goldBonus}% Gold Bonus)
              </p>

              <p className="text-sm text-gray-400">
                Early adopters earn maximum rewards! Limited $2M USDGB reward pool available.
              </p>
            </div>
          </motion.div>

          {/* Gold Bonus Explanation */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl p-8 border border-amber-500/30"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">🏆 Dynamic Gold Price Bonus</h3>
                <p className="text-gray-300">Automatically earn additional rewards as gold prices rise (Limited to first 6 months)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">+3%</div>
                  <div className="text-white font-semibold mb-1">APR Per 5% Gold Rise</div>
                  <div className="text-gray-300 text-sm">Automatic bonus activation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">15%</div>
                  <div className="text-white font-semibold mb-1">Maximum Bonus</div>
                  <div className="text-gray-300 text-sm">Capped at 25% gold increase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">{goldBonus}%</div>
                  <div className="text-white font-semibold mb-1">Current Bonus</div>
                  <div className="text-gray-300 text-sm">Gold up {stakingData.goldPriceChange.toFixed(1)}%</div>
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-4 border border-amber-500/20">
                <div className="text-sm text-gray-300 text-center">
                  <strong className="text-amber-400">How it works:</strong> For every 5% increase in gold price, you earn an additional 3% APR for the first 6 months.
                  With gold currently up {stakingData.goldPriceChange.toFixed(1)}%, you're earning an extra {goldBonus}% APR on top of your base rate during this promotional period!
                </div>
              </div>
            </motion.div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { label: 'Current Base APR', value: `${stakingData.currentAPR}%`, icon: TrendingUp },
              { label: 'Gold Bonus APR', value: `+${goldBonus}%`, icon: Star },
              { label: 'Reward Pool', value: `$${stakingData.rewardPool.toLocaleString()}`, icon: Gift }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 text-center"
                >
                  <Icon className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Staking Calculator & Interface */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Staking Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Calculator className="h-8 w-8 text-amber-400 mr-3" />
                Staking Calculator
              </h2>

              {/* Amount Input */}
              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Stake Amount (USDGB)
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setStakeAmount(Math.max(100, stakeAmount - 100))}
                    className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-amber-400 hover:bg-slate-600 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Number(e.target.value) || 0)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-center text-xl font-bold focus:border-amber-400 focus:outline-none"
                      min="100"
                      step="100"
                    />
                  </div>
                  <button
                    onClick={() => setStakeAmount(stakeAmount + 100)}
                    className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-amber-400 hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[500, 1000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setStakeAmount(amount)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${stakeAmount === amount
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Staking Term Selector */}
              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Staking Term (Months) - Terms subject to lender requirements
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setStakingTermMonths(Math.max(12, stakingTermMonths - 12))}
                    className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-amber-400 hover:bg-slate-600 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={stakingTermMonths}
                      onChange={(e) => setStakingTermMonths(Math.min(120, Math.max(12, Number(e.target.value) || 12)))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-center text-xl font-bold focus:border-amber-400 focus:outline-none"
                      min="12"
                      max="120"
                      step="12"
                    />
                  </div>
                  <button
                    onClick={() => setStakingTermMonths(Math.min(120, stakingTermMonths + 12))}
                    className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-amber-400 hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[12, 24, 60, 120].map((months) => (
                    <button
                      key={months}
                      onClick={() => setStakingTermMonths(months)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${stakingTermMonths === months
                        ? 'bg-amber-500 text-slate-900'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                      {months} months
                    </button>
                  ))}
                </div>
              </div>

              {/* Rewards Breakdown */}
              <div className="space-y-4 mb-8">
                {/* Current APR Display */}
                <div className="bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-amber-500/30 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Current Total APR</span>
                    <span className="text-2xl font-bold text-amber-400">{rewards.currentMonthAPR}%</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Base {stakingData.currentAPR}% + Gold Bonus {goldBonus}%
                  </div>
                </div>

                {/* Rewards Breakdown */}
                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Total First Year Rewards</span>
                  <span className="text-green-400 font-bold">${rewards.yearlyRewards.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Month 1 Rewards (50% APR)</span>
                  <span className="text-red-400 font-bold">${Math.round(rewards.breakdownRewards.month1).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Gold Bonus (Annual)</span>
                  <span className="text-amber-400 font-bold">+${Math.round(rewards.goldBonus).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Gold Certificate Value (3:1)</span>
                  <span className="text-amber-400 font-bold">${rewards.goldValue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Average Monthly</span>
                  <span className="text-green-400 font-bold">${Math.round(rewards.monthlyRewards).toLocaleString()}</span>
                </div>

                {/* Detailed Breakdown Collapsible */}
                <details className="bg-slate-700/30 rounded-lg p-4">
                  <summary className="text-amber-400 cursor-pointer hover:text-amber-300 font-medium">
                    📊 View Complete APR Breakdown
                  </summary>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Month 1 (50% APR):</span>
                      <span className="text-red-300">${Math.round(rewards.breakdownRewards.month1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Month 2 (30% APR):</span>
                      <span className="text-orange-300">${Math.round(rewards.breakdownRewards.month2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Month 3 (20% APR):</span>
                      <span className="text-yellow-300">${Math.round(rewards.breakdownRewards.month3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Months 4-12 (10% APR):</span>
                      <span className="text-amber-300">${Math.round(rewards.breakdownRewards.remaining).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-2">
                      <span className="text-gray-400">Gold Price Bonus:</span>
                      <span className="text-amber-300">+${Math.round(rewards.breakdownRewards.goldBonus).toLocaleString()}</span>
                    </div>
                  </div>
                </details>
              </div>

              {/* Stake Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStake}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {!isConnected ? (
                  <>
                    <Wallet className="h-5 w-5" />
                    <span>Connect Wallet to Stake</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Stake USDGB</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>

              {/* Standardized Wallet Connect Modal */}
              <WalletConnectModal
                isOpen={showWalletModal}
                onClose={() => setShowWalletModal(false)}
                title="Connect to Stake"
                subtitle="Connect your wallet to start earning 50% APR"
                operation="staking"
              />
            </motion.div>

            {/* Current Positions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Coins className="h-8 w-8 text-amber-400 mr-3" />
                Your Positions
              </h2>

              {(hasLpStake || hasCertStake) ? (
                <div className="space-y-6">
                  {/* LP Reward Pool Position */}
                  {hasLpStake && (
                    <div className="bg-slate-700/50 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {parseFloat(walletBalance.lpStakeAmount).toLocaleString()} LP Staked
                          </h3>
                          <p className="text-amber-400 font-medium">{liveAPR}% APR</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">
                            {parseFloat(walletBalance.lpCalculatedReward).toLocaleString()} USDGB
                          </p>
                          <p className="text-gray-400 text-sm">Rewards Earned</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await transactionService.claimRewards(setTxState)
                        }}
                        className="w-full mt-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors font-medium"
                      >
                        Claim Rewards
                      </button>
                    </div>
                  )}

                  {/* Certificate Staking Position */}
                  {hasCertStake && (
                    <div className="bg-slate-700/50 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {parseFloat(walletBalance.certificateStakeAmount).toLocaleString()} USDGB Certificate
                          </h3>
                          <p className="text-amber-400 font-medium">3x Leverage Eligible: {walletBalance.leverageEligible ? '✅ Yes' : '❌ No'}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${walletBalance.certificateIsLocked ? 'text-red-400' : 'text-green-400'}`}>
                            {walletBalance.certificateIsLocked ? '🔒 Locked' : '🔓 Unlocked'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {walletBalance.certificateUnlockTime > 0
                              ? `Unlocks ${new Date(walletBalance.certificateUnlockTime * 1000).toLocaleDateString()}`
                              : 'No lock period'}
                          </p>
                        </div>
                      </div>
                      {!walletBalance.certificateIsLocked && hasCertStake && (
                        <button
                          onClick={async () => {
                            await transactionService.withdrawCertificate(setTxState)
                          }}
                          className="w-full mt-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-colors font-medium"
                        >
                          Withdraw Certificate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lock className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Active Stakes</h3>
                  <p className="text-gray-500">Start staking to see your positions here</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Stake with USDGB?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exclusive benefits for committed long-term holders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Premium Rewards',
                description: 'Earn higher APR rates compared to traditional savings with our gold-backed rewards system'
              },
              {
                icon: Lock,
                title: 'Secure Locking',
                description: 'Smart contract-based locking ensures your stakes are secure and automatically managed'
              },
              {
                icon: TrendingUp,
                title: 'Gold Appreciation',
                description: 'Benefit from potential gold price appreciation while earning staking rewards'
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
                  className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-8 text-center"
                >
                  <Icon className="h-12 w-12 text-amber-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default StakingPage
