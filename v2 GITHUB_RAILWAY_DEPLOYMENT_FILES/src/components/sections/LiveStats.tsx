import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TrendingUp, Coins, Weight } from 'lucide-react'
import GoldPriceService, { GoldPriceData } from '../../services/goldPriceService'
import { useSmartContractData } from '../../hooks/useSmartContractData'

interface LiveStatsProps {
  data?: {
    usd_market_cap: string
    gold_certificates: number
    gold_kilograms: number
  }
}

const LiveStats = ({ data }: LiveStatsProps) => {
  const [liveGoldData, setLiveGoldData] = useState<GoldPriceData | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [updateCounter, setUpdateCounter] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<{ change: number; percentage: string }>({ change: 0, percentage: '0%' })
  const [showChangeIndicator, setShowChangeIndicator] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Use smart contract data hook
  const { metrics, formatCurrency, isLoadingMetrics, refreshMetrics } = useSmartContractData()
  const goldPriceService = GoldPriceService.getInstance()

  useEffect(() => {
    let cleanupSubscription: (() => void) | null = null

    const initializePriceData = async () => {
      try {
        // Get initial price data
        const initialPrice = await goldPriceService.getCurrentPrice()
        setLiveGoldData(initialPrice)
        setLastUpdate(new Date())
        setIsLoading(false)
        
        console.log(`LiveStats: Initialized with live gold price $${initialPrice.price.toFixed(2)}/oz from ${initialPrice.source}`)
        
        // Subscribe to price updates
        cleanupSubscription = goldPriceService.subscribeToPriceUpdates((newPriceData) => {
          const previousPrice = liveGoldData?.price || 0
          const change = goldPriceService.calculatePriceChange(newPriceData.price)
          
          setLiveGoldData(newPriceData)
          setLastUpdate(new Date())
          setUpdateCounter(prev => prev + 1)
          setPriceChange(change)
          
          // Show change indicator briefly
          setShowChangeIndicator(true)
          setTimeout(() => setShowChangeIndicator(false), 3000)
          
          console.log(`LiveStats: Gold price updated to $${newPriceData.price.toFixed(2)}/oz (${change.percentage}) [Update #${updateCounter + 1}] Source: ${newPriceData.source}`)
        }, 30000) // Update every 30 seconds
        
      } catch (error) {
        console.error('LiveStats: Error initializing live gold price:', error)
        setIsLoading(false)
      }
    }

    initializePriceData()

    // Cleanup subscription on unmount
    return () => {
      if (cleanupSubscription) {
        cleanupSubscription()
      }
    }
  }, [])

  // Calculate live market cap based on current gold price and smart contract data
  const liveMarketCap = metrics?.marketCap 
    ? formatCurrency(metrics.marketCap)
    : (liveGoldData ? goldPriceService.calculateLiveMarketCap(liveGoldData.price) : 0)

  const stats = [
    {
      label: 'USD Market Cap',
      value: data?.usd_market_cap || (typeof liveMarketCap === 'string' ? liveMarketCap : `$${liveMarketCap.toLocaleString('en-US', { maximumFractionDigits: 0 })}`),
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-600',
      isLive: false // Removed live indicator from USD Market Cap
    },
    {
      label: 'Gold Certificates',
      value: data?.gold_certificates?.toLocaleString() || metrics?.goldCertificatesLive?.toLocaleString() || '108',
      icon: Coins,
      color: 'from-amber-400 to-yellow-600',
      isLive: false
    },
    {
      label: 'Gold Kilograms',
      value: data?.gold_kilograms?.toLocaleString() || metrics?.goldKilogramsLive?.toLocaleString() || '10,800,000',
      icon: Weight,
      color: 'from-orange-400 to-red-600',
      isLive: true,
      showPriceFeed: true // Live price feed is now only under Gold Kilograms
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 text-center hover:bg-slate-800/80 transition-all duration-300"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
            <p className={`font-bold text-white text-center ${
              stat.label === 'USD Market Cap' 
                ? 'text-lg md:text-xl lg:text-2xl' 
                : 'text-2xl md:text-3xl'
            }`}>{stat.value}</p>
            
            {/* Live Price Feed under Gold Kilograms */}
            {stat.showPriceFeed && liveGoldData && (
              <div className="mt-4 space-y-2">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-amber-400 font-medium">Live Gold Price</span>
                    {showChangeIndicator && (
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        priceChange.change >= 0 
                          ? 'text-green-400 bg-green-400/10' 
                          : 'text-red-400 bg-red-400/10'
                      } animate-pulse`}>
                        {priceChange.change >= 0 ? '↗' : '↘'} {priceChange.percentage}
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-amber-300">
                    ${liveGoldData.price.toFixed(2)}/oz
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Updated: {lastUpdate.toLocaleTimeString()} (#{updateCounter})
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {liveGoldData.source}
                  </div>
                </div>
              </div>
            )}
            
            {/* Standard live indicator for other stats */}
            {stat.isLive && !stat.showPriceFeed ? (
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Live Updates</span>
                  {showChangeIndicator && stat.label === 'USD Market Cap' && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      priceChange.change >= 0 
                        ? 'text-green-400 bg-green-400/10' 
                        : 'text-red-400 bg-red-400/10'
                    } animate-pulse`}>
                      {priceChange.change >= 0 ? '↗' : '↘'} Market Cap Updated
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  Updated: {lastUpdate.toLocaleTimeString()} (#{updateCounter})
                </div>
                {liveGoldData && (
                  <div className="text-xs text-gray-500">
                    Source: {liveGoldData.source}
                  </div>
                )}
              </div>
            ) : !stat.isLive ? (
              <div className="mt-3 flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            ) : null}
            
            {/* Loading state */}
            {isLoading && stat.isLive && (
              <div className="mt-3 text-xs text-gray-400">
                Connecting to live feed...
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default LiveStats