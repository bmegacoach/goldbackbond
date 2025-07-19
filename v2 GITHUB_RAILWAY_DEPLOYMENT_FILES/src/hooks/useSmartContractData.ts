/**
 * useSmartContractData Hook
 * Custom React hook for accessing smart contract data and wallet information
 */

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import SmartContractDataService, { 
  SmartContractMetrics, 
  UserWalletData 
} from '../services/smartContractDataService'

interface UseSmartContractDataReturn {
  // Smart contract metrics
  metrics: SmartContractMetrics | null
  
  // User wallet data
  walletData: UserWalletData | null
  
  // Loading states
  isLoadingMetrics: boolean
  isLoadingWallet: boolean
  
  // Error states
  metricsError: string | null
  walletError: string | null
  
  // Refresh functions
  refreshMetrics: () => Promise<void>
  refreshWalletData: () => Promise<void>
  refreshAll: () => Promise<void>
  
  // Helper functions
  formatCurrency: (value: string, decimals?: number) => string
  formatPercentage: (value: number, decimals?: number) => string
  isWalletConnected: boolean
}

export const useSmartContractData = (): UseSmartContractDataReturn => {
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  
  // State management
  const [metrics, setMetrics] = useState<SmartContractMetrics | null>(null)
  const [walletData, setWalletData] = useState<UserWalletData | null>(null)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)
  
  // Service instance
  const smartContractService = SmartContractDataService.getInstance()

  // Refresh metrics from smart contracts
  const refreshMetrics = useCallback(async () => {
    try {
      setIsLoadingMetrics(true)
      setMetricsError(null)
      
      const newMetrics = await smartContractService.getSmartContractMetrics()
      setMetrics(newMetrics)
    } catch (error) {
      console.error('Failed to refresh metrics:', error)
      setMetricsError(error instanceof Error ? error.message : 'Failed to load metrics')
    } finally {
      setIsLoadingMetrics(false)
    }
  }, [smartContractService])

  // Refresh wallet data
  const refreshWalletData = useCallback(async () => {
    try {
      setIsLoadingWallet(true)
      setWalletError(null)
      
      const userAddress = isConnected && address ? address : ''
      const newWalletData = await smartContractService.getUserWalletData(userAddress)
      setWalletData(newWalletData)
    } catch (error) {
      console.error('Failed to refresh wallet data:', error)
      setWalletError(error instanceof Error ? error.message : 'Failed to load wallet data')
    } finally {
      setIsLoadingWallet(false)
    }
  }, [smartContractService, address, isConnected])

  // Refresh both metrics and wallet data
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshMetrics(), refreshWalletData()])
  }, [refreshMetrics, refreshWalletData])

  // Format currency values
  const formatCurrency = useCallback((value: string, decimals: number = 18): string => {
    try {
      const num = parseFloat(value) / Math.pow(10, decimals)
      
      if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
      if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
      
      return `$${num.toFixed(2)}`
    } catch (error) {
      return '$0.00'
    }
  }, [])

  // Format percentage values
  const formatPercentage = useCallback((value: number, decimals: number = 2): string => {
    return `${value.toFixed(decimals)}%`
  }, [])

  // Initial data load
  useEffect(() => {
    refreshMetrics()
  }, [refreshMetrics])

  // Load wallet data when wallet connection changes
  useEffect(() => {
    refreshWalletData()
  }, [refreshWalletData])

  // Set up real-time updates for metrics
  useEffect(() => {
    const unsubscribe = smartContractService.subscribeToUpdates((newMetrics) => {
      setMetrics(newMetrics)
    })

    // Cleanup function would be returned by subscribeToUpdates in a real implementation
    return () => {
      // unsubscribe()
    }
  }, [smartContractService])

  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll()
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [refreshAll])

  return {
    // Data
    metrics,
    walletData,
    
    // Loading states
    isLoadingMetrics,
    isLoadingWallet,
    
    // Error states
    metricsError,
    walletError,
    
    // Actions
    refreshMetrics,
    refreshWalletData,
    refreshAll,
    
    // Utilities
    formatCurrency,
    formatPercentage,
    isWalletConnected: isConnected
  }
}

// Hook for specific metric access
export const useMetricValue = (metricPath: string) => {
  const { metrics, isLoadingMetrics, formatCurrency } = useSmartContractData()
  
  const getValue = useCallback(() => {
    if (!metrics) return null
    
    // Navigate through nested object path
    const pathArray = metricPath.split('.')
    let value: any = metrics
    
    for (const key of pathArray) {
      value = value?.[key]
      if (value === undefined) return null
    }
    
    return value
  }, [metrics, metricPath])
  
  return {
    value: getValue(),
    isLoading: isLoadingMetrics,
    formatted: getValue() ? formatCurrency(getValue().toString()) : null
  }
}

// Hook for wallet balance display
export const useWalletBalance = () => {
  const { walletData, isLoadingWallet, formatCurrency, isWalletConnected } = useSmartContractData()
  
  return {
    balance: walletData?.usdgbBalance || '0',
    formattedBalance: isWalletConnected 
      ? formatCurrency(walletData?.usdgbBalance || '0')
      : '$0 (connect wallet)',
    stakedAmount: walletData?.stakedAmount || '0',
    formattedStakedAmount: isWalletConnected
      ? formatCurrency(walletData?.stakedAmount || '0')
      : '$0 (connect wallet)',
    totalPortfolioValue: walletData?.totalPortfolioValue || '0',
    formattedPortfolioValue: isWalletConnected
      ? formatCurrency(walletData?.totalPortfolioValue || '0')
      : '$0 (connect wallet)',
    isLoading: isLoadingWallet,
    isConnected: isWalletConnected
  }
}

export default useSmartContractData
