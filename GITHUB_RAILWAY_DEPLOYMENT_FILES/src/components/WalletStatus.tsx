/**
 * WalletStatus - Compact wallet connection component for dApp
 */

import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react'
import { useWalletBalance } from '../hooks/useSmartContractData'
import EnhancedWalletModal from './EnhancedWalletModal'

const WalletStatus = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { formattedBalance, formattedPortfolioValue } = useWalletBalance()

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      // You could add a toast notification here
    }
  }

  const handleViewOnExplorer = () => {
    if (address) {
      window.open(`https://basescan.org/address/${address}`, '_blank')
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <>
        <button
          onClick={() => setShowConnectModal(true)}
          className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-amber-500/25"
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </button>
        
        <EnhancedWalletModal 
          isOpen={showConnectModal} 
          onClose={() => setShowConnectModal(false)} 
        />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-slate-700/50 border border-amber-500/30 rounded-lg px-4 py-2 text-white hover:bg-slate-700/70 transition-all duration-200 flex items-center space-x-3"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="font-medium">{formatAddress(address!)}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
          showDropdown ? 'rotate-180' : ''
        }`} />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-80 bg-slate-800 border border-amber-500/30 rounded-xl shadow-xl shadow-black/20 z-50"
          >
            <div className="p-4">
              {/* Wallet Info Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <div className="text-white font-medium">Wallet Connected</div>
                  <div className="text-xs text-gray-400">Base Network</div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-400 mb-1">Address</div>
                <div className="text-white font-mono text-sm break-all">{address}</div>
              </div>

              {/* Balances */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">USDGB Balance</span>
                  <span className="text-white font-medium">{formattedBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Portfolio Value</span>
                  <span className="text-amber-400 font-medium">{formattedPortfolioValue}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyAddress}
                  className="flex-1 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
                
                <button
                  onClick={handleViewOnExplorer}
                  className="flex-1 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Explorer</span>
                </button>
                
                <button
                  onClick={() => {
                    disconnect()
                    setShowDropdown(false)
                  }}
                  className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default WalletStatus