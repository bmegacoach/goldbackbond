/**
 * Transaction Service
 * Handles all smart contract interactions with proper error handling
 */

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
  UNKNOWN_ERROR = 'An unexpected error occurred'
}

class TransactionService {
  private static instance: TransactionService

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService()
    }
    return TransactionService.instance
  }

  /**
   * Purchase USDGB tokens
   */
  async purchaseUSDGB(
    amount: string,
    userAddress: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })
      
      // Simulate transaction process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onStatusChange({ status: 'waiting_approval' })
      
      // Simulate user approval
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockHash = '0x' + Math.random().toString(16).substring(2, 66)
      onStatusChange({ status: 'pending', hash: mockHash })
      
      // Simulate mining time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      onStatusChange({ 
        status: 'success', 
        hash: mockHash, 
        receipt: { status: 'success' }
      })
      
      return true

    } catch (error: any) {
      const errorMessage = this.parseTransactionError(error)
      onStatusChange({ status: 'error', error: errorMessage })
      return false
    }
  }

  /**
   * Join bonus program
   */
  async joinBonusProgram(
    userAddress: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })
      
      // Simulate transaction process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onStatusChange({ status: 'waiting_approval' })
      
      // Simulate user approval
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockHash = '0x' + Math.random().toString(16).substring(2, 66)
      onStatusChange({ status: 'pending', hash: mockHash })
      
      // Simulate mining time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      onStatusChange({ 
        status: 'success', 
        hash: mockHash, 
        receipt: { status: 'success' }
      })
      
      return true

    } catch (error: any) {
      const errorMessage = this.parseTransactionError(error)
      onStatusChange({ status: 'error', error: errorMessage })
      return false
    }
  }

  /**
   * Stake USDGB tokens
   */
  async stakeUSDGB(
    amount: string,
    userAddress: string,
    onStatusChange: (state: TransactionState) => void
  ): Promise<boolean> {
    try {
      onStatusChange({ status: 'preparing' })
      
      // Simulate transaction process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onStatusChange({ status: 'waiting_approval' })
      
      // Simulate user approval
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockHash = '0x' + Math.random().toString(16).substring(2, 66)
      onStatusChange({ status: 'pending', hash: mockHash })
      
      // Simulate mining time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      onStatusChange({ 
        status: 'success', 
        hash: mockHash, 
        receipt: { status: 'success' }
      })
      
      return true

    } catch (error: any) {
      const errorMessage = this.parseTransactionError(error)
      onStatusChange({ status: 'error', error: errorMessage })
      return false
    }
  }

  /**
   * Get USDGB balance for user
   */
  async getUSDGBBalance(userAddress: string): Promise<string> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock balance
      return (Math.random() * 10000).toFixed(2)
    } catch (error) {
      console.error('Failed to fetch balance:', error)
      return '0'
    }
  }

  /**
   * Parse transaction errors for user-friendly messages
   */
  private parseTransactionError(error: any): string {
    const errorMessage = error?.message || error?.toString() || ''
    
    if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
      return TransactionError.USER_REJECTED
    }
    
    if (errorMessage.includes('insufficient funds')) {
      return TransactionError.INSUFFICIENT_FUNDS
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return TransactionError.NETWORK_ERROR
    }
    
    if (errorMessage.includes('revert') || errorMessage.includes('execution reverted')) {
      return TransactionError.CONTRACT_ERROR
    }
    
    return TransactionError.UNKNOWN_ERROR
  }

  /**
   * Get transaction explorer URL
   */
  getTransactionUrl(hash: string): string {
    return `https://basescan.org/tx/${hash}`
  }
}

export default TransactionService
