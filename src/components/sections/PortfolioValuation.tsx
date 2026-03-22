import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, BarChart3, Clock, ArrowRight, ArrowUpRight } from 'lucide-react'
import GoldPriceService, { GoldPriceData } from '../../services/goldPriceService'

const PortfolioValuation = () => {
  const [liveGoldData, setLiveGoldData] = useState<GoldPriceData | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  
  const goldPriceService = GoldPriceService.getInstance()

  // Constants from specifications
  const TOTAL_BONDS = 108
  const TOTAL_GOLD_KGS = 10800000 // 10.8M kg
  const STATUTORY_VALUE_PER_BOND = 2320000000 // $2.32B per bond (from whitepaper.json)
  const STATUTORY_TOTAL_VALUE = TOTAL_BONDS * STATUTORY_VALUE_PER_BOND // $250.56B

  useEffect(() => {
    let cleanup: (() => void) | null = null

    const init = async () => {
      try {
        const initial = await goldPriceService.getCurrentPrice()
        setLiveGoldData(initial)
        setIsLoading(false)
        
        cleanup = goldPriceService.subscribeToPriceUpdates((price) => {
          setLiveGoldData(price)
          setLastUpdate(new Date())
        }, 30000)
      } catch (err) {
        console.error('PortfolioValuation: Gold price error', err)
        setIsLoading(false)
      }
    }

    init()
    return () => cleanup?.()
  }, [])

  const calculateLiveValue = (price: number) => {
    return goldPriceService.calculateLiveMarketCap(price)
  }

  const formatLargeCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} Trillion`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} Billion`
    return `$${value.toLocaleString()}`
  }

  const liveValue = liveGoldData ? calculateLiveValue(liveGoldData.price) : 0
  const valueDifference = liveValue - STATUTORY_TOTAL_VALUE
  const percentIncrease = ((liveValue / STATUTORY_TOTAL_VALUE) - 1) * 100

  return (
    <div className="mb-12 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statutory Value Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-400 text-sm font-semibold tracking-wider uppercase">Statutory Portfolio Value</span>
            </div>
            <h3 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {formatLargeCurrency(STATUTORY_TOTAL_VALUE)}
            </h3>
            <p className="text-gray-400 text-sm max-w-md">
              Conservative valuation methodology based on Series 1934 Federal Reserve Gold Certificate Bearer Instruments with strip coupons.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs text-gray-500 font-mono">
              <span>{TOTAL_BONDS} BONDS</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span>PAR VALUE: $250.56B</span>
            </div>
          </div>
        </motion.div>

        {/* Live Market Value Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border border-amber-500/30 rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-amber-500/10"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-amber-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Live Market Valuation</span>
              </div>
              {liveGoldData && (
                <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-amber-400 text-[10px] font-bold">LIVE SPOT</span>
                </div>
              )}
            </div>
            
            <h3 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {isLoading ? "Calculating..." : formatLargeCurrency(liveValue)}
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-400 font-bold flex items-center italic">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +{percentIncrease.toFixed(1)}% APPRECIATION
              </span>
              <span className="text-gray-500 text-sm ml-2">from statutory par</span>
            </div>

            <p className="text-gray-300 text-sm max-w-md">
              Real-time portfolio market capitalization based on {TOTAL_GOLD_KGS.toLocaleString()} kg gold backing and current global spot prices.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="bg-black/40 backdrop-blur-sm border border-amber-500/20 rounded-xl px-4 py-3">
                <div className="text-[10px] text-amber-500/60 uppercase font-bold tracking-widest mb-1">Spot Gold Price</div>
                <div className="text-xl font-black text-amber-400">
                  {liveGoldData ? `$${liveGoldData.price.toLocaleString()}/oz` : "---"}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Update: {lastUpdate.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Source: {liveGoldData?.source || "Global Feeds"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparison Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Portfolio Value Differential</div>
            <div className="text-emerald-400 font-bold">
              +{formatLargeCurrency(valueDifference)} Surplus over Statutory Par
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Global Reserve Asset</div>
            <div className="text-white text-sm font-medium">10,800.00 Metric Tonnes Gold Backing</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-700 hidden md:block" />
          <div className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-xs">
            VERIFIED ASSET BACKING
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PortfolioValuation
