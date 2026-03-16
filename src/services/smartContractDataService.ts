/**
 * Smart Contract Data Service
 * Reads live on-chain data from the GOLDBACKBOND smart contract suite
 * 
 * LIVE: Connected to audited contracts on Base Mainnet
 * Contracts: USDGB Token, USDGBMinting, LpRewardPool, GoldBonusVault, CertificateStaking, Guardian
 */

import { ethers } from 'ethers'
import { CONTRACTS, NETWORK } from '../lib/contractAddresses'
import GoldPriceService from './goldPriceService'

// ABI imports
import USDGBTokenABI from '../lib/abis/USDGBToken.json'
import USDGBMintingABI from '../lib/abis/USDGBMinting.json'
import LpRewardPoolABI from '../lib/abis/LpRewardPool.json'
import GoldBonusVaultABI from '../lib/abis/GoldBonusVault.json'
import CertificateStakingABI from '../lib/abis/CertificateStaking.json'
import GuardianABI from '../lib/abis/Guardian.json'
import GBBAllocationInscriptionABI from '../lib/abis/GBBAllocationInscription.json'
import LBPStrategyABI from '../lib/abis/LBPStrategy.json' // V4 CCA Hook

// External API endpoints (for off-chain data)
const EXTERNAL_APIS = {
  GOLD_PRICE: 'https://api.gold-api.com/price/XAU',
  MARKET_DATA: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
  BACKEND_API: 'https://goldbackbond-backend-production.up.railway.app'
}

export interface SmartContractMetrics {
  // USDGB Token Metrics
  totalSupply: string
  totalValueLocked: string
  marketCap: string

  // Staking Metrics
  totalStaked: string
  totalStakers: number
  averageStakingPeriod: number
  totalRewardsDistributed: string
  currentAPR: number

  // Lending Metrics
  totalBorrowed: string
  activeLenders: number
  averageLTV: number
  averageRate: number
  totalCollateral: string

  // Gold Certificate Metrics
  goldCertificatesLive: number
  goldKilogramsLive: number
  liveGoldPrice: number
  goldPriceChange: number

  // Real-time Data
  lastUpdated: Date
  blockNumber: number
  networkStatus: string

  // Contract Status
  mintingPaused: boolean
  stakingPaused: boolean

  // CCA Auction Metrics
  ccaCurrentPrice: string
  ccaTotalRaised: string
  ccaTargetRaise: string
  ccaTimeRemaining: number
  ccaTokensDistributed: string
}

export interface UserWalletData {
  address: string
  usdgbBalance: string
  stakedAmount: string
  stakingRewards: string
  loanPositions: LoanPosition[]
  goldCertificateValue: string
  totalPortfolioValue: string
  isConnected: boolean
  // New fields from live contracts
  lpStakeAmount: string
  lpPendingReward: string
  lpCalculatedReward: string
  certificateStakeAmount: string
  certificateUnlockTime: number
  certificateIsLocked: boolean
  leverageEligible: boolean
  leverageValue: string
}

export interface LoanPosition {
  loanId: string
  collateralAmount: string
  borrowedAmount: string
  currentLTV: number
  interestRate: number
  status: string
  healthFactor: number
}

class SmartContractDataService {
  private static instance: SmartContractDataService
  private provider: ethers.JsonRpcProvider | null = null
  private contracts: {
    usdgb?: ethers.Contract
    minting?: ethers.Contract
    lpRewardPool?: ethers.Contract
    goldBonusVault?: ethers.Contract
    certificateStaking?: ethers.Contract
    guardian?: ethers.Contract
    allocationInscription?: ethers.Contract
  } = {}
  private isInitialized = false

  private constructor() { }

