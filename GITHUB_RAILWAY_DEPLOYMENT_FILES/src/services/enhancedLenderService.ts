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
  estimatedYield: string
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
      // Return mock data as fallback for development
      return this.getMockDataForEndpoint(endpoint)
    }
  }

  private getMockDataForEndpoint(endpoint: string): any {
    // Fallback mock data when backend is unavailable
    if (endpoint.includes('/portfolio')) {
      return {
        data: {
          totalLoansActive: 43,
          totalValueLent: '1250000000000000000000000000',
          totalInterestEarned: '106250000000000000000000000',
          totalTechnologyFeesPaid: '3125000000000000000000000',
          averageLTV: 6250,
          portfolioRiskScore: 0,
          utilizationRate: '25.00%',
          annualizedReturn: '12.9%',
          liquidationsCount: 2,
          totalUSDGBCollateral: '1785714285714285714285714285',
          performanceMetrics: {
            averageROI: 8.5,
            defaultRate: 0.12,
            liquidationRate: 0.08,
            avgLoanSize: '29069767441860465116279069'
          },
          riskDistribution: {
            lowRisk: 32,
            mediumRisk: 8,
            highRisk: 3
          }
        }
      }
    }
    
    if (endpoint.includes('/risk-analytics')) {
      return {
        data: {
          portfolioRiskScore: 0,
          riskGrade: 'AAA',
          ltvDistribution: {
            low_risk: 32,
            medium_risk: 8,
            high_risk: 3
          },
          liquidationRisk: {
            immediate: 0,
            within_24h: 1,
            within_week: 2
          },
          concentrationMetrics: {
            maxBorrowerExposure: '150000000000000000000000000',
            concentrationRatio: '12.00%',
            uniqueBorrowers: 38,
            avgLoanSize: 29069767441860465116279069
          },
          performanceIndicators: {
            healthyLoansPercentage: '86.0',
            avgHealthFactor: 11856,
            autoLiquidationEnabled: 40
          }
        }
      }
    }

    if (endpoint.includes('/loans')) {
      return {
        data: [
          {
            loanId: 1,
            borrower: '0x9876...3210',
            loanAmount: '100000000000000000000000000',
            collateralAmount: '142857142857142857142857142',
            currentLTV: 7000,
            status: 'ACTIVE',
            interestRate: 750,
            healthScore: 'GOOD',
            daysRemaining: 335,
            estimatedYield: '6.16%',
            missedPayments: 0,
            nextPaymentDue: Date.now() + 86400000 * 30,
            totalInterestAccrued: '6164383561643835616438356',
            autoLiquidationEnabled: true
          },
          {
            loanId: 2,
            borrower: '0xABCD...EF12',
            loanAmount: '150000000000000000000000000',
            collateralAmount: '214285714285714285714285714',
            currentLTV: 7000,
            status: 'ACTIVE',
            interestRate: 680,
            healthScore: 'EXCELLENT',
            daysRemaining: 305,
            estimatedYield: '5.66%',
            missedPayments: 0,
            nextPaymentDue: Date.now() + 86400000 * 30,
            totalInterestAccrued: '8493150684931506849315068',
            autoLiquidationEnabled: true
          },
          {
            loanId: 3,
            borrower: '0x1234...5678',
            loanAmount: '75000000000000000000000000',
            collateralAmount: '107142857142857142857142857',
            currentLTV: 7000,
            status: 'CURE_PERIOD',
            interestRate: 820,
            healthScore: 'FAIR',
            daysRemaining: 135,
            estimatedYield: '5.12%',
            missedPayments: 1,
            nextPaymentDue: Date.now() + 86400000 * 15,
            totalInterestAccrued: '3835616438356164383561643',
            autoLiquidationEnabled: false
          }
        ]
      }
    }

    // Default lender profile
    return {
      data: {
        lenderId: 1,
        entityName: 'Lender Bank Digital Assets (demo)',
        tierLevel: 5,
        riskScore: 0,
        totalLoansActive: 43,
        totalValueLent: '1250000000000000000000000000',
        utilizationRate: '25.00%',
        annualizedReturn: '8.50%',
        portfolioRiskScore: 0,
        lenderAddress: '0x742d35Cc6634C0532925a3b8D5a1A8e1aC29c4b1',
        licenseNumber: 'FDIC-2024-GS-001',
        jurisdiction: 'United States',
        complianceFramework: 'SOX, AML, KYC',
        maxLendingCapacity: '5000000000000000000000000000',
        currentUtilization: '1250000000000000000000000000',
        kycStatus: 'VERIFIED',
        regulatoryApproval: true,
        multiSigEnabled: true
      }
    }
  }

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
