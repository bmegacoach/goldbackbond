/**
 * Real-time Gold Price Service
 * Provides live gold price data from multiple sources with fallback
 */

interface GoldPriceData {
  price: number
  currency: string
  timestamp: string
  change24h?: number
  source: string
}

interface GoldPriceResponse {
  name: string
  price: number
  symbol: string
  updatedAt: string
  updatedAtReadable: string
}

class GoldPriceService {
  private static instance: GoldPriceService
  private cache: GoldPriceData | null = null
  private cacheTimestamp: number = 0
  private previousPrice: number | null = null
  private readonly CACHE_DURATION = 30000 // 30 seconds
  private readonly PRIMARY_API = 'https://api.gold-api.com/price/XAU'
  private readonly FALLBACK_API = 'https://api.metals.live/v1/spot/gold'

  private constructor() { }

  static getInstance(): GoldPriceService {
    if (!GoldPriceService.instance) {
      GoldPriceService.instance = new GoldPriceService()
    }
    return GoldPriceService.instance
  }

  /**
   * Get current live gold price with caching
   */
  async getCurrentPrice(): Promise<GoldPriceData> {
    const now = Date.now()

    // Return cached data if still valid
    if (this.cache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      // Try primary API first
      const priceData = await this.fetchFromPrimaryAPI()

      // Track previous price for change calculation
      if (this.cache) {
        this.previousPrice = this.cache.price
      }

      // Cache the result
      this.cache = priceData
      this.cacheTimestamp = now

      console.log(`GoldPriceService: Updated price to $${priceData.price}/oz from ${priceData.source}`)
      return priceData

    } catch (primaryError) {
      console.warn('GoldPriceService: Primary API failed, trying fallback...', primaryError)

      try {
        // Try fallback API
        const fallbackData = await this.fetchFromFallbackAPI()

        if (this.cache) {
          this.previousPrice = this.cache.price
        }

        this.cache = fallbackData
        this.cacheTimestamp = now

        console.log(`GoldPriceService: Updated price to $${fallbackData.price}/oz from ${fallbackData.source}`)
        return fallbackData

      } catch (fallbackError) {
        console.error('GoldPriceService: Both APIs failed:', fallbackError)

        // If we have cached data, return it even if expired
        if (this.cache) {
          console.warn('GoldPriceService: Using cached data due to API errors')
          return this.cache
        }

        // Last resort: return static fallback price
        return this.getStaticFallbackPrice()
      }
    }
  }

  /**
   * Fetch from primary gold price API (gold-api.com)
   */
  private async fetchFromPrimaryAPI(): Promise<GoldPriceData> {
    const response = await fetch(this.PRIMARY_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`Primary API request failed: ${response.status} ${response.statusText}`)
    }

    const data: GoldPriceResponse = await response.json()

    return {
      price: data.price,
      currency: 'USD',
      timestamp: data.updatedAt,
      source: 'gold-api.com'
    }
  }

  /**
   * Fetch from fallback API (metals.live)
   */
  private async fetchFromFallbackAPI(): Promise<GoldPriceData> {
    const response = await fetch(this.FALLBACK_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      throw new Error(`Fallback API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // metals.live returns an array: [{ price: number, ... }]
    const goldData = Array.isArray(data) ? data[0] : data

    return {
      price: goldData.price,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      source: 'metals.live'
    }
  }

  /**
   * Static fallback price when all APIs fail and no cache exists.
   * Updated periodically to reflect approximate market price.
   */
  private getStaticFallbackPrice(): GoldPriceData {
    // Last known good price — update this periodically
    const LAST_KNOWN_PRICE = 5063.20

    return {
      price: LAST_KNOWN_PRICE,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      source: 'static-fallback'
    }
  }

  /**
   * Calculate live market cap based on current gold price
   */
  calculateLiveMarketCap(goldPricePerOz: number): number {
    const ozPerMetricTonne = 32150.7 // Exactly 32,150.7 oz/MT
    const totalKilograms = 10800000 // Correct value: 10.8M kg
    const totalMetricTonnes = totalKilograms / 1000 // Convert to MT
    const totalOunces = totalMetricTonnes * ozPerMetricTonne
    const totalValue = totalOunces * goldPricePerOz
    return totalValue
  }

  /**
   * Get price change based on tracked previous price
   */
  calculatePriceChange(currentPrice: number): { change: number; percentage: string } {
    if (this.previousPrice && this.previousPrice > 0) {
      const change = currentPrice - this.previousPrice
      const pct = ((change / this.previousPrice) * 100).toFixed(2)
      return {
        change,
        percentage: `${change >= 0 ? '+' : ''}${pct}%`
      }
    }

    // No previous price data available yet
    return {
      change: 0,
      percentage: '0.00%'
    }
  }

  /**
   * Subscribe to price updates with callback
   */
  subscribeToPriceUpdates(callback: (price: GoldPriceData) => void, intervalMs: number = 30000) {
    const updatePrice = async () => {
      try {
        const priceData = await this.getCurrentPrice()
        callback(priceData)
      } catch (error) {
        console.error('GoldPriceService: Error in price update subscription:', error)
      }
    }

    // Initial update
    updatePrice()

    // Set up interval
    const intervalId = setInterval(updatePrice, intervalMs)

    // Return cleanup function
    return () => clearInterval(intervalId)
  }
}

export default GoldPriceService
export type { GoldPriceData }