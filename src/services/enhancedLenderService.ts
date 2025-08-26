/**
 * Enhanced Lender Service
 * Connects frontend to backend enhanced lender APIs
 */

const API_BASE_URL = 'https://goldbackbond-backend-production.up.railway.app'

export interface LenderProfile {
  lenderId: number
  entityName: string
  tierLevel: number
  riskScore: number
  totalLoansActive: number
  totalValueLent: string
  utilizationRate: string
  annualizedReturn: string
  portfolioRiskScore: number
  lenderAddress: string
  licenseNumber: string
  jurisdiction: string
  complianceFramework: string
  maxLendingCapacity: string
  currentUtilization: string
  kycStatus: string
  regulatoryApproval: boolean
  multiSigEnabled: boolean
}

export interface PortfolioMetrics {
  totalLoansActive: number
  totalValueLent: string
  totalInterestEarned: string
  totalTechnologyFeesPaid: string
  averageLTV: number
  portfolioRiskScore: number
  utilizationRate: string
  annualizedReturn: string
  liquidationsCount: number
  totalUSDGBCollateral: string
  performanceMetrics: {
    averageROI: number
    defaultRate: number
    liquidationRate: number
    avgLoanSize: string
  }
  riskDistribution: {
    lowRisk: number
    mediumRisk: number
    highRisk: number
  }
}

export interface RiskAnalytics {
  portfolioRiskScore: number
  riskGrade: string
  ltvDistribution: {
    low_risk: number
    medium_risk: number
    high_risk: number
  }
  liquidationRisk: {
    immediate: number
    within_24h: number
    within_week: number
  }
  concentrationMetrics: {
    maxBorrowerExposure: string
    concentrationRatio: string
    uniqueBorrowers: number
    avgLoanSize: number
  }
  performanceIndicators: {
    healthyLoansPercentage: string
    avgHealthFactor: number
    autoLiquidationEnabled: number
  }
}

export interface EnhancedLoan {
  loanId: number
  borrower: string
  loanAmount: string
  collateralAmount: string
  currentLTV: number
  status: string
  interestRate: number
  healthScore: string
  daysRemaining: number
  estimatedRewards: string
  missedPayments: number
  nextPaymentDue: number
  totalInterestAccrued: string
  autoLiquidationEnabled: boolean
}

export interface LenderConfiguration {
  lenderId: number
  lateFeeSettings: {
    feePercentage: number
    gracePeriodDays: number
    maxFeeAmount: string
  }
  interestRateSettings: {
    baseRate: number
    riskMultiplier: number
    maxRate: number
    minRate: number
  }
  promotionalSettings: {
    enabled: boolean
    discountRate: number
    validUntil: string
    applicableLoans: string[]
  }
  paymentPlanSettings: {
    enabled: boolean
    maxExtensionPeriod: number
    restructuringFee: number
  }
  profileSettings: {
    notificationPreferences: string[]
    autoLiquidationEnabled: boolean
    riskToleranceLevel: string
  }
  systemSettings: {
    suggestionCategories: string[]
    feedbackEnabled: boolean
    bugReportingEnabled: boolean
  }
}

class EnhancedLenderService {
  private static instance: EnhancedLenderService

  private constructor() {}

  public static getInstance(): EnhancedLenderService {
    if (!EnhancedLenderService.instance) {
      EnhancedLenderService.instance = new EnhancedLenderService()
    }
    return EnhancedLenderService.instance
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      // Throw error instead of returning mock data to ensure authentic information
      throw new Error(`Failed to connect to backend service. Please try again later.`)
    }
  }

  // Mock data method removed to prevent displaying non-authentic information
  // All service methods now properly handle errors and display appropriate messages
  // rather than potentially misleading mock data

  async getLenderProfile(lenderId: number): Promise<LenderProfile> {
    const response = await this.makeRequest(`/api/enhanced-lenders/${lenderId}`)
    return response.data
  }

  async getPortfolioMetrics(lenderId: number): Promise<PortfolioMetrics> {
    const response = await this.makeRequest(`/api/enhanced-lenders/${lenderId}/portfolio`)
    return response.data
  }

  async getRiskAnalytics(lenderId: number): Promise<RiskAnalytics> {
    const response = await this.makeRequest(`/api/enhanced-lenders/${lenderId}/risk-analytics`)
    return response.data
  }

  async getActiveLoans(lenderId: number): Promise<EnhancedLoan[]> {
    const response = await this.makeRequest(`/api/enhanced-lenders/${lenderId}/loans`)
    return response.data
  }

  async getLenderConfiguration(lenderId: number): Promise<LenderConfiguration> {
    const response = await this.makeRequest(`/api/enhanced-lenders/${lenderId}/configuration`)
    return response.data
  }

  async updateLenderConfiguration(lenderId: number, config: Partial<LenderConfiguration>): Promise<void> {
    await this.makeRequest(`/api/enhanced-lenders/${lenderId}/configuration`, {
      method: 'PUT',
      body: JSON.stringify(config)
    })
  }

  async updateLateFeeSettings(lenderId: number, settings: any): Promise<void> {
    await this.makeRequest(`/api/enhanced-lenders/${lenderId}/late-fee-settings`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  }

  async updateInterestRates(lenderId: number, rates: any): Promise<void> {
    await this.makeRequest(`/api/enhanced-lenders/${lenderId}/interest-rates`, {
      method: 'PUT',
      body: JSON.stringify(rates)
    })
  }

  async createPromotion(lenderId: number, promotion: any): Promise<void> {
    await this.makeRequest(`/api/enhanced-lenders/${lenderId}/promotions`, {
      method: 'POST',
      body: JSON.stringify(promotion)
    })
  }

  async updatePaymentPlans(lenderId: number, plans: any): Promise<void> {
    await this.makeRequest(`/api/enhanced-lenders/${lenderId}/payment-plans`, {
      method: 'PUT',
      body: JSON.stringify(plans)
    })
  }

  async updateLenderProfile(lenderId: number, profile: any): Promise<void> {
    await this.makeRequest(`/api/enhanced-lenders/${lenderId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile)
    })
  }

  async submitSystemSuggestion(lenderId: number, suggestion: any): Promise<void> {
    await this.makeRequest(`/api/enhanced-lenders/${lenderId}/suggestions`, {
      method: 'POST',
      body: JSON.stringify(suggestion)
    })
  }
}

export default EnhancedLenderService
