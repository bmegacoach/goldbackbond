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
  Link as LinkIcon,
  Loader2
} from 'lucide-react'
import { useConnect, useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { baseChain, switchToBase, USDGB_CONTRACT } from '../lib/web3Config'
import { useToast } from './ToastProvider'
import TransactionService, { TransactionState } from '../services/transactionService'
import { useNavigate } from 'react-router-dom'

interface BuyUSDGBModalProps {
  isOpen: boolean
  onClose: () => void
}

const BuyUSDGBModal = ({ isOpen, onClose }: BuyUSDGBModalProps) => {
  const [amount, setAmount] = useState('1000')
  const [step, setStep] = useState<'connect' | 'amount' | 'purchase'>('connect')
  const [transactionState, setTransactionState] = useState<TransactionState>({ status: 'idle' })

  const { connect, connectors, isPending } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { showSuccess, showError, showInfo } = useToast()
  const transactionService = TransactionService.getInstance()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      onClose(); // instantly close the modal
      navigate('/app/buy-wizard'); // redirect to the new funnel
    }
  }, [isOpen, navigate, onClose])

  // Rest of the component is unused but kept for reference/fallback if ever decoupled from navigate

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
    }
  }

  const handlePurchase = async () => {
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
        try {
          await switchToBase()
        } catch (switchError) {
          showError('Network Error', 'Failed to switch to Base network. Please switch manually.')
          return
        }
      }
    }

    setStep('purchase')

    // Execute the purchase transaction
    const success = await transactionService.purchaseUSDGB(
      amount,
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
              'Purchase Successful!',
              `Successfully purchased ${Number(amount).toLocaleString()} USDGB tokens`,
              {
                label: 'View Transaction',
                onClick: () => window.open(transactionService.getTransactionUrl(state.hash!), '_blank')
              }
            )
            // Close modal after success
            setTimeout(() => {
              onClose()
              setStep('connect')
              setTransactionState({ status: 'idle' })
            }, 2000)
            break
          case 'error':
            showError('Transaction Failed', state.error || 'Unknown error occurred')
            setStep('amount') // Go back to amount selection
            break
        }
      }
    )

    if (!success && transactionState.status === 'error') {
      // Additional error handling if needed
    }
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

  return null; // Return nothing since the useEffect handles the redirect
}

export default BuyUSDGBModal