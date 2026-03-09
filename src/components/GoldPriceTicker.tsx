import { motion } from 'framer-motion'
import { TrendingUp, Shield, Activity } from 'lucide-react'
import { useSmartContractData } from '../hooks/useSmartContractData'
import GoldPriceService from '../services/goldPriceService'
import { useState, useEffect } from 'react'

const GoldPriceTicker = () => {
    const { metrics, formatCurrency } = useSmartContractData()
    const [price, setPrice] = useState<number>(0)

    useEffect(() => {
        const fetchPrice = async () => {
            const data = await GoldPriceService.getInstance().getCurrentPrice()
            setPrice(data.price)
        }
        fetchPrice()
        const interval = setInterval(fetchPrice, 60000)
        return () => clearInterval(interval)
    }, [])

    const tickerItems = [
        { label: 'LIVE GOLD', value: `$${price.toLocaleString()}/oz`, icon: TrendingUp, color: 'text-amber-400' },
        { label: 'MARKET CAP', value: metrics?.marketCap ? formatCurrency(metrics.marketCap) : '$250.56B', icon: Activity, color: 'text-green-400' },
        { label: 'SYSTEM STATUS', value: 'OPTIMAL / SECURED', icon: Shield, color: 'text-blue-400' },
        { label: 'BACKING RATIO', value: '300% (GOLD)', icon: TrendingUp, color: 'text-amber-400' },
    ]

    return (
        <div className="w-full bg-slate-900/80 border-b border-amber-500/20 backdrop-blur-md overflow-hidden h-10 flex items-center print:hidden">
            <motion.div
                className="flex whitespace-nowrap gap-12 px-4"
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold tracking-wider">
                        <item.icon className={`h-3 w-3 ${item.color}`} />
                        <span className="text-gray-400 uppercase">{item.label}:</span>
                        <span className="text-white">{item.value}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export default GoldPriceTicker
