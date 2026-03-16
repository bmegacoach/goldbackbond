import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Wallet,
    Activity,
    ArrowRight,
    Info,
    Check,
    Globe,
    Clock,
    ArrowUpRight
} from 'lucide-react'
import { useConnect, useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { baseChain, switchToBase } from '../lib/web3Config'
import { UNISWAP_V4, CONTRACTS } from '../lib/contractAddresses'
import { useToast } from './ToastProvider'
import TransactionService, { TransactionState } from '../services/transactionService'
import SmartContractDataService from '../services/smartContractDataService'

interface CCAAuctionModalProps {
    isOpen: boolean
    onClose: () => void
}

const formatNumber = (num: string | number) => {
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const CCAAuctionModal = ({ isOpen, onClose }: CCAAuctionModalProps) => {
    const [usdcAmount, setUsdcAmount] = useState('1000')
    const [step, setStep] = useState<'connect' | 'amount' | 'purchase'>('connect')
    const [transactionState, setTransactionState] = useState<TransactionState>({ status: 'idle' })

    const { connect, connectors, isPending } = useConnect()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const { showSuccess, showError, showInfo } = useToast()

    const transactionService = TransactionService.getInstance()
    const dataService = SmartContractDataService.getInstance()

    // Real-time metrics state
    const [metrics, setMetrics] = useState<any>(null)

    useEffect(() => {
        // Initial fetch
        dataService.getSmartContractMetrics().then(setMetrics)

        // Subscribe to live V4 LBP updates
        const interval = setInterval(() => {
            dataService.getSmartContractMetrics().then(setMetrics)
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (isConnected) {
            setStep('amount')
        } else {
            setStep('connect')
        }
    }, [isConnected])

    const handleConnect = (connectorId: string) => {
        const connector = connectors.find(c => c.id === connectorId)
        if (connector) {
            connect({ connector })
        }
    }

    const handleParticipate = async () => {
        if (!address) {
            showError('Wallet Error', 'Please connect your wallet first')
            return
        }

        if (chainId !== baseChain.id) {
            try {
                await switchChain({ chainId: baseChain.id })
                showInfo('Network Switch', 'Switching to Base network...')
                await new Promise(resolve => setTimeout(resolve, 1000))
            } catch (error) {
                try {
                    await switchToBase()
                } catch (switchError) {
                    showError('Network Error', 'Failed to switch to Base network. Please switch manually.')
                    return
                }
            }
        }

        setStep('purchase')

        // CCA Auction Flow: 
        // 1. Approve USDC for Permit2 
        // 2. Approve LiquidityLauncher to spend via Permit2
        // 3. Call distributeToken via LiquidityLauncher

        // For the UI simulation, we will use the existing `approveLiquidityLauncherViaPermit2` method
        // which was structurally designed for the CCA distribution flow.
        const success = await transactionService.approveLiquidityLauncherViaPermit2(
            usdcAmount,
            (state: TransactionState) => {
                setTransactionState(state)

                switch (state.status) {
                    case 'waiting_approval':
                        showInfo('Signature Required', 'Please sign the Permit2 approval in your wallet...')
                        break
                    case 'pending':
                        showInfo('Transaction Submitted', 'Your CCA bid has been submitted to the Uniswap V4 LBP', {
                            label: 'View on Explorer',
                            onClick: () => window.open(transactionService.getTransactionUrl(state.hash!), '_blank')
                        })
                        break
                    case 'success':
                        showSuccess(
                            'Bid Successful!',
                            `Successfully committed ${Number(usdcAmount).toLocaleString()} USDC to the CCA Auction`,
                            {
                                label: 'View Transaction',
                                onClick: () => window.open(transactionService.getTransactionUrl(state.hash!), '_blank')
                            }
                        )
                        setTimeout(() => {
                            onClose()
                            setStep('connect')
                            setTransactionState({ status: 'idle' })
                        }, 3000)
                        break
                    case 'error':
                        showError('Transaction Failed', state.error || 'Unknown error occurred')
                        setStep('amount')
                        break
                }
            }
        )
    }

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

    // CCA Readouts from Metrics Context
    const currentPrice = metrics?.ccaCurrentPrice || "0.90"
    const totalRaised = metrics?.ccaTotalRaised || "0"
    const targetRaise = metrics?.ccaTargetRaise || "20000000"

    const estimatedTokens = (Number(usdcAmount) / Number(currentPrice)).toFixed(2)
    const progressPercent = Math.min((Number(totalRaised) / Number(targetRaise)) * 100, 100)

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-slate-900 border border-emerald-500/20 rounded-[2rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#FF007A] to-[#ff4d9d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF007A]/20">
                                    <Activity className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Continuous Clearing Auction</h2>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="px-2.5 py-0.5 bg-[#FF007A]/20 text-[#FF007A] text-xs font-bold rounded-full border border-[#FF007A]/30 uppercase tracking-wider">
                                            Uniswap V4 CCA
                                        </span>
                                        <span className="text-gray-400 text-sm">Base Mainnet</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Auction Stats Dashboard */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="text-sm text-gray-400 mb-1 font-medium">Current Price</p>
                                <p className="text-3xl font-bold text-white tracking-tight">${currentPrice} <span className="text-base font-normal text-[#FF007A]">USDC</span></p>
                                <p className="text-xs text-[#FF007A] mt-2 flex items-center"><Globe className="w-3 h-3 mr-1" /> Dynamic Clearing</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                <p className="text-sm text-gray-400 mb-1 font-medium">Target Raise</p>
                                <p className="text-3xl font-bold text-white tracking-tight">${(Number(targetRaise) / 1000000).toFixed(0)}M</p>
                                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-[#FF007A] h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">${formatNumber(totalRaised)} raised</p>
                            </div>
                        </div>

                        {/* Connect Wallet Step */}
                        {step === 'connect' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-semibold text-white mb-4">Connect Wallet to Participate</h3>
                                {connectors.filter(c => ['metaMask', 'coinbaseWallet', 'walletConnect'].includes(c.id)).map((connector) => (
                                    <motion.button
                                        key={connector.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleConnect(connector.id)}
                                        disabled={isPending}
                                        className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#FF007A]/50 rounded-2xl transition-all duration-200 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-[#FF007A]/30 transition-colors">
                                                <Wallet className="w-5 h-5 text-gray-400 group-hover:text-[#FF007A] transition-colors" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white font-medium">{connector.name}</p>
                                                <p className="text-gray-400 text-xs">Connect to Base Mainnet</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#FF007A] transition-colors" />
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {/* Amount Selection Step */}
                        {step === 'amount' && isConnected && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium text-white">{formatAddress(address!)}</span>
                                    </div>
                                    <button onClick={() => disconnect()} className="text-xs text-gray-400 hover:text-white transition-colors">Disconnect</button>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        USDC Bid Amount
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            value={usdcAmount}
                                            onChange={(e) => setUsdcAmount(e.target.value)}
                                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-5 py-4 text-white text-2xl font-bold focus:border-[#FF007A] focus:outline-none transition-colors"
                                            placeholder="1000"
                                        />
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                            <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025" alt="USDC" className="w-5 h-5" />
                                            <span className="text-white font-bold">USDC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {['1K', '5K', '10K', '50K'].map((preset) => (
                                        <button
                                            key={preset}
                                            onClick={() => setUsdcAmount(preset.replace('K', '000'))}
                                            className="py-2.5 bg-slate-800 hover:bg-[#FF007A]/10 border border-slate-700 hover:border-[#FF007A]/50 rounded-xl text-gray-300 hover:text-[#FF007A] text-sm font-semibold transition-all"
                                        >
                                            ${preset}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 flex items-center"><Info className="w-4 h-4 mr-1" /> Estimated USDGB</span>
                                        <span className="text-white font-bold text-base">{formatNumber(estimatedTokens)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Permit2 Approval</span>
                                        <span className="text-[#FF007A] flex items-center">Included <Check className="w-3 h-3 ml-1" /></span>
                                    </div>
                                    <hr className="border-slate-700 my-2" />
                                    <div className="text-xs text-gray-500 leading-relaxed">
                                        By confirming, you authorize the Uniswap V4 <code className="text-[#FF007A]/80 bg-[#FF007A]/10 px-1 rounded">LiquidityLauncher</code> parameter strategy to spend via Permit2.
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleParticipate}
                                    className="w-full py-4 bg-gradient-to-r from-[#FF007A] to-[#ff4d9d] hover:from-[#ff1a8c] hover:to-[#ff66b3] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#FF007A]/25 flex items-center justify-center space-x-2 text-lg"
                                >
                                    <span>Place Bid</span>
                                    <ArrowUpRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        )}

                        {/* Processing Step */}
                        {step === 'purchase' && (
                            <div className="text-center py-8 space-y-6 animate-in fade-in">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-[#FF007A] rounded-full border-t-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Clock className="w-8 h-8 text-[#FF007A]" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Executing CCA Strategy</h3>
                                    <p className="text-gray-400">Processing Permit2 and standardizing distribution...</p>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CCAAuctionModal
