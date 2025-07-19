import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Shield, 
  Users, 
  DollarSign,
  Clock,
  Zap,
  RefreshCw,
  Download,
  Settings,
  Bell,
  Eye,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Cog,
  CreditCard,
  Percent,
  Gift,
  FileText,
  User,
  MessageSquare,
  X
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import EnhancedLenderService, { 
  LenderProfile, 
  PortfolioMetrics, 
  RiskAnalytics, 
  EnhancedLoan 
} from '../../services/enhancedLenderService'



interface ConfigureOptions {
  category: string
  title: string
  description: string
  icon: any
  action: () => void
}

const EnhancedLenderDashboard = () => {
  const [lenderProfile, setLenderProfile] = useState<LenderProfile | null>(null)
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null)
  const [riskAnalytics, setRiskAnalytics] = useState<RiskAnalytics | null>(null)
  const [recentLoans, setRecentLoans] = useState<EnhancedLoan[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')
  const [showConfigureModal, setShowConfigureModal] = useState(false)
  const { toast } = useToast()

  // Mock lender ID - in real app, get from auth context
  const lenderId = 1
  const enhancedLenderService = EnhancedLenderService.getInstance()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all dashboard data concurrently
      await Promise.all([
        loadLenderProfile(),
        loadPortfolioMetrics(),
        loadRiskAnalytics(),
        loadRecentLoans()
      ])
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    }
  }

  const loadLenderProfile = async () => {
    try {
      const profile = await enhancedLenderService.getLenderProfile(lenderId)
      // Set risk score to 0 for illustration as requested
      profile.riskScore = 0
      profile.portfolioRiskScore = 0
      setLenderProfile(profile)
    } catch (error) {
      console.error('Failed to load lender profile:', error)
      toast({
        title: "Error",
        description: "Failed to load lender profile",
        variant: "destructive",
      })
    }
  }

  const loadPortfolioMetrics = async () => {
    try {
      const metrics = await enhancedLenderService.getPortfolioMetrics(lenderId)
      // Set portfolio risk score to 0 for illustration as requested
      metrics.portfolioRiskScore = 0
      setPortfolioMetrics(metrics)
    } catch (error) {
      console.error('Failed to load portfolio metrics:', error)
      toast({
        title: "Error",
        description: "Failed to load portfolio metrics",
        variant: "destructive",
      })
    }
  }

  const loadRiskAnalytics = async () => {
    try {
      const analytics = await enhancedLenderService.getRiskAnalytics(lenderId)
      // Set portfolio risk score to 0 for illustration as requested
      analytics.portfolioRiskScore = 0
      setRiskAnalytics(analytics)
    } catch (error) {
      console.error('Failed to load risk analytics:', error)
      toast({
        title: "Error",
        description: "Failed to load risk analytics",
        variant: "destructive",
      })
    }
  }

  const loadRecentLoans = async () => {
    try {
      const loans = await enhancedLenderService.getActiveLoans(lenderId)
      setRecentLoans(loans)
    } catch (error) {
      console.error('Failed to load recent loans:', error)
      toast({
        title: "Error",
        description: "Failed to load recent loans",
        variant: "destructive",
      })
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Dashboard data updated successfully",
    })
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) / Math.pow(10, 18) // Convert from wei
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const getRiskColor = (score: number) => {
    if (score <= 150) return 'text-green-400'
    if (score <= 250) return 'text-yellow-400'
    if (score <= 350) return 'text-orange-400'
    return 'text-red-400'
  }

  const getRiskColorByMissedPayments = (missedPayments: number) => {
    if (missedPayments === 0) return 'text-green-400' // Low Risk
    if (missedPayments === 1) return 'text-yellow-400' // Medium Risk
    if (missedPayments === 2) return 'text-orange-400' // High Risk
    return 'text-red-400' // Default Status
  }

  const getRiskStatusByMissedPayments = (missedPayments: number) => {
    if (missedPayments === 0) return { status: 'Low Risk', description: 'All payments current' }
    if (missedPayments === 1) return { status: 'Medium Risk', description: '1 missed payment' }
    if (missedPayments === 2) return { status: 'High Risk', description: '2 missed payments' }
    return { status: 'Default Status', description: '30 days to cure all late payments + late fees' }
  }

  const getTierBadge = (tier: number) => {
    const tiers = {
      1: { name: 'Bronze', color: 'bg-orange-600' },
      2: { name: 'Silver', color: 'bg-gray-400' },
      3: { name: 'Gold', color: 'bg-yellow-500' },
      4: { name: 'Platinum', color: 'bg-purple-500' },
      5: { name: 'Diamond', color: 'bg-blue-500' }
    }
    const tierInfo = tiers[tier as keyof typeof tiers] || tiers[1]
    return (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${tierInfo.color}`}>
        {tierInfo.name} Tier {tier}
      </span>
    )
  }

  const getHealthScoreColor = (score: string) => {
    switch (score) {
      case 'EXCELLENT': return 'text-green-400 bg-green-400/10'
      case 'GOOD': return 'text-blue-400 bg-blue-400/10'
      case 'FAIR': return 'text-yellow-400 bg-yellow-400/10'
      case 'POOR': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const configureOptions: ConfigureOptions[] = [
    {
      category: 'Fees & Rates',
      title: 'Late Fee Settings',
      description: 'Customize late fee amounts and schedules',
      icon: CreditCard,
      action: () => {
        toast({
          title: "Late Fee Settings",
          description: "Opening late fee configuration...",
        })
      }
    },
    {
      category: 'Fees & Rates',
      title: 'Interest Rate Management',
      description: 'Adjust rates for different loan types',
      icon: Percent,
      action: () => {
        toast({
          title: "Interest Rate Management",
          description: "Opening rate configuration...",
        })
      }
    },
    {
      category: 'Promotions',
      title: 'Special Promotions',
      description: 'Create custom promotional rates/terms',
      icon: Gift,
      action: () => {
        toast({
          title: "Special Promotions",
          description: "Opening promotions manager...",
        })
      }
    },
    {
      category: 'Recovery',
      title: 'Payment Plans',
      description: 'Delinquent loan recovery payment options',
      icon: FileText,
      action: () => {
        toast({
          title: "Payment Plans",
          description: "Opening payment plan configuration...",
        })
      }
    },
    {
      category: 'Profile',
      title: 'Lender Profile',
      description: 'Update existing lender information and workflow settings',
      icon: User,
      action: () => {
        toast({
          title: "Lender Profile",
          description: "Opening profile settings...",
        })
      }
    },
    {
      category: 'Feedback',
      title: 'System Suggestions',
      description: 'Submit feedback and improvement suggestions to dev team',
      icon: MessageSquare,
      action: () => {
        toast({
          title: "System Suggestions",
          description: "Opening feedback form...",
        })
      }
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Enhanced Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      {/* Header */}
      <div className="border-b border-amber-500/20 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {lenderProfile?.entityName || 'Lender Bank Digital Assets (demo)'}
                </h1>
                <div className="flex items-center space-x-3">
                  {lenderProfile && getTierBadge(lenderProfile.tierLevel)}
                  <span className={`text-sm font-medium ${getRiskColor(lenderProfile?.riskScore || 0)}`}>
                    Risk Score: {lenderProfile?.riskScore || 0} (Low Risk)
                  </span>
                  <span className="text-xs text-gray-400 italic">
                    Based on monthly payment activity
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setShowConfigureModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 flex items-center"
              >
                <Cog className="h-4 w-4 mr-2" />
                Configure
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition-all duration-200 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'portfolio', label: 'Portfolio', icon: PieChart },
              { id: 'risk', label: 'Risk Analytics', icon: Shield },
              { id: 'loans', label: 'Active Loans', icon: Users },
              { id: 'performance', label: 'Performance', icon: LineChart }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Active Loans</p>
                    <p className="text-2xl font-bold text-white">{portfolioMetrics?.totalLoansActive || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+12%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Value Lent</p>
                    <p className="text-2xl font-bold text-white">
                      {portfolioMetrics ? formatCurrency(portfolioMetrics.totalValueLent) : '$0'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+8.5%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Annualized Return</p>
                    <p className="text-2xl font-bold text-white">{portfolioMetrics?.annualizedReturn || '0%'}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+0.3%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Portfolio Risk Score</p>
                    <p className={`text-2xl font-bold ${getRiskColor(portfolioMetrics?.portfolioRiskScore || 0)}`}>
                      {portfolioMetrics?.portfolioRiskScore || 0} <span className="text-sm text-green-400">(Low Risk)</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Based on monthly payment activity</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowDownRight className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">Excellent performance</span>
                  <span className="text-gray-400 ml-1">no missed payments</span>
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Portfolio Performance</h3>
                <div className="flex space-x-2">
                  {['7d', '30d', '90d', '1y'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimeframe(period)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        selectedTimeframe === period
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-slate-700/50 text-gray-400 hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Performance Chart</p>
                  <p className="text-sm opacity-75">Real-time analytics visualization</p>
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
                {portfolioMetrics && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">Low Risk</span>
                      </div>
                      <span className="text-white font-medium">{portfolioMetrics.riskDistribution.lowRisk} loans</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300">Medium Risk</span>
                      </div>
                      <span className="text-white font-medium">{portfolioMetrics.riskDistribution.mediumRisk} loans</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-300">High Risk</span>
                      </div>
                      <span className="text-white font-medium">{portfolioMetrics.riskDistribution.highRisk} loans</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Alerts & Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400">Liquidation Risk Alert</p>
                      <p className="text-xs text-gray-300">1 loan approaching liquidation threshold</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Payment Received</p>
                      <p className="text-xs text-gray-300">Loan #1 monthly payment processed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400">Portfolio Update</p>
                      <p className="text-xs text-gray-300">Risk score improved by 5 points</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Loans Tab */}
        {activeTab === 'loans' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Active Loans</h3>
              <button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-lg font-medium hover:from-amber-400 hover:to-yellow-500 transition-all duration-200">
                View All Loans
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Loan ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Borrower</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">LTV</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Health</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Risk Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Yield</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Days Left</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map((loan) => (
                    <tr key={loan.loanId} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-amber-400 font-mono">#{loan.loanId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-300 font-mono text-sm">{loan.borrower}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-medium">{formatCurrency(loan.loanAmount)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          loan.currentLTV <= 6000 ? 'text-green-400' :
                          loan.currentLTV <= 7500 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {(loan.currentLTV / 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthScoreColor(loan.healthScore)}`}>
                          {loan.healthScore}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColorByMissedPayments(loan.missedPayments)} bg-opacity-10`}>
                            {getRiskStatusByMissedPayments(loan.missedPayments).status}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            {getRiskStatusByMissedPayments(loan.missedPayments).description}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-medium">{loan.estimatedYield}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-300">{loan.daysRemaining}d</span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-amber-400 hover:text-amber-300 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Risk Analytics Tab */}
        {activeTab === 'risk' && riskAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Grade</h3>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getRiskColor(riskAnalytics.portfolioRiskScore)}`}>
                    {riskAnalytics.riskGrade}
                  </div>
                  <p className="text-gray-400 text-sm">Portfolio Risk Grade</p>
                  <p className={`text-sm mt-1 ${getRiskColor(riskAnalytics.portfolioRiskScore)}`}>
                    Score: {riskAnalytics.portfolioRiskScore}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Liquidation Risk</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Immediate</span>
                    <span className={`font-medium ${
                      riskAnalytics.liquidationRisk.immediate > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {riskAnalytics.liquidationRisk.immediate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Within 24h</span>
                    <span className={`font-medium ${
                      riskAnalytics.liquidationRisk.within_24h > 0 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {riskAnalytics.liquidationRisk.within_24h}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Within 1 week</span>
                    <span className="text-gray-300 font-medium">
                      {riskAnalytics.liquidationRisk.within_week}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Concentration Risk</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Max Exposure</span>
                      <span className="text-white font-medium">
                        {formatCurrency(riskAnalytics.concentrationMetrics.maxBorrowerExposure)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Concentration</span>
                      <span className={`font-medium ${
                        parseFloat(riskAnalytics.concentrationMetrics.concentrationRatio) > 20 ? 'text-red-400' :
                        parseFloat(riskAnalytics.concentrationMetrics.concentrationRatio) > 10 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {riskAnalytics.concentrationMetrics.concentrationRatio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {riskAnalytics.performanceIndicators.healthyLoansPercentage}%
                  </div>
                  <p className="text-gray-400 text-sm">Healthy Loans</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {(riskAnalytics.performanceIndicators.avgHealthFactor / 100).toFixed(1)}%
                  </div>
                  <p className="text-gray-400 text-sm">Avg Health Factor</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400 mb-1">
                    {riskAnalytics.performanceIndicators.autoLiquidationEnabled}
                  </div>
                  <p className="text-gray-400 text-sm">Auto-Liquidation Enabled</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Configure Modal */}
      {showConfigureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800 rounded-2xl border border-amber-500/20 p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                  <Cog className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Lender Configuration</h2>
                  <p className="text-gray-400 text-sm">Customize your lending settings and preferences</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigureModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {configureOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
                    onClick={option.action}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-slate-900" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-medium">{option.title}</h3>
                          <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                            {option.category}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{option.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-6 bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400 font-medium text-sm">Risk Assessment Logic</span>
              </div>
              <div className="text-gray-300 text-sm space-y-1">
                <p><span className="text-green-400">• Low Risk:</span> 0 missed payments (All payments current)</p>
                <p><span className="text-yellow-400">• Medium Risk:</span> 1 missed payment (Monitor closely)</p>
                <p><span className="text-orange-400">• High Risk:</span> 2 missed payments (Heightened attention)</p>
                <p><span className="text-red-400">• Default Status:</span> 3+ missed payments (30 days to cure all late payments + late fees)</p>
                <p className="text-gray-400 mt-2 text-xs">After 30 days with notice, collateral can be claimed by lender</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConfigureModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Your configuration has been updated successfully.",
                  })
                  setShowConfigureModal(false)
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-400 hover:to-teal-500 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default EnhancedLenderDashboard