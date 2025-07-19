import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Users,
  Zap,
  RefreshCw,
  Settings,
  Bell,
  Shield,
  Target,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface LenderPortfolio {
  totalLoansActive: number
  totalValueLent: string
  totalInterestEarned: string
  totalTechnologyFeesPaid: string
  averageLTV: number
  riskScore: number
  lenderInfo: {
    entityName: string
    tierLevel: number
    maxLendingCapacity: string
    currentUtilization: string
  }
  utilizationRate: string
  monthlyInterestIncome: string
  annualizedReturn: string
  activeLoans: number
  loansAtRisk: number
}

interface RiskAnalytics {
  portfolioRiskScore: number
  ltvDistribution: {
    low_risk: number
    medium_risk: number
    high_risk: number
  }
  collateralVolatility: {
    daily: string
    weekly: string
    monthly: string
  }
  liquidationRisk: {
    immediate: number
    within_24h: number
    within_week: number
  }
}

const LenderDashboardPage = () => {
  const [portfolio, setPortfolio] = useState<LenderPortfolio | null>(null)
  const [riskAnalytics, setRiskAnalytics] = useState<RiskAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock lender ID for demo
  const lenderId = 1

  useEffect(() => {
    fetchPortfolioData()
    fetchRiskAnalytics()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/lenders/${lenderId}/portfolio`)
      const data = await response.json()
      setPortfolio(data.data)
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    }
  }

  const fetchRiskAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/lenders/${lenderId}/risk-analytics`)
      const data = await response.json()
      setRiskAnalytics(data.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching risk analytics:', error)
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    setIsLoading(true)
    fetchPortfolioData()
    fetchRiskAnalytics()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  const getRiskColor = (score: number) => {
    if (score <= 300) return 'text-green-400'
    if (score <= 600) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskBadgeColor = (score: number) => {
    if (score <= 300) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (score <= 600) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Institutional Lender Dashboard
              </h1>
              <p className="text-gray-300">
                {portfolio?.lenderInfo.entityName || 'Loading...'} • Tier {portfolio?.lenderInfo.tierLevel || 0} • Premium Access
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={refreshData}
                variant="outline"
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 hover:from-amber-400 hover:to-yellow-500">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-amber-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Portfolio Overview
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Risk Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Performance
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Portfolio Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {portfolio ? `$${(parseFloat(portfolio.totalValueLent) / 1e18).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : 'Loading...'}
                    </div>
                    <p className="text-xs text-gray-400">
                      Utilization: {portfolio?.utilizationRate || '0%'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Active Loans</CardTitle>
                    <Users className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{portfolio?.activeLoans || 0}</div>
                    <p className="text-xs text-gray-400">
                      {portfolio?.loansAtRisk || 0} at risk
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Annualized Return</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{portfolio?.annualizedReturn || '0%'}</div>
                    <p className="text-xs text-gray-400">
                      Monthly: {portfolio?.monthlyInterestIncome || '$0'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Risk Score</CardTitle>
                    <Shield className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getRiskColor(portfolio?.riskScore || 1000)}`}>
                      {portfolio?.riskScore || 1000}
                    </div>
                    <Badge className={getRiskBadgeColor(portfolio?.riskScore || 1000)}>
                      {(portfolio?.riskScore || 1000) <= 300 ? 'Low Risk' : 
                       (portfolio?.riskScore || 1000) <= 600 ? 'Medium Risk' : 'High Risk'}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Portfolio Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-amber-400" />
                    Portfolio Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Low Risk Loans</span>
                      <span className="text-green-400">{riskAnalytics?.ltvDistribution.low_risk || 0}</span>
                    </div>
                    <Progress value={(riskAnalytics?.ltvDistribution.low_risk || 0) * 20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Medium Risk Loans</span>
                      <span className="text-yellow-400">{riskAnalytics?.ltvDistribution.medium_risk || 0}</span>
                    </div>
                    <Progress value={(riskAnalytics?.ltvDistribution.medium_risk || 0) * 20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">High Risk Loans</span>
                      <span className="text-red-400">{riskAnalytics?.ltvDistribution.high_risk || 0}</span>
                    </div>
                    <Progress value={(riskAnalytics?.ltvDistribution.high_risk || 0) * 20} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-400" />
                    Liquidation Risk Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        {riskAnalytics?.liquidationRisk.immediate || 0}
                      </div>
                      <div className="text-xs text-gray-400">Immediate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {riskAnalytics?.liquidationRisk.within_24h || 0}
                      </div>
                      <div className="text-xs text-gray-400">24 Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {riskAnalytics?.liquidationRisk.within_week || 0}
                      </div>
                      <div className="text-xs text-gray-400">1 Week</div>
                    </div>
                  </div>
                  {(riskAnalytics?.liquidationRisk.immediate || 0) > 0 && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-red-400 text-sm font-medium">
                          Critical: {riskAnalytics?.liquidationRisk.immediate} loans require immediate attention
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Collateral Volatility</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gold price movement impact on portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {riskAnalytics?.collateralVolatility.daily || '0%'}
                      </div>
                      <div className="text-xs text-gray-400">Daily</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {riskAnalytics?.collateralVolatility.weekly || '0%'}
                      </div>
                      <div className="text-xs text-gray-400">Weekly</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {riskAnalytics?.collateralVolatility.monthly || '0%'}
                      </div>
                      <div className="text-xs text-gray-400">Monthly</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Health Score</CardTitle>
                  <CardDescription className="text-gray-400">
                    Overall risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getRiskColor(riskAnalytics?.portfolioRiskScore || 1000)}`}>
                      {riskAnalytics?.portfolioRiskScore || 1000}
                    </div>
                    <Progress 
                      value={Math.min((1000 - (riskAnalytics?.portfolioRiskScore || 1000)) / 10, 100)} 
                      className="h-3 mb-2" 
                    />
                    <Badge className={getRiskBadgeColor(riskAnalytics?.portfolioRiskScore || 1000)}>
                      {(riskAnalytics?.portfolioRiskScore || 1000) <= 300 ? 'Excellent' : 
                       (riskAnalytics?.portfolioRiskScore || 1000) <= 600 ? 'Good' : 'Needs Attention'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    +8.7%
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                    vs last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Technology Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    ${(parseFloat(portfolio?.totalTechnologyFeesPaid || '0') / 1e18).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>Tier {portfolio?.lenderInfo.tierLevel} Rate</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Average LTV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {((portfolio?.averageLTV || 0) / 100).toFixed(1)}%
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>Portfolio weighted</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/60 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white">Lending Parameters</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your institutional lending preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Maximum Lending Capacity</label>
                    <div className="text-lg text-white">
                      ${(parseFloat(portfolio?.lenderInfo.maxLendingCapacity || '0') / 1e18).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Current Tier Level</label>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      Tier {portfolio?.lenderInfo.tierLevel || 1} - Premium
                    </Badge>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 hover:from-amber-400 hover:to-yellow-500">
                  Update Parameters
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default LenderDashboardPage