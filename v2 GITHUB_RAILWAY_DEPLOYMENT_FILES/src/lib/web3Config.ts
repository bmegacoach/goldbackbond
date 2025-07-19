import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Base Chain configuration (where USDGB is deployed)
export const baseChain = {
  ...base,
  name: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
}

// USDGB Token Contract (Base Chain)
export const USDGB_CONTRACT = {
  address: '0x1234567890123456789012345678901234567890', // Replace with actual contract address
  decimals: 18,
  symbol: 'USDGB',
  name: 'GoldBackBond USD',
}

// Wallet connectors with improved error handling
const connectors = [
  metaMask({
    dappMetadata: {
      name: 'GoldBackBond',
      url: 'https://goldbackbond.com',
      iconUrl: '/images/goldbackbond-transparent.png',
    },
  }),
  coinbaseWallet({
    appName: 'GoldBackBond',
    appLogoUrl: '/images/goldbackbond-transparent.png',
    preference: 'smartWalletOnly', // Optimize for faster connections
  }),
  walletConnect({
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a7f3f8b5e1c2d4a6f8b1c3d2e4f6a8b1', // Updated project ID for production use
    metadata: {
      name: 'GoldBackBond',
      description: 'Premium gold-backed stablecoin platform backed by federal reserve certificates',
      url: 'https://goldbackbond.com',
      icons: ['https://goldbackbond.com/images/goldbackbond-transparent.png'],
    },
    showQrModal: true,
    qrModalOptions: {
      themeMode: 'dark',
      themeVariables: {
        '--wcm-z-index': '1000',
        '--wcm-accent-color': '#f59e0b',
        '--wcm-background-color': '#1e293b',
        '--wcm-font-family': 'Inter, system-ui, sans-serif',
      },
    },
  }),
]

// Wagmi configuration - optimized for performance with primary chains only
export const wagmiConfig = createConfig({
  chains: [baseChain, mainnet],
  connectors,
  transports: {
    [baseChain.id]: http(),
    [mainnet.id]: http(),
  },
})

// Chain switching helper with improved error handling
export const switchToBase = async () => {
  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${baseChain.id.toString(16)}` }],
    })
  } catch (error: any) {
    // Chain not added to wallet, add it
    if (error.code === 4902) {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${baseChain.id.toString(16)}`,
            chainName: baseChain.name,
            nativeCurrency: baseChain.nativeCurrency,
            rpcUrls: [baseChain.rpcUrls.default.http[0]],
            blockExplorerUrls: [baseChain.blockExplorers.default.url],
          },
        ],
      })
    } else {
      console.error('Failed to switch chain:', error)
      throw error
    }
  }
}

// Connection health check helper
export const checkWalletConnection = async (connector: any) => {
  try {
    // Test connection with timeout
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    )
    
    const connection = connector.connect()
    await Promise.race([connection, timeout])
    return true
  } catch (error) {
    console.error('Wallet connection failed:', error)
    return false
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}