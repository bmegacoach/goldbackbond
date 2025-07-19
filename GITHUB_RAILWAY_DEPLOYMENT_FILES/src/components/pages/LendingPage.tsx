import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Calculator, 
  Shield, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Building,
  Percent,
  Target,
  Wallet,
  Check,
  Square,
  Flame,
  Gift,
  Star,
  Zap
} from 'lucide-react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseChain } from '../../lib/web3Config'
import WalletConnectModal from '../WalletConnectModal'

const LendingPage = () => {
  const [usdgbAmount, setUsdgbAmount] = useState(10000)
  const [selectedLender, setSelectedLender] = useState('')
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showCollateralModal, setShowCollateralModal] = useState(false)
  const [showRepayModal, setShowRepayModal] = useState(false)
  const [agreedToDisclosure, setAgreedToDisclosure] = useState(false)
  
  // Wallet connection hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [loanTerm, setLoanTerm] = useState(12)
  
  const lendingStats = {
    totalBorrowed: 89500000,
    activeLenders: 12,
    avgLTV: 65.8,
    avgRate: 9.9
  }

  // Mock lenders data
  const lenders = [
    {
      id: 'aave',
      name: 'Aave Protocol',
      rate: 7.5,
      maxLTV: 70,
      reputation: 98,
      totalLent: 25000000,
      logo: '🟢'
    },
    {
      id: 'compound',
      name: 'Compound Finance',
      rate: 8.2,
      maxLTV: 68,
      reputation: 96,
      totalLent: 18500000,
      logo: '🔷'
    },
    {
      id: 'maker',
      name: 'MakerDAO',
      rate: 8.8,
      maxLTV: 72,
      reputation: 99,
      totalLent: 32000000,
      logo: '🟡'
    },
    {
      id: 'venus',
      name: 'Venus Protocol',
      rate: 9.1,
      maxLTV: 65,
      reputation: 94,
      totalLent: 12000000,
      logo: '🔴'
    }
  ]

  const handleApplyLoan = async () => {
    if (!agreedToDisclosure) {
      alert('Please read and agree to the Important Disclosure before proceeding.')
      return
    }

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

    // Here you would implement the actual loan application logic
    console.log('Applying for loan:', usdgbAmount, 'USDGB collateral')
    alert(`Applying for loan with ${usdgbAmount} USDGB collateral - This would connect to your smart contract!`)
  }

  const handleAddCollateral = async () => {
    if (!isConnected) {
      setShowCollateralModal(true)
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

    // Here you would implement the actual add collateral logic
    console.log('Adding collateral to loan')
    alert('Adding collateral - This would connect to your smart contract!')
  }

  const handleRepayLoan = async () => {
    if (!isConnected) {
      setShowRepayModal(true)
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

    // Here you would implement the actual repay logic
    console.log('Repaying loan')
    alert('Repaying loan - This would connect to your smart contract!')
  }

  const calculateLoan = (usdgbAmount: number, ltv: number) => {
    // Gold Certificate value is 3:1 ratio to USDGB
    const goldCertificateValue = usdgbAmount * 3
    const maxLoanAmount = (goldCertificateValue * ltv) / 100
    return {
      usdgbAmount,
      goldCertificateValue,
      maxLoanAmount,
      liquidationPrice: goldCertificateValue * 0.8, // Liquidation at 80% of gold certificate value
      safetyBuffer: goldCertificateValue - maxLoanAmount
    }
  }

  const selectedLenderData = lenders.find(l => l.id === selectedLender) || lenders[0]
  const loanCalculation = calculateLoan(usdgbAmount, selectedLenderData.maxLTV)

  // Mock user loans
  const [userLoans] = useState([
    {
      id: 1,
      lender: 'Aave Protocol',
      collateral: 15000,
      borrowed: 10500,
      rate: 7.5,
      ltv: 70,
      nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 2,
      lender: 'Compound Finance',
      collateral: 8000,
      borrowed: 5440,
      rate: 8.2,
      ltv: 68,
      nextPayment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ])

  const getLTVColor = (ltv: number) => {
    if (ltv <= 50) return 'text-green-400'
    if (ltv <= 65) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'danger': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen pt-8">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/lending-platform.jpg)',
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
              <span className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
                Premium Lending
              </span>
              <br />
              <span className="text-white">70% LTV Platform</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access liquidity by borrowing against your USDGB holdings with our vetted lender marketplace
            </p>
          </motion.div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Total Borrowed', value: `$${lendingStats.totalBorrowed.toLocaleString()}`, icon: DollarSign },
              { label: 'Active Lenders', value: lendingStats.activeLenders.toString(), icon: Users },
              { label: 'Avg LTV', value: `${lendingStats.avgLTV}%`, icon: Target },
              { label: 'Avg Rate', value: `${lendingStats.avgRate}%`, icon: Percent }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 text-center"
                >
                  <Icon className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DEX Launch Bonus Program - Lending Benefits */}
      <section className="py-16 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 border-y border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full px-6 py-2 text-white font-bold text-sm animate-pulse">
                <Star className="h-4 w-4 mr-2" />
                🚀 ENHANCED BY DEX LAUNCH PROGRAM
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                Maximum Leverage
              </span>
              {" "}with Bonus Program
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Participants in our DEX launch bonus program unlock <strong className="text-emerald-400">enhanced lending opportunities</strong>. 
              12-month stakers get <strong className="text-amber-400">3:1 gold certificate value</strong> leverage with up to <strong className="text-teal-400">70% LTV</strong> from our institutional lender network.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-400 mb-2">3:1</div>
                <div className="text-white font-semibold text-sm mb-1">Gold Certificate Value</div>
                <div className="text-gray-400 text-xs">12-month staking benefit</div>
              </div>
              
              <div className="bg-slate-800/60 backdrop-blur-sm border border-teal-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                    <Percent className="h-6 w-6 text-teal-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-teal-400 mb-2">70%</div>
                <div className="text-white font-semibold text-sm mb-1">Maximum LTV</div>
                <div className="text-gray-400 text-xs">Institutional grade lending</div>
              </div>
              
              <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-2">24+</div>
                <div className="text-white font-semibold text-sm mb-1">Institutional Lenders</div>
                <div className="text-gray-400 text-xs">Competitive rates available</div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">💡 How It Works</h3>
              <div className="text-left max-w-2xl mx-auto space-y-2 text-gray-300">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Step 1:</strong> Stake USDGB for 12 months in our bonus program</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Step 2:</strong> Your staked tokens gain 3:1 gold certificate value</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Step 3:</strong> Access lending at up to 70% LTV on the enhanced value</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Bonus:</strong> Continue earning APY rewards while using your collateral!</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bonus-program">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Join Bonus Program
                </motion.button>
              </Link>
              
              <Link to="/staking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-600 transition-all duration-200 flex items-center justify-center"
                >
                  Start 12-Month Staking
                  <ArrowRight className="h-5 w-5 ml-2" />
                </motion.button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <div className="text-gray-400 text-sm mb-1">Example: $10,000 staked → $30,000 lending value → $21,000 max loan</div>
              <div className="text-emerald-400 font-semibold">Perfect for Content Creators & Influencers</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lending Interface */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Loan Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Calculator className="h-8 w-8 text-emerald-400 mr-3" />
                Loan Calculator
              </h2>

              {/* USDGB Amount Input */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  USDGB Amount for Collateral
                </label>
                <input
                  type="number"
                  value={usdgbAmount}
                  onChange={(e) => setUsdgbAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-xl font-bold focus:border-emerald-400 focus:outline-none"
                  min="1000"
                  step="1000"
                />
              </div>

              {/* Loan Term Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Loan Term (Months)
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white font-bold focus:border-emerald-400 focus:outline-none"
                >
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                  <option value={48}>48 Months</option>
                  <option value={60}>60 Months</option>
                  <option value={72}>72 Months</option>
                  <option value={84}>84 Months</option>
                  <option value={96}>96 Months</option>
                  <option value={108}>108 Months</option>
                  <option value={120}>120 Months</option>
                </select>
              </div>

              {/* Value Calculation Display */}
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <h4 className="text-amber-400 font-semibold mb-3">Value Calculation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">USDGB Amount:</span>
                    <span className="text-white font-bold">${loanCalculation.usdgbAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Gold Certificate Value (3:1):</span>
                    <span className="text-amber-400 font-bold">${loanCalculation.goldCertificateValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Lender Selection */}
              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Select Lender
                </label>
                <div className="space-y-3">
                  {lenders.map((lender) => (
                    <div
                      key={lender.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedLender === lender.id || (selectedLender === '' && lender.id === 'aave')
                          ? 'border-emerald-400 bg-emerald-400/10'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedLender(lender.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{lender.logo}</span>
                          <div>
                            <h3 className="text-white font-semibold">{lender.name}</h3>
                            <p className="text-gray-400 text-sm">Max LTV: {lender.maxLTV}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{lender.rate}%</p>
                          <p className="text-gray-400 text-sm">Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loan Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Max Loan Amount (70% of Gold Certificate Value)</span>
                  <span className="text-emerald-400 font-bold text-lg">
                    ${loanCalculation.maxLoanAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Interest Rate</span>
                  <span className="text-white font-bold">{selectedLenderData.rate}%</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Loan Term</span>
                  <span className="text-white font-bold">{loanTerm} Months</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Liquidation Threshold</span>
                  <span className="text-red-400 font-bold">
                    ${loanCalculation.liquidationPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Important Disclosure */}
              <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-red-400 font-semibold mb-3">Important Disclosure</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      <strong>Goldbackbond is NOT a lender or bank.</strong> Loans are subject to 3rd party lenders' terms and conditions. 
                      Loan approval, rates, and terms are determined solely by the selected lender. 
                      Please review all loan agreements carefully before proceeding.
                    </p>
                    
                    {/* Checkbox Agreement */}
                    <div className="flex items-start space-x-3 mt-4">
                      <button
                        onClick={() => setAgreedToDisclosure(!agreedToDisclosure)}
                        className="flex-shrink-0 w-5 h-5 border-2 border-red-400 rounded flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      >
                        {agreedToDisclosure && <Check className="h-3 w-3 text-red-400" />}
                      </button>
                      <label 
                        onClick={() => setAgreedToDisclosure(!agreedToDisclosure)}
                        className="text-gray-300 text-sm cursor-pointer select-none"
                      >
                        I read the disclosure. I AGREE.
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <motion.button
                whileHover={{ scale: agreedToDisclosure || !isConnected ? 1.02 : 1 }}
                whileTap={{ scale: agreedToDisclosure || !isConnected ? 0.98 : 1 }}
                onClick={handleApplyLoan}
                disabled={isConnected && !agreedToDisclosure}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isConnected && !agreedToDisclosure 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500'
                }`}
              >
                {!isConnected ? (
                  <>
                    <Wallet className="h-5 w-5" />
                    <span>Connect Wallet to Apply</span>
                  </>
                ) : !agreedToDisclosure ? (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    <span>Please Agree to Disclosure</span>
                  </>
                ) : (
                  <>
                    <Building className="h-5 w-5" />
                    <span>Apply for Loan</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>

              {/* Standardized Wallet Connect Modal */}
              <WalletConnectModal
                isOpen={showWalletModal}
                onClose={() => setShowWalletModal(false)}
                title="Connect to Apply for Loan"
                subtitle="Connect your wallet to access premium lending options"
                operation="lending"
              />

              {/* Add Collateral Modal */}
              <WalletConnectModal
                isOpen={showCollateralModal}
                onClose={() => setShowCollateralModal(false)}
                title="Connect to Add Collateral"
                subtitle="Connect your wallet to increase your loan collateral"
                operation="collateral"
              />

              {/* Repay Loan Modal */}
              <WalletConnectModal
                isOpen={showRepayModal}
                onClose={() => setShowRepayModal(false)}
                title="Connect to Repay Loan"
                subtitle="Connect your wallet to make loan payments"
                operation="repay"
              />
            </motion.div>

            {/* Active Loans */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <DollarSign className="h-8 w-8 text-emerald-400 mr-3" />
                Active Loans (demo)
              </h2>

              {userLoans.length > 0 ? (
                <div className="space-y-6">
                  {userLoans.map((loan) => {
                    const currentLTV = (loan.borrowed / loan.collateral) * 100
                    const healthFactor = (loan.collateral * 0.8) / loan.borrowed
                    
                    return (
                      <div key={loan.id} className="bg-slate-700/50 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              ${loan.borrowed.toLocaleString()} Borrowed
                            </h3>
                            <p className="text-emerald-400 font-medium">{loan.lender}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${getLTVColor(currentLTV)}`}>
                              {currentLTV.toFixed(1)}% LTV
                            </p>
                            <p className="text-gray-400 text-sm">{loan.rate}% APR</p>
                          </div>
                        </div>

                        {/* Health Factor */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Health Factor</span>
                            <span className={healthFactor >= 1.5 ? 'text-green-400' : 'text-yellow-400'}>
                              {healthFactor.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                healthFactor >= 1.5 ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gradient-to-r from-yellow-400 to-orange-600'
                              }`}
                              style={{ width: `${Math.min((healthFactor / 2) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Loan Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm">Collateral</p>
                            <p className="text-white font-semibold">${loan.collateral.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Next Payment</p>
                            <p className="text-white font-semibold">
                              {loan.nextPayment.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <button 
                            onClick={handleAddCollateral}
                            className="flex-1 bg-emerald-500/20 text-emerald-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                          >
                            Add Collateral
                          </button>
                          <button 
                            onClick={handleRepayLoan}
                            className="flex-1 bg-blue-500/20 text-blue-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                          >
                            Repay
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Active Loans</h3>
                  <p className="text-gray-500">Apply for a loan to see your positions here</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lender Marketplace */}
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
              Vetted Lender Marketplace
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our carefully selected lending partners for the best rates and terms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lenders.map((lender, index) => (
              <motion.div
                key={lender.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 text-center hover:bg-slate-800/80 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{lender.logo}</div>
                <h3 className="text-lg font-bold text-white mb-2">{lender.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Rate</span>
                    <span className="text-emerald-400 font-bold">{lender.rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Max LTV</span>
                    <span className="text-white font-bold">{lender.maxLTV}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Reputation</span>
                    <span className="text-green-400 font-bold">{lender.reputation}%</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">
                  ${lender.totalLent.toLocaleString()} total lent
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Collateral',
                description: 'Your USDGB collateral is held in secure smart contracts with transparent liquidation rules'
              },
              {
                icon: TrendingUp,
                title: 'Competitive Rates',
                description: 'Access the best lending rates in the market through our vetted lender marketplace'
              },
              {
                icon: CheckCircle,
                title: 'Flexible Terms',
                description: 'Choose from various loan terms and repayment schedules that fit your needs'
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
                  className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-8 text-center"
                >
                  <Icon className="h-12 w-12 text-emerald-400 mx-auto mb-6" />
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

export default LendingPage
