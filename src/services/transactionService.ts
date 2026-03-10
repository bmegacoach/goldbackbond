/**
 * Transaction Service
 * Handles all smart contract interactions with proper error handling
 * 
 * LIVE: Connected to audited GOLDBACKBOND contracts on Base Mainnet
 */

import { ethers } from 'ethers'
import {
  CONTRACTS,
  NETWORK,
  UNISWAP_V4,
  getTransactionUrl as getExplorerTxUrl
} from '../lib/contractAddresses'
import { wagmiConfig } from '../lib/web3Config'
import { getConnectorClient } from '@wagmi/core'

// ABI imports (ethers human-readable format)
import USDGBTokenABI from '../lib/abis/USDGBToken.json'
import USDGBMintingABI from '../lib/abis/USDGBMinting.json'
import LpRewardPoolABI from '../lib/abis/LpRewardPool.json'
import CertificateStakingABI from '../lib/abis/CertificateStaking.json'
import Permit2ABI from '../lib/abis/Permit2.json'
import LiquidityLauncherABI from '../lib/abis/LiquidityLauncher.json'
import LBPStrategyABI from '../lib/abis/LBPStrategy.json'

// Transaction status types
export type TransactionStatus =
  | 'idle'
  | 'preparing'
  | 'waiting_approval'
  | 'pending'
  | 'success'
  | 'error'

export interface TransactionState {
  status: TransactionStatus
  hash?: string
  error?: string
  receipt?: any
}

// Error types for better UX
export enum TransactionError {
  USER_REJECTED = 'User rejected the transaction',
  INSUFFICIENT_FUNDS = 'Insufficient funds for transaction',
  NETWORK_ERROR = 'Network error occurred',
  CONTRACT_ERROR = 'Smart contract error',
  UNKNOWN_ERROR = 'An unexpected error occurred',
  NOT_CONNECTED = 'Please connect your wallet to continue',
  WRONG_NETWORK = 'Please switch to Base Mainnet network',
  CONTRACT_PAUSED = 'This contract is currently paused for maintenance',
}

class TransactionService {
  private static instance: TransactionService

