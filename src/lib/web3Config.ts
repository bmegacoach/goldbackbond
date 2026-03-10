import { createConfig, http } from 'wagmi'
import { base, baseSepolia, mainnet } from 'wagmi/chains'
import { metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { CONTRACTS, NETWORK, CONTRACT_METADATA } from './contractAddresses'

/**
 * Chain Configuration
 * 
 * CURRENT: Base Mainnet — audited contracts deployed here
 */

// Base Sepolia (testnet configuration)
export const baseSepoliaChain = {
  ...baseSepolia,
  name: 'Base Sepolia',
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan Sepolia',
      url: 'https://sepolia.basescan.org',
    },
  },
}

// Base Mainnet (active production deployment)
export const baseChain = {
  ...base,
  name: 'Base Mainnet',
  rpcUrls: {
    default: {
      http: [NETWORK.RPC_URL],
    },
    public: {
      http: [NETWORK.RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: NETWORK.BLOCK_EXPLORER,
    },
  },
}

// Active chain — the network where contracts are deployed
// Switch to baseChain for mainnet deployment
export const activeChain = NETWORK.IS_TESTNET ? baseSepoliaChain : baseChain

// USDGB Token Contract
export const USDGB_CONTRACT = {
  address: CONTRACTS.USDGB_TOKEN,
  decimals: CONTRACT_METADATA.USDGB_TOKEN.decimals,
  symbol: CONTRACT_METADATA.USDGB_TOKEN.symbol,
  name: CONTRACT_METADATA.USDGB_TOKEN.name,
}

// Wallet connectors
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
    preference: 'smartWalletOnly',
  }),
  walletConnect({
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a7f3f8b5e1c2d4a6f8b1c3d2e4f6a8b1',
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

// Wagmi configuration — includes testnet + mainnet chains
export const wagmiConfig = createConfig({
  chains: [activeChain, mainnet],
  connectors,
  transports: {
    [activeChain.id]: http(NETWORK.RPC_URL),
    [mainnet.id]: http(),
  },
})

// Chain switching helper
export const switchToActiveChain = async () => {
  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${activeChain.id.toString(16)}` }],
    })
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${activeChain.id.toString(16)}`,
            chainName: activeChain.name,
            nativeCurrency: activeChain.nativeCurrency,
            rpcUrls: [activeChain.rpcUrls.default.http[0]],
            blockExplorerUrls: [activeChain.blockExplorers.default.url],
          },
        ],
      })
    } else {
      console.error('Failed to switch chain:', error)
      throw error
    }
  }
}

// Legacy alias for backward compatibility
export const switchToBase = switchToActiveChain

// Connection health check helper
export const checkWalletConnection = async (connector: any) => {
  try {
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