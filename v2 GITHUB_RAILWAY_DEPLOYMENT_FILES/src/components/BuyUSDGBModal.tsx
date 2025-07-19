import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Wallet, 
  ExternalLink, 
  Check, 
  AlertCircle,
  Info,
  ShoppingCart,
  ArrowRight,
  Link as LinkIcon
} from 'lucide-react'
import { useConnect, useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { baseChain, switchToBase, USDGB_CONTRACT } from '../lib/web3Config'

interface BuyUSDGBModalProps {
  isOpen: boolean
  onClose: () => void
}

const BuyUSDGBModal = ({ isOpen, onClose }: BuyUSDGBModalProps) => {
  const [amount, setAmount] = useState('1000')
  const [step, setStep] = useState<'connect' | 'amount' | 'purchase'>('connect')
  
  const { connect, connectors, isPending } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

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

  const handlePurchase = async () => {
    if (chainId !== baseChain.id) {
      try {
        switchChain({ chainId: baseChain.id })
      } catch (error) {
        await switchToBase()
      }
    }
    setStep('purchase')
    // Here you would implement the actual purchase logic
    setTimeout(() => {
      alert('Purchase simulation complete! This would connect to your smart contract.')
    }, 2000)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getWalletName = (connectorId: string) => {
    switch (connectorId) {
      case 'metaMask':
        return 'MetaMask'
      case 'coinbaseWallet':
        return 'Coinbase'
      case 'walletConnect':
        return 'WalletConnect'
      default:
        return 'Wallet'
    }
  }

  const getWalletDescription = (connectorId: string) => {
    switch (connectorId) {
      case 'metaMask':
        return 'Browser extension wallet'
      case 'coinbaseWallet':
        return 'Secure & trusted wallet'
      case 'walletConnect':
        return 'Connect mobile wallets'
      default:
        return 'Secure connection'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 border border-amber-500/20 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Buy USDGB</h2>
                  <p className="text-gray-400 text-sm">Gold-backed stablecoin</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                title="Close"
              >
                <X className="w-5 h-5 text-red-400 hover:text-red-300" />
              </button>
            </div>

            {/* Base Chain Notice */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-semibold mb-1">Base Chain Token</h4>
                  <p className="text-gray-300 text-sm">
                    USDGB is deployed on <strong>Base Chain</strong> for optimal security and low transaction costs. 
                    Your wallet will automatically switch to Base network.
                  </p>
                </div>
              </div>
            </div>

            {/* Connect Wallet Step */}
            {step === 'connect' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Connect Your Wallet</h3>
                
                {connectors.filter(connector => ['metaMask', 'coinbaseWallet', 'walletConnect'].includes(connector.id)).map((connector) => (
                  <motion.button
                    key={connector.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConnect(connector.id)}
                    disabled={isPending}
                    className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-amber-500/50 rounded-xl transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="text-left">
                      <p className="text-white font-medium text-lg">
                        {getWalletName(connector.id)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {getWalletDescription(connector.id)}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </motion.button>
                ))}

                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Don't have a wallet? Download{' '}
                    <a 
                      href="https://metamask.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline"
                    >
                      MetaMask
                    </a>
                    {', '}
                    <a 
                      href="https://wallet.coinbase.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline"
                    >
                      Coinbase Wallet
                    </a>
                    {', or use '}
                    <a 
                      href="https://walletconnect.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline"
                    >
                      WalletConnect
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Amount Selection Step */}
            {step === 'amount' && isConnected && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Purchase Amount</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Connected</span>
                    <span className="text-gray-400">{formatAddress(address!)}</span>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    USDGB Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-xl font-bold focus:border-amber-400 focus:outline-none"
                      min="100"
                      step="100"
                      placeholder="1000"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 font-bold">
                      USDGB
                    </div>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {['1K', '5K', '10K', '25K'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.replace('K', '000'))}
                      className="py-2 bg-slate-700/50 hover:bg-amber-500/20 border border-slate-600 hover:border-amber-500/50 rounded-lg text-white text-sm font-medium transition-all"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                {/* Chain Warning */}
                {chainId !== baseChain.id && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-orange-400 font-semibold mb-1">Wrong Network</h4>
                        <p className="text-gray-300 text-sm">
                          Please switch to Base network to purchase USDGB tokens.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Purchase Summary */}
                <div className="space-y-3 p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount</span>
                    <span className="text-white font-bold">{Number(amount).toLocaleString()} USDGB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Price</span>
                    <span className="text-white">$1.00 per USDGB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Network</span>
                    <span className="text-blue-400">Base Chain</span>
                  </div>
                  <hr className="border-slate-600" />
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">Total</span>
                    <span className="text-amber-400 font-bold text-lg">${Number(amount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => disconnect()}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-white font-medium transition-all flex-1"
                  >
                    Disconnect
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold rounded-xl transition-all flex-1 flex items-center justify-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Purchase</span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Purchase Step */}
            {step === 'purchase' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Wallet className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Processing Purchase</h3>
                  <p className="text-gray-400">
                    Please confirm the transaction in your wallet...
                  </p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <p className="text-blue-400 text-sm">
                    <strong>Note:</strong> This is a demo interface. In production, this would interact with the USDGB smart contract on Base chain.
                  </p>
                </div>
              </div>
            )}

            {/* Contract Info */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Contract Address</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 font-mono text-xs">
                    {USDGB_CONTRACT.address.slice(0, 10)}...
                  </span>
                  <LinkIcon className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BuyUSDGBModal