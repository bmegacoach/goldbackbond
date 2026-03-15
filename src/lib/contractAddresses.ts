/**
 * Contract Address Registry
 * Centralized contract addresses for the GOLDBACKBOND ecosystem
 * 
 * NETWORK: Base Mainnet — production deployment
 */

// Base Mainnet contract addresses (GBB Ecosystem)
export const CONTRACTS = {
    USDGB_TOKEN: '0x1b12fdbda1d6709e189fe16e1a76469e05ce8a5e' as `0x${string}`,
    MINTING: '0x899a399a783494bec8ff8c2ab5ec1fc29efe3a63' as `0x${string}`, 
    LP_REWARD_POOL: '0xbfb2a2d959819590b72815d637e50c16be9cad3f' as `0x${string}`,
    GOLD_BONUS_VAULT: '0x3a3d2a95e29e93b9406f15e4543044a93d495a69' as `0x${string}`,
    CERTIFICATE_STAKING: '0xfe57d42b4e32c62f69b22b459d53b9dd9021facf' as `0x${string}`,
    GUARDIAN: '0x4cbce2b39d4974269c7b8b1341dbc7db0352945a' as `0x${string}`,
    ALLOCATION_INSCRIPTION: '0xC14607086D470Bc9737756FBb2B14a091EF37B32' as `0x${string}`,
    LENDER_REGISTRY: '0x07c810645b5230DE0430d5A93705E323f5a5104e' as `0x${string}`,
} as const

// Uniswap V4 Addresses (Base Mainnet)
export const UNISWAP_V4 = {
    POOL_MANAGER: '0x498581ff718922c3f8e6a244956af099b2652b2b' as `0x${string}`,
    PERMIT2: '0x000000000022D473030F116dDEE9F6B43aC78BA3' as `0x${string}`,
    LIQUIDITY_LAUNCHER: '0x00000008412db3394C91A5CbD01635c6d140637C' as `0x${string}`,
    QUOTER: '0x0d5e0f971ed27fbff6c2837bf31316121532048d' as `0x${string}`,
    STATE_VIEW: '0xa3c0c9b65bad0b08107aa264b0f3db444b867a71' as `0x${string}`,
} as const

// Uniswap V3 Addresses (Base Mainnet - Legacy/Reference)
export const UNISWAP_V3 = {
    FACTORY: '0x33128a8fC170d9361767E28C1b3c96735Af2260A' as `0x${string}`,
    POSITION_MANAGER: '0x03a520b8D20349885Bc2E59C75C84BB52377CE75' as `0x${string}`,
    ROUTER: '0x2626664c2602331C5a90dA20c6dc63cca2b3e8E8' as `0x${string}`,
    WETH: '0x4200000000000000000000000000000000000006' as `0x${string}`,
    USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as `0x${string}`,
} as const

// Gnosis Safe Multisig (Base Mainnet)
export const MULTISIG_ADDRESS = '0xbef82e4eaecba3e50c6ec8539d02fb4a75c452d0' as `0x${string}`

// Network configuration
export const NETWORK = {
    CHAIN_ID: 8453, // Base Mainnet
    NAME: 'Base',
    RPC_URL: 'https://mainnet.base.org',
    BLOCK_EXPLORER: 'https://basescan.org',
    IS_TESTNET: false,
} as const

// Contract metadata for display
export const CONTRACT_METADATA = {
    USDGB_TOKEN: {
        name: 'GOLDBACKBOND',
        symbol: 'USDGB',
        decimals: 18,
        maxSupply: '250560000000', // 250.56B
    },
    LP_REWARD_POOL: {
        aprTiers: [50, 30, 20, 10], // Month 1-4+ APR %
    },
    GOLD_BONUS_VAULT: {
        bonusCap: 15, // Max 15% APR bonus
    },
    CERTIFICATE_STAKING: {
        lockupPeriod: 365, // days
        leverageMultiplier: 3, // 3x
    },
    MINTING: {
        defaultSoftLimit: '10000', // 10K USDGB
        defaultHardLimit: '1000000', // 1M USDGB
    },
} as const

/**
 * Get BaseScan URL for a contract address
 */
export function getContractUrl(address: string): string {
    return `${NETWORK.BLOCK_EXPLORER}/address/${address}`
}

/**
 * Get BaseScan URL for a transaction hash
 */
export function getTransactionUrl(hash: string): string {
    return `${NETWORK.BLOCK_EXPLORER}/tx/${hash}`
}