  public static getInstance(): SmartContractDataService {
    if (!SmartContractDataService.instance) {
      SmartContractDataService.instance = new SmartContractDataService()
    }
    return SmartContractDataService.instance
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      this.provider = new ethers.JsonRpcProvider(NETWORK.RPC_URL)

      // Initialize all contract instances with read-only provider
      this.contracts.usdgb = new ethers.Contract(CONTRACTS.USDGB_TOKEN, USDGBTokenABI, this.provider)
      this.contracts.minting = new ethers.Contract(CONTRACTS.MINTING, USDGBMintingABI, this.provider)
      this.contracts.lpRewardPool = new ethers.Contract(CONTRACTS.LP_REWARD_POOL, LpRewardPoolABI, this.provider)
      this.contracts.goldBonusVault = new ethers.Contract(CONTRACTS.GOLD_BONUS_VAULT, GoldBonusVaultABI, this.provider)
      this.contracts.certificateStaking = new ethers.Contract(CONTRACTS.CERTIFICATE_STAKING, CertificateStakingABI, this.provider)
      this.contracts.guardian = new ethers.Contract(CONTRACTS.GUARDIAN, GuardianABI, this.provider)
      this.contracts.allocationInscription = new ethers.Contract(CONTRACTS.ALLOCATION_INSCRIPTION, GBBAllocationInscriptionABI, this.provider)

      this.isInitialized = true
      console.log('Smart Contract Data Service initialized — connected to Base Mainnet')
    } catch (error) {
      console.error('Failed to initialize Smart Contract Data Service:', error)
      // Don't throw — fallback gracefully
    }
  }

  /**
   * Get comprehensive smart contract metrics
   */
  async getSmartContractMetrics(): Promise<SmartContractMetrics> {
    try {
      await this.initialize()

      const [
        tokenMetrics,
        stakingMetrics,
        lendingMetrics,
        goldMetrics,
        blockData,
        contractStatus,
        ccaMetrics,
      ] = await Promise.all([
        this.getTokenMetrics(),
        this.getStakingMetrics(),
        this.getLendingMetrics(),
        this.getGoldMetrics(),
        this.getBlockData(),
        this.getContractStatus(),
        this.getCCAMetrics(),
      ])

      return {
        totalSupply: tokenMetrics.totalSupply,
        totalValueLocked: tokenMetrics.totalValueLocked,
        marketCap: tokenMetrics.marketCap,

        totalStaked: stakingMetrics.totalStaked,
        totalStakers: stakingMetrics.totalStakers,
        averageStakingPeriod: stakingMetrics.averageStakingPeriod,
        totalRewardsDistributed: stakingMetrics.totalRewardsDistributed,
        currentAPR: stakingMetrics.currentAPR,

        totalBorrowed: lendingMetrics.totalBorrowed,
        activeLenders: lendingMetrics.activeLenders,
        averageLTV: lendingMetrics.averageLTV,
        averageRate: lendingMetrics.averageRate,
        totalCollateral: lendingMetrics.totalCollateral,

        goldCertificatesLive: goldMetrics.goldCertificatesLive,
        goldKilogramsLive: goldMetrics.goldKilogramsLive,
        liveGoldPrice: goldMetrics.liveGoldPrice,
        goldPriceChange: goldMetrics.goldPriceChange,

        lastUpdated: new Date(),
        blockNumber: blockData.blockNumber,
        networkStatus: blockData.networkStatus,

        mintingPaused: contractStatus.mintingPaused,
        stakingPaused: contractStatus.stakingPaused,

        ccaCurrentPrice: ccaMetrics.ccaCurrentPrice,
        ccaTotalRaised: ccaMetrics.ccaTotalRaised,
        ccaTargetRaise: ccaMetrics.ccaTargetRaise,
        ccaTimeRemaining: ccaMetrics.ccaTimeRemaining,
        ccaTokensDistributed: ccaMetrics.ccaTokensDistributed,
      }
    } catch (error) {
      console.error('Failed to fetch smart contract metrics:', error)
      return this.getFallbackMetrics()
    }
  }

  /**
   * Get user-specific wallet data from live contracts
   */
  async getUserWalletData(userAddress: string): Promise<UserWalletData> {
    try {
      await this.initialize()

      if (!userAddress) {
        return this.getDisconnectedWalletData()
      }

      const [
        balance,
        lpStakeData,
        certStakeData,
        loanPositions,
      ] = await Promise.all([
        this.getUserBalance(userAddress),
        this.getUserLpStakingData(userAddress),
        this.getUserCertificateData(userAddress),
        this.getUserLoanPositions(userAddress),
      ])

      const goldCertificateValue = this.calculateGoldCertificateValue(certStakeData.amount)
      const totalPortfolioValue = this.calculateTotalPortfolioValue(
        balance,
        { stakedAmount: lpStakeData.lpAmount, rewards: lpStakeData.calculatedReward },
        loanPositions
      )

      return {
        address: userAddress,
        usdgbBalance: balance,
        stakedAmount: lpStakeData.lpAmount,
        stakingRewards: lpStakeData.calculatedReward,
        loanPositions,
        goldCertificateValue,
        totalPortfolioValue,
        isConnected: true,
        // New live contract fields
        lpStakeAmount: lpStakeData.lpAmount,
        lpPendingReward: lpStakeData.pendingReward,
        lpCalculatedReward: lpStakeData.calculatedReward,
        certificateStakeAmount: certStakeData.amount,
        certificateUnlockTime: certStakeData.unlockTime,
        certificateIsLocked: certStakeData.isLocked,
        leverageEligible: certStakeData.isEligible,
        leverageValue: certStakeData.leverageValue,
      }
    } catch (error) {
      console.error('Failed to fetch user wallet data:', error)
      return this.getDisconnectedWalletData()
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribeToUpdates(callback: (metrics: SmartContractMetrics) => void) {
    setInterval(async () => {
      try {
        const metrics = await this.getSmartContractMetrics()
        callback(metrics)
      } catch (error) {
        console.error('Failed to fetch updated metrics:', error)
      }
    }, 30000) // Update every 30 seconds
  }

  // ==========================================
  // LIVE CONTRACT READS
  // ==========================================

  private async getTokenMetrics() {
    try {
      if (!this.contracts.usdgb) throw new Error('Contract not initialized')

      const totalSupplyRaw = await this.contracts.usdgb.totalSupply()
      const totalSupply = ethers.formatUnits(totalSupplyRaw, 18)

      // TVL = tokens held by staking contracts
      let tvl = 0n
      try {
        const lpPoolBalance = await this.contracts.usdgb.balanceOf(CONTRACTS.LP_REWARD_POOL)
        const certBalance = await this.contracts.usdgb.balanceOf(CONTRACTS.CERTIFICATE_STAKING)
        const vaultBalance = await this.contracts.usdgb.balanceOf(CONTRACTS.GOLD_BONUS_VAULT)
        tvl = lpPoolBalance + certBalance + vaultBalance
      } catch {
        // If any balance call fails, TVL stays 0
      }

      // Market cap = totalSupply * $1 (USDGB is a stablecoin pegged to $1)
      const totalSupplyNum = parseFloat(totalSupply)
      const marketCap = totalSupplyNum.toFixed(2)

      return {
        totalSupply,
        totalValueLocked: ethers.formatUnits(tvl, 18),
        marketCap,
      }
    } catch (error) {
      console.warn('Token metrics fallback:', error)
      return { totalSupply: '0', totalValueLocked: '0', marketCap: '0' }
    }
  }

  private async getStakingMetrics() {
    try {
      if (!this.contracts.lpRewardPool) throw new Error('Contract not initialized')

      // Get current APR tier
      const launchTime = await this.contracts.lpRewardPool.LAUNCH_TIME()
      const now = Math.floor(Date.now() / 1000)
      const monthsSinceLaunch = Math.floor((now - Number(launchTime)) / (30 * 24 * 60 * 60))
      const tierIndex = Math.min(monthsSinceLaunch, 3)
      const currentAPR = Number(await this.contracts.lpRewardPool.aprTiers(tierIndex))

      // Total staked = GBB balance of the LP Reward Pool
      let totalStaked = '0'
      try {
        const gbbTokenAddr = await this.contracts.lpRewardPool.GBB_TOKEN()
        const gbbToken = new ethers.Contract(gbbTokenAddr, USDGBTokenABI, this.provider!)
        const stakedRaw = await gbbToken.balanceOf(CONTRACTS.LP_REWARD_POOL)
        totalStaked = ethers.formatUnits(stakedRaw, 18)
      } catch {
        // Fallback
      }

      return {
        totalStaked,
        totalStakers: 0, // Cannot determine from contract alone (no enumeration)
        averageStakingPeriod: 0,
        totalRewardsDistributed: '0',
        currentAPR,
      }
    } catch (error) {
      console.warn('Staking metrics fallback:', error)
      return {
        totalStaked: '0',
        totalStakers: 0,
        averageStakingPeriod: 0,
        totalRewardsDistributed: '0',
        currentAPR: 50, // Default launch APR
      }
    }
  }

  private async getLendingMetrics() {
    // Lending metrics come from the backend API / certificate staking leverage
    // No dedicated lending contract exists in the audited suite
    return {
      totalBorrowed: '0',
      activeLenders: 0,
      averageLTV: 0,
      averageRate: 0,
      totalCollateral: '0',
    }
  }

  private async getGoldMetrics() {
    try {
      const goldPriceService = GoldPriceService.getInstance()
      const priceData = await goldPriceService.getCurrentPrice()

      // Try to get on-chain gold price from GoldBonusVault (Chainlink)
      let onChainGoldPrice = 0
      try {
        if (this.contracts.goldBonusVault) {
          const chainlinkPrice = await this.contracts.goldBonusVault.getLatestGoldPrice()
          onChainGoldPrice = Number(ethers.formatUnits(chainlinkPrice, 8)) // Chainlink uses 8 decimals
        }
      } catch {
        // Chainlink may be stale on testnet — use API price
      }

      return {
        goldCertificatesLive: 108,
        goldKilogramsLive: 10800000,
        liveGoldPrice: onChainGoldPrice > 0 ? onChainGoldPrice : priceData.price,
        goldPriceChange: priceData.change24h || 0,
      }
    } catch (error) {
      console.error('Failed to fetch gold price:', error)
      return {
        goldCertificatesLive: 108,
        goldKilogramsLive: 10800000,
        liveGoldPrice: 0,
        goldPriceChange: 0,
      }
    }
  }

  private async getBlockData() {
    try {
      const blockNumber = await this.provider?.getBlockNumber() || 0
      return { blockNumber, networkStatus: 'connected' }
    } catch {
      return { blockNumber: 0, networkStatus: 'disconnected' }
    }
  }

  private async getContractStatus() {
    try {
      const [mintingPaused, stakingPaused] = await Promise.all([
        this.contracts.minting?.paused().catch(() => false),
        this.contracts.lpRewardPool?.paused().catch(() => false),
      ])
      return {
        mintingPaused: mintingPaused || false,
        stakingPaused: stakingPaused || false,
      }
    } catch {
      return { mintingPaused: false, stakingPaused: false }
    }
  }

  private async getCCAMetrics() {
    try {
      // CCA Metrics sourced from Uniswap v4 LBP Strategy Hook
      // For now, using totalSupply as a proxy for tokens distributed in CCA
      if (!this.contracts.usdgb) throw new Error('Contract not initialized')
      
      const totalSupplyRaw = await this.contracts.usdgb.totalSupply()
      const totalSupply = parseFloat(ethers.formatUnits(totalSupplyRaw, 18))
      
      // Calculate total raised based on $0.90 floor price for tokens minted so far
      const totalRaised = (totalSupply * 0.90).toFixed(0)
      
      return {
        ccaCurrentPrice: "0.90",
        ccaTotalRaised: totalRaised,
        ccaTargetRaise: "100000000",
        ccaTimeRemaining: 518400, // 6 days
        ccaTokensDistributed: totalSupply.toFixed(0),
      }
    } catch (error) {
      console.warn('CCA metrics fetch failed:', error)
      return {
        ccaCurrentPrice: "0.90",
        ccaTotalRaised: "0",
        ccaTargetRaise: "100000000",
        ccaTimeRemaining: 604800,
        ccaTokensDistributed: "0"
      }
    }
  }

  // ==========================================
  // USER-SPECIFIC READS
  // ==========================================

  private async getUserBalance(address: string): Promise<string> {
    try {
      if (!this.contracts.usdgb) return '0'
      const balance = await this.contracts.usdgb.balanceOf(address)
      return ethers.formatUnits(balance, 18)
    } catch {
      return '0'
    }
  }

  private async getUserLpStakingData(address: string) {
    try {
      if (!this.contracts.lpRewardPool) throw new Error('Not initialized')

      const [stakeData, reward] = await Promise.all([
        this.contracts.lpRewardPool.userStakes(address),
        this.contracts.lpRewardPool.calculateReward(address),
      ])

      return {
        lpAmount: ethers.formatUnits(stakeData.lpAmount, 18),
        startTime: Number(stakeData.startTime),
        lastClaimTime: Number(stakeData.lastClaimTime),
        pendingReward: ethers.formatUnits(stakeData.pendingClaimReward, 18),
        calculatedReward: ethers.formatUnits(reward, 18),
      }
    } catch {
      return {
        lpAmount: '0',
        startTime: 0,
        lastClaimTime: 0,
        pendingReward: '0',
        calculatedReward: '0',
      }
    }
  }

  private async getUserCertificateData(address: string) {
    try {
      if (!this.contracts.certificateStaking) throw new Error('Not initialized')

      const [stakeData, leverage] = await Promise.all([
        this.contracts.certificateStaking.userStakes(address),
        this.contracts.certificateStaking.getLeverageEligibility(address),
      ])

      const now = Math.floor(Date.now() / 1000)
      return {
        amount: ethers.formatUnits(stakeData.amount, 18),
        unlockTime: Number(stakeData.unlockTime),
        isLocked: Number(stakeData.unlockTime) > now,
        isEligible: leverage.isEligible,
        leverageValue: ethers.formatUnits(leverage.leverageValue, 18),
      }
    } catch {
      return {
        amount: '0',
        unlockTime: 0,
        isLocked: false,
        isEligible: false,
        leverageValue: '0',
      }
    }
  }

  private async getUserLoanPositions(address: string): Promise<LoanPosition[]> {
    // No dedicated lending contract — loan positions come from backend
    return []
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  private calculateGoldCertificateValue(stakedAmount: string): string {
    // 3:1 gold certificate value from CertificateStaking
    const staked = parseFloat(stakedAmount)
    return (staked * 3).toString()
  }

  private calculateTotalPortfolioValue(
    balance: string,
    stakingData: any,
    loanPositions: LoanPosition[]
  ): string {
    const balanceValue = parseFloat(balance)
    const stakedValue = parseFloat(stakingData.stakedAmount)
    const rewardsValue = parseFloat(stakingData.rewards)
    const loanValue = loanPositions.reduce((sum, loan) =>
      sum + parseFloat(loan.collateralAmount), 0
    )
    return (balanceValue + stakedValue + rewardsValue + loanValue).toString()
  }

  getDisconnectedWalletData(): UserWalletData {
    return {
      address: '',
      usdgbBalance: '0',
      stakedAmount: '0',
      stakingRewards: '0',
      loanPositions: [],
      goldCertificateValue: '0',
      totalPortfolioValue: '0',
      isConnected: false,
      lpStakeAmount: '0',
      lpPendingReward: '0',
      lpCalculatedReward: '0',
      certificateStakeAmount: '0',
      certificateUnlockTime: 0,
      certificateIsLocked: false,
      leverageEligible: false,
      leverageValue: '0',
    }
  }

  private getFallbackMetrics(): SmartContractMetrics {
    return {
      totalSupply: '0',
      totalValueLocked: '0',
      marketCap: '0',
      totalStaked: '0',
      totalStakers: 0,
      averageStakingPeriod: 0,
      totalRewardsDistributed: '0',
      currentAPR: 50, // Launch APR
      totalBorrowed: '0',
      activeLenders: 0,
      averageLTV: 0,
      averageRate: 0,
      totalCollateral: '0',
      goldCertificatesLive: 108,
      goldKilogramsLive: 10800000,
      liveGoldPrice: 0,
      goldPriceChange: 0,
      lastUpdated: new Date(),
      blockNumber: 0,
      networkStatus: 'fallback',
      mintingPaused: false,
      stakingPaused: false,

      // CCA Fallbacks
      ccaCurrentPrice: "0.90",
      ccaTotalRaised: "0",
      ccaTargetRaise: "20000000",
      ccaTimeRemaining: 604800,
      ccaTokensDistributed: "0"
    }
  }
}

export default SmartContractDataService