  private constructor() { }

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService()
    }
    return TransactionService.instance
  }

  /**
   * Get ethers provider and signer universally using Wagmi Core
   * Bypasses the limiting window.ethereum check to fully support WalletConnect & Coinbase Mobile
   */
  private async getProviderAndSigner() {
    try {
      const client = await getConnectorClient(wagmiConfig)
      // Extract EIP-1193 transport stream from active wagmi connector
      const { account, transport } = client
      const provider = new ethers.BrowserProvider(transport as any)
      const signer = await provider.getSigner(account.address)
      return { provider, signer }
    } catch (error) {
      console.warn("Wagmi client fetch failed, attempting window.ethereum fallback:", error)
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        return { provider, signer }
      }
      throw new Error(TransactionError.NOT_CONNECTED)
    }
  }

  /**
   * Purchase/Mint USDGB tokens via USDGBMinting contract
   * Routes through compliance queue (green lane ≤ softLimit, yellow lane > softLimit)
   */
  async purchaseUSDGB(
    amount: string,
    userAddress: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })

      const { signer } = await this.getProviderAndSigner()
      const mintingContract = new ethers.Contract(
        CONTRACTS.MINTING,
        USDGBMintingABI,
        signer
      )

      // Check if contract is paused
      const isPaused = await mintingContract.paused()
      if (isPaused) {
        onStatusChange({ status: 'error', error: TransactionError.CONTRACT_PAUSED })
        return false
      }

      const parsedAmount = ethers.parseUnits(amount, 18)

      onStatusChange({ status: 'waiting_approval' })

      const tx = await mintingContract.mint(userAddress, parsedAmount)

      onStatusChange({
        status: 'pending',
        hash: tx.hash,
      })

      const receipt = await tx.wait()

      onStatusChange({
        status: 'success',
        hash: tx.hash,
        receipt,
      })

      return true
    } catch (error: any) {
      onStatusChange({
        status: 'error',
        error: this.parseTransactionError(error),
      })
      return false
    }
  }

  /**
   * Stake LP tokens in the LpRewardPool
   * Earns time-decay APR (50% → 30% → 20% → 10%)
   */
  async joinBonusProgram(
    userAddress: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    // For bonus program, we stake LP tokens
    // This requires the user to have LP tokens and approve the pool first
    try {
      onStatusChange({ status: 'preparing' })

      const { signer } = await this.getProviderAndSigner()
      const lpRewardPool = new ethers.Contract(
        CONTRACTS.LP_REWARD_POOL,
        LpRewardPoolABI,
        signer
      )

      const isPaused = await lpRewardPool.paused()
      if (isPaused) {
        onStatusChange({ status: 'error', error: TransactionError.CONTRACT_PAUSED })
        return false
      }

      // Check user's LP token balance
      const lpTokenAddress = await lpRewardPool.LP_TOKEN()
      const lpToken = new ethers.Contract(lpTokenAddress, USDGBTokenABI, signer)
      const balance = await lpToken.balanceOf(userAddress)

      if (balance === 0n) {
        onStatusChange({
          status: 'error',
          error: 'No LP tokens found. Provide liquidity on Uniswap first to earn LP tokens.',
        })
        return false
      }

      // Approve LP tokens for the reward pool
      onStatusChange({ status: 'waiting_approval' })
      const approveTx = await lpToken.approve(CONTRACTS.LP_REWARD_POOL, balance)
      await approveTx.wait()

      // Stake all LP tokens
      const stakeTx = await lpRewardPool.stake(balance)

      onStatusChange({
        status: 'pending',
        hash: stakeTx.hash,
      })

      const receipt = await stakeTx.wait()

      onStatusChange({
        status: 'success',
        hash: stakeTx.hash,
        receipt,
      })

      return true
    } catch (error: any) {
      onStatusChange({
        status: 'error',
        error: this.parseTransactionError(error),
      })
      return false
    }
  }

  /**
   * Stake USDGB tokens in CertificateStaking (365-day lockup)
   * Unlocks 3x leverage eligibility for lending
   */
  async stakeUSDGB(
    amount: string,
    userAddress: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })

      const { signer } = await this.getProviderAndSigner()

      // First approve USDGB tokens for the staking contract
      const usdgb = new ethers.Contract(CONTRACTS.USDGB_TOKEN, USDGBTokenABI, signer)
      const certStaking = new ethers.Contract(
        CONTRACTS.CERTIFICATE_STAKING,
        CertificateStakingABI,
        signer
      )

      const isPaused = await certStaking.paused()
      if (isPaused) {
        onStatusChange({ status: 'error', error: TransactionError.CONTRACT_PAUSED })
        return false
      }

      const parsedAmount = ethers.parseUnits(amount, 18)

      // Check balance
      const balance = await usdgb.balanceOf(userAddress)
      if (balance < parsedAmount) {
        onStatusChange({
          status: 'error',
          error: TransactionError.INSUFFICIENT_FUNDS,
        })
        return false
      }

      onStatusChange({ status: 'waiting_approval' })

      // Approve
      const approveTx = await usdgb.approve(CONTRACTS.CERTIFICATE_STAKING, parsedAmount)
      await approveTx.wait()

      // Stake
      const stakeTx = await certStaking.stakeForCertificate(parsedAmount)

      onStatusChange({
        status: 'pending',
        hash: stakeTx.hash,
      })

      const receipt = await stakeTx.wait()

      onStatusChange({
        status: 'success',
        hash: stakeTx.hash,
        receipt,
      })

      return true
    } catch (error: any) {
      onStatusChange({
        status: 'error',
        error: this.parseTransactionError(error),
      })
      return false
    }
  }

  /**
   * Claim LP staking rewards from LpRewardPool
   */
  async claimRewards(
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })

      const { signer } = await this.getProviderAndSigner()
      const lpRewardPool = new ethers.Contract(
        CONTRACTS.LP_REWARD_POOL,
        LpRewardPoolABI,
        signer
      )

      onStatusChange({ status: 'waiting_approval' })

      const tx = await lpRewardPool.claimReward()

      onStatusChange({ status: 'pending', hash: tx.hash })

      const receipt = await tx.wait()

      onStatusChange({
        status: 'success',
        hash: tx.hash,
        receipt,
      })

      return true
    } catch (error: any) {
      onStatusChange({
        status: 'error',
        error: this.parseTransactionError(error),
      })
      return false
    }
  }

  /**
   * Claim pending rewards (accumulated when pool was empty)
   */
  async claimPendingReward(
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })

      const { signer } = await this.getProviderAndSigner()
      const lpRewardPool = new ethers.Contract(
        CONTRACTS.LP_REWARD_POOL,
        LpRewardPoolABI,
        signer
      )

      onStatusChange({ status: 'waiting_approval' })

      const tx = await lpRewardPool.claimPendingReward()

      onStatusChange({ status: 'pending', hash: tx.hash })

      const receipt = await tx.wait()

      onStatusChange({
        status: 'success',
        hash: tx.hash,
        receipt,
      })

      return true
    } catch (error: any) {
      onStatusChange({
        status: 'error',
        error: this.parseTransactionError(error),
      })
      return false
    }
  }

  /**
   * Withdraw LP tokens from LpRewardPool
   */
  async withdrawLpStake(
    amount: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })

      const { signer } = await this.getProviderAndSigner()
      const lpRewardPool = new ethers.Contract(
        CONTRACTS.LP_REWARD_POOL,
        LpRewardPoolABI,
        signer
      )

      const parsedAmount = ethers.parseUnits(amount, 18)

      onStatusChange({ status: 'waiting_approval' })

      const tx = await lpRewardPool.withdraw(parsedAmount)

      onStatusChange({ status: 'pending', hash: tx.hash })

      const receipt = await tx.wait()

      onStatusChange({
        status: 'success',
        hash: tx.hash,
        receipt,
      })

      return true
    } catch (error: any) {
      onStatusChange({
        status: 'error',
        error: this.parseTransactionError(error),
      })
      return false
    }
  }

  /**
   * Withdraw from CertificateStaking (only after 365-day lockup)
   */
  async withdrawCertificate(
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })

      const { signer } = await this.getProviderAndSigner()
      const certStaking = new ethers.Contract(
        CONTRACTS.CERTIFICATE_STAKING,
        CertificateStakingABI,
        signer
      )

      onStatusChange({ status: 'waiting_approval' })

      const tx = await certStaking.withdraw()

      onStatusChange({ status: 'pending', hash: tx.hash })

      const receipt = await tx.wait()

      onStatusChange({
        status: 'success',
        hash: tx.hash,
        receipt,
      })

      return true
    } catch (error: any) {
      onStatusChange({
        status: 'error',
        error: this.parseTransactionError(error),
      })
      return false
    }
  }

  /**
   * Get USDGB token balance for a user
   */
  async getUSDGBBalance(userAddress: string): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORK.RPC_URL)
      const usdgb = new ethers.Contract(CONTRACTS.USDGB_TOKEN, USDGBTokenABI, provider)
      const balance = await usdgb.balanceOf(userAddress)
      return ethers.formatUnits(balance, 18)
    } catch (error) {
      console.error('Failed to get USDGB balance:', error)
      return '0'
    }
  }

  /**
   * Get user's LP staking data
   */
  async getLpStakeData(userAddress: string): Promise<{
    lpAmount: string
    startTime: number
    lastClaimTime: number
    pendingReward: string
    calculatedReward: string
  }> {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORK.RPC_URL)
      const lpRewardPool = new ethers.Contract(
        CONTRACTS.LP_REWARD_POOL,
        LpRewardPoolABI,
        provider
      )

      const [stakeData, reward] = await Promise.all([
        lpRewardPool.userStakes(userAddress),
        lpRewardPool.calculateReward(userAddress),
      ])

      return {
        lpAmount: ethers.formatUnits(stakeData.lpAmount, 18),
        startTime: Number(stakeData.startTime),
        lastClaimTime: Number(stakeData.lastClaimTime),
        pendingReward: ethers.formatUnits(stakeData.pendingClaimReward, 18),
        calculatedReward: ethers.formatUnits(reward, 18),
      }
    } catch (error) {
      console.error('Failed to get LP stake data:', error)
      return {
        lpAmount: '0',
        startTime: 0,
        lastClaimTime: 0,
        pendingReward: '0',
        calculatedReward: '0',
      }
    }
  }

  /**
   * Get user's certificate staking data
   */
  async getCertificateStakeData(userAddress: string): Promise<{
    amount: string
    unlockTime: number
    isLocked: boolean
    isEligible: boolean
    leverageValue: string
  }> {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORK.RPC_URL)
      const certStaking = new ethers.Contract(
        CONTRACTS.CERTIFICATE_STAKING,
        CertificateStakingABI,
        provider
      )

      const [stakeData, leverage] = await Promise.all([
        certStaking.userStakes(userAddress),
        certStaking.getLeverageEligibility(userAddress),
      ])

      const now = Math.floor(Date.now() / 1000)
      return {
        amount: ethers.formatUnits(stakeData.amount, 18),
        unlockTime: Number(stakeData.unlockTime),
        isLocked: Number(stakeData.unlockTime) > now,
        isEligible: leverage.isEligible,
        leverageValue: ethers.formatUnits(leverage.leverageValue, 18),
      }
    } catch (error) {
      console.error('Failed to get certificate stake data:', error)
      return {
        amount: '0',
        unlockTime: 0,
        isLocked: false,
        isEligible: false,
        leverageValue: '0',
      }
    }
  }

  /**
   * Get current APR tier from LpRewardPool
   */
  async getCurrentAPR(): Promise<number> {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORK.RPC_URL)
      const lpRewardPool = new ethers.Contract(
        CONTRACTS.LP_REWARD_POOL,
        LpRewardPoolABI,
        provider
      )

      const launchTime = await lpRewardPool.LAUNCH_TIME()
      const now = Math.floor(Date.now() / 1000)
      const monthsSinceLaunch = Math.floor((now - Number(launchTime)) / (30 * 24 * 60 * 60))
      const tierIndex = Math.min(monthsSinceLaunch, 3)

      const apr = await lpRewardPool.aprTiers(tierIndex)
      return Number(apr)
    } catch (error) {
      console.error('Failed to get current APR:', error)
      return 0
    }
  }

  /**
   * Parse transaction errors for user-friendly messages
   */
  /**
   * Uniswap V4 CCA Launch Methods
   */

  async approveUSDGBForPermit2(
    amount: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })
      const { signer } = await this.getProviderAndSigner()
      const usdgb = new ethers.Contract(CONTRACTS.USDGB_TOKEN, USDGBTokenABI, signer)

      const parsedAmount = ethers.parseUnits(amount, 18)
      onStatusChange({ status: 'waiting_approval' })

      const tx = await usdgb.approve(UNISWAP_V4.PERMIT2, parsedAmount)
      onStatusChange({ status: 'pending', hash: tx.hash })
      await tx.wait()
      onStatusChange({ status: 'success', hash: tx.hash })
      return true
    } catch (error: any) {
      onStatusChange({ status: 'error', error: this.parseTransactionError(error) })
      return false
    }
  }

  async approveLiquidityLauncherViaPermit2(
    amount: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })
      const { signer } = await this.getProviderAndSigner()
      const permit2 = new ethers.Contract(UNISWAP_V4.PERMIT2, Permit2ABI, signer)

      const parsedAmount = ethers.parseUnits(amount, 18)
      // Expiration: 30 days from now
      const expiration = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)

      onStatusChange({ status: 'waiting_approval' })
      const tx = await permit2.approve(CONTRACTS.USDGB_TOKEN, UNISWAP_V4.LIQUIDITY_LAUNCHER, parsedAmount, expiration)

      onStatusChange({ status: 'pending', hash: tx.hash })
      await tx.wait()
      onStatusChange({ status: 'success', hash: tx.hash })
      return true
    } catch (error: any) {
      onStatusChange({ status: 'error', error: this.parseTransactionError(error) })
      return false
    }
  }

  async distributeCCA(
    strategy: string,
    parameters: string, // hex bytes
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })
      const { signer } = await this.getProviderAndSigner()
      const launcher = new ethers.Contract(UNISWAP_V4.LIQUIDITY_LAUNCHER, LiquidityLauncherABI, signer)

      onStatusChange({ status: 'waiting_approval' })
      const tx = await launcher.distributeToken(strategy, parameters)

      onStatusChange({ status: 'pending', hash: tx.hash })
      await tx.wait()
      onStatusChange({ status: 'success', hash: tx.hash })
      return true
    } catch (error: any) {
      onStatusChange({ status: 'error', error: this.parseTransactionError(error) })
      return false
    }
  }

  async migrateLBP(
    strategy: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })
      const { signer } = await this.getProviderAndSigner()
      const lbp = new ethers.Contract(strategy, LBPStrategyABI, signer)

      onStatusChange({ status: 'waiting_approval' })
      const tx = await lbp.migrate()

      onStatusChange({ status: 'pending', hash: tx.hash })
      await tx.wait()
      onStatusChange({ status: 'success', hash: tx.hash })
      return true
    } catch (error: any) {
      onStatusChange({ status: 'error', error: this.parseTransactionError(error) })
      return false
    }
  }

  private parseTransactionError(error: any): string {
    const errorMessage = error?.message || error?.toString() || ''

    if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected') || errorMessage.includes('ACTION_REJECTED')) {
      return TransactionError.USER_REJECTED
    }

    if (errorMessage.includes('insufficient funds') || errorMessage.includes('INSUFFICIENT_FUNDS')) {
      return TransactionError.INSUFFICIENT_FUNDS
    }

    if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('NETWORK_ERROR')) {
      return TransactionError.NETWORK_ERROR
    }

    if (errorMessage.includes('Pausable: paused') || errorMessage.includes('EnforcedPause')) {
      return TransactionError.CONTRACT_PAUSED
    }

    if (errorMessage.includes('revert') || errorMessage.includes('execution reverted')) {
      // Try to extract the revert reason
      const revertMatch = errorMessage.match(/reason="([^"]+)"/)
      if (revertMatch) {
        return `Contract error: ${revertMatch[1]}`
      }
      return TransactionError.CONTRACT_ERROR
    }

    if (errorMessage.includes('Max supply exceeded')) {
      return 'Maximum USDGB supply has been reached'
    }

    if (errorMessage.includes('Exceeds Hard Limit')) {
      return 'Amount exceeds the maximum minting limit'
    }

    if (errorMessage.includes('Stake is locked')) {
      return 'Your certificate stake is still locked. Check your unlock date.'
    }

    if (errorMessage.includes('Already staking')) {
      return 'You already have an active certificate stake'
    }

    return TransactionError.UNKNOWN_ERROR
  }

  /**
   * Get transaction explorer URL
   */
  getTransactionUrl(hash: string): string {
    return getExplorerTxUrl(hash)
  }
}

export default TransactionService
