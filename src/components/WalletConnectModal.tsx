import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ArrowRight,
  Info
} from 'lucide-react'
import { useConnect } from 'wagmi'

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  operation?: string
}

const WalletConnectModal = ({ 
  isOpen, 
  onClose, 
  title = "Connect Your Wallet",
  subtitle = "Choose your preferred wallet to continue",
  operation = "proceed"
}: WalletConnectModalProps) => {
  const { connect, connectors, isPending } = useConnect()

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
      onClose()
    }
  }

  const getWalletName = (connectorId: string) => {
    switch (connectorId) {
      case 'metaMask':
        return 'MetaMask'
      case 'coinbaseWallet':
        return 'Coinbase Wallet'
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
            className="bg-slate-800 border border-amber-500/20 rounded-3xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-gray-300 text-sm mt-1">{subtitle}</p>
                <p className="text-gray-400 text-xs mt-1">Connect your wallet to access all DeFi features</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Base Chain Notice */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-semibold mb-1">Base Chain Network</h4>
                  <p className="text-gray-300 text-sm">
                    USDGB operates on <strong>Base Chain</strong> for optimal security and low transaction costs. 
                    Your wallet will automatically switch to Base network.
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Options */}
            <div className="space-y-4">
              {connectors.filter(connector => ['metaMask', 'coinbaseWallet', 'walletConnect'].includes(connector.id)).map((connector) => (
                <motion.button
                  key={connector.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isPending}
                  className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-amber-500/50 rounded-xl transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WalletConnectModal
