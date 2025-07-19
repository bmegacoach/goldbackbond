import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Webhook,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Zap,
  Settings,
  Plus,
  Eye,
  Trash2,
  RefreshCw,
  Download,
  Copy,
  Code,
  Shield,
  Globe,
  Bell,
  TrendingUp,
  BarChart3,
  Filter,
  Search
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'

interface WebhookSubscription {
  subscriptionId: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: string
  lastDeliveryAt?: string
  failureCount: number
  metadata?: any
}

interface WebhookEvent {
  eventId: string
  event: string
  data: any
  timestamp: string
  attempts: number
  delivered: boolean
  lastAttemptAt?: string
}

interface DeliveryStats {
  totalDeliveries: number
  successfulDeliveries: number
  failedDeliveries: number
  successRate: number
  averageResponseTime: number
}

const WebhookMonitoringPortal = () => {
  const [subscriptions, setSubscriptions] = useState<WebhookSubscription[]>([])
  const [recentEvents, setRecentEvents] = useState<WebhookEvent[]>([])
  const [deliveryStats, setDeliveryStats] = useState<DeliveryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSubscription, setSelectedSubscription] = useState<WebhookSubscription | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [eventFilter, setEventFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  // Mock lender ID - in real app, get from auth context
  const lenderId = 1

  useEffect(() => {
    loadWebhookData()
  }, [])

  const loadWebhookData = async () => {
    try {
      setLoading(true)
      
      // Load all webhook data
      await Promise.all([
        loadSubscriptions(),
        loadRecentEvents(),
        loadDeliveryStats()
      ])
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to load webhook data:', error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to load webhook data",
        variant: "destructive",
      })
    }
  }

  const loadSubscriptions = async () => {
    // Mock data - replace with actual API call
    const mockSubscriptions: WebhookSubscription[] = [
      {
        subscriptionId: 'sub_1',
        url: 'https://api.goldmansachs.com/webhooks/goldbackbond',
        events: ['loan.created', 'risk.alert', 'liquidation.executed'],
        isActive: true,
        createdAt: '2025-01-10T10:30:00.000Z',
        lastDeliveryAt: '2025-01-15T14:22:00.000Z',
        failureCount: 0,
        metadata: {
          description: 'Primary webhook for loan management',
          environment: 'production'
        }
      },
      {
        subscriptionId: 'sub_2',
        url: 'https://internal.goldmansachs.com/risk-monitoring',
        events: ['risk.alert', 'portfolio.updated'],
        isActive: true,
        createdAt: '2025-01-08T15:45:00.000Z',
        lastDeliveryAt: '2025-01-15T13:15:00.000Z',
        failureCount: 2,
        metadata: {
          description: 'Risk monitoring system',
          environment: 'production'
        }
      },
      {
        subscriptionId: 'sub_3',
        url: 'https://staging.goldmansachs.com/test-webhooks',
        events: ['test.event'],
        isActive: false,
        createdAt: '2025-01-05T09:20:00.000Z',
        failureCount: 15,
        metadata: {
          description: 'Staging environment testing',
          environment: 'staging'
        }
      }
    ]
    setSubscriptions(mockSubscriptions)
  }

  const loadRecentEvents = async () => {
    // Mock data - replace with actual API call
    const mockEvents: WebhookEvent[] = [
      {
        eventId: 'evt_1',
        event: 'loan.created',
        data: {
          loanId: 456,
          lenderId: 1,
          borrower: '0xABCD...EF12',
          loanAmount: '150000000000000000000000000',
          createdAt: '2025-01-15T14:22:00.000Z'
        },
        timestamp: '2025-01-15T14:22:00.000Z',
        attempts: 1,
        delivered: true,
        lastAttemptAt: '2025-01-15T14:22:01.000Z'
      },
      {
        eventId: 'evt_2',
        event: 'risk.alert',
        data: {
          loanId: 123,
          lenderId: 1,
          currentLTV: 8200,
          threshold: 8000,
          severity: 'HIGH',
          alertTime: '2025-01-15T13:15:00.000Z'
        },
        timestamp: '2025-01-15T13:15:00.000Z',
        attempts: 2,
        delivered: true,
        lastAttemptAt: '2025-01-15T13:15:15.000Z'
      },
      {
        eventId: 'evt_3',
        event: 'portfolio.updated',
        data: {
          lenderId: 1,
          totalLoansActive: 43,
          portfolioRiskScore: 125,
          updatedAt: '2025-01-15T12:00:00.000Z'
        },
        timestamp: '2025-01-15T12:00:00.000Z',
        attempts: 1,
        delivered: true,
        lastAttemptAt: '2025-01-15T12:00:01.000Z'
      },
      {
        eventId: 'evt_4',
        event: 'loan.created',
        data: {
          loanId: 789,
          lenderId: 1,
          borrower: '0x1234...5678',
          loanAmount: '75000000000000000000000000',
          createdAt: '2025-01-15T11:30:00.000Z'
        },
        timestamp: '2025-01-15T11:30:00.000Z',
        attempts: 3,
        delivered: false,
        lastAttemptAt: '2025-01-15T11:35:00.000Z'
      }
    ]
    setRecentEvents(mockEvents)
  }

  const loadDeliveryStats = async () => {
    // Mock data - replace with actual API call
    const mockStats: DeliveryStats = {
      totalDeliveries: 156,
      successfulDeliveries: 148,
      failedDeliveries: 8,
      successRate: 94.87,
      averageResponseTime: 245
    }
    setDeliveryStats(mockStats)
  }

  const createWebhookSubscription = async (subscriptionData: any) => {
    try {
      // Mock API call - replace with actual API endpoint
      const newSubscription: WebhookSubscription = {
        subscriptionId: 'sub_' + Date.now(),
        url: subscriptionData.url,
        events: subscriptionData.events,
        isActive: true,
        createdAt: new Date().toISOString(),
        failureCount: 0,
        metadata: subscriptionData.metadata
      }
      
      setSubscriptions(prev => [...prev, newSubscription])
      setShowCreateModal(false)
      
      toast({
        title: "Success",
        description: "Webhook subscription created successfully",
      })
    } catch (error) {
      console.error('Failed to create webhook subscription:', error)
      toast({
        title: "Error",
        description: "Failed to create webhook subscription",
        variant: "destructive",
      })
    }
  }

  const deleteSubscription = async (subscriptionId: string) => {
    try {
      // Mock API call - replace with actual API endpoint
      setSubscriptions(prev => prev.filter(sub => sub.subscriptionId !== subscriptionId))
      
      toast({
        title: "Success",
        description: "Webhook subscription deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete webhook subscription:', error)
      toast({
        title: "Error",
        description: "Failed to delete webhook subscription",
        variant: "destructive",
      })
    }
  }

  const testWebhook = async (subscriptionId: string) => {
    try {
      // Mock API call - replace with actual API endpoint
      toast({
        title: "Test Event Sent",
        description: "Test webhook event has been sent successfully",
      })
    } catch (error) {
      console.error('Failed to send test webhook:', error)
      toast({
        title: "Error",
        description: "Failed to send test webhook",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (delivered: boolean, attempts: number) => {
    if (delivered) {
      return <CheckCircle className="h-4 w-4 text-green-400" />
    } else if (attempts > 1) {
      return <AlertCircle className="h-4 w-4 text-yellow-400" />
    } else {
      return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getEventTypeColor = (eventType: string) => {
    const colors: { [key: string]: string } = {
      'loan.created': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'risk.alert': 'bg-red-500/20 text-red-400 border-red-500/30',
      'liquidation.executed': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'portfolio.updated': 'bg-green-500/20 text-green-400 border-green-500/30',
      'test.event': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
    return colors[eventType] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const filteredEvents = recentEvents.filter(event => {
    const matchesFilter = eventFilter === 'all' || event.event === eventFilter
    const matchesSearch = searchTerm === '' || 
      event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Webhook Portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-amber-500/20 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Webhook className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Webhook Monitoring Portal</h1>
                <p className="text-gray-400">Real-time event delivery monitoring and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Webhook
              </button>
              <button
                onClick={loadWebhookData}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'subscriptions', label: 'Subscriptions', icon: Settings },
              { id: 'events', label: 'Event Log', icon: Activity },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-white">
                      {subscriptions.filter(sub => sub.isActive).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {deliveryStats?.successRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Events</p>
                    <p className="text-2xl font-bold text-white">{recentEvents.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Response Time</p>
                    <p className="text-2xl font-bold text-white">
                      {deliveryStats?.averageResponseTime}ms
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
                <div className="space-y-3">
                  {recentEvents.slice(0, 5).map((event) => (
                    <div key={event.eventId} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(event.delivered, event.attempts)}
                        <div>
                          <p className="text-white text-sm font-medium">{event.event}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs border ${getEventTypeColor(event.event)}`}>
                        {event.event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Subscription Health</h3>
                <div className="space-y-3">
                  {subscriptions.map((subscription) => (
                    <div key={subscription.subscriptionId} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          subscription.isActive && subscription.failureCount < 5 ? 'bg-green-400' :
                          subscription.isActive && subscription.failureCount < 10 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <div>
                          <p className="text-white text-sm font-medium truncate max-w-48">
                            {subscription.url}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {subscription.events.length} events • {subscription.failureCount} failures
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        subscription.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Webhook Subscriptions</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-lg font-medium hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">URL</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Events</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Failures</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Delivery</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.subscriptionId} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium truncate max-w-xs">{subscription.url}</p>
                          <p className="text-gray-400 text-xs">{subscription.metadata?.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {subscription.events.slice(0, 2).map((event, index) => (
                            <span key={index} className={`px-2 py-1 rounded text-xs border ${getEventTypeColor(event)}`}>
                              {event}
                            </span>
                          ))}
                          {subscription.events.length > 2 && (
                            <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">
                              +{subscription.events.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {subscription.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          subscription.failureCount === 0 ? 'text-green-400' :
                          subscription.failureCount < 5 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {subscription.failureCount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-300 text-sm">
                          {subscription.lastDeliveryAt 
                            ? new Date(subscription.lastDeliveryAt).toLocaleString()
                            : 'Never'
                          }
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => testWebhook(subscription.subscriptionId)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Test webhook"
                          >
                            <Zap className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelectedSubscription(subscription)}
                            className="text-amber-400 hover:text-amber-300 transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSubscription(subscription.subscriptionId)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete subscription"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Events</option>
                    <option value="loan.created">Loan Created</option>
                    <option value="risk.alert">Risk Alert</option>
                    <option value="liquidation.executed">Liquidation</option>
                    <option value="portfolio.updated">Portfolio Updated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <div key={event.eventId} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(event.delivered, event.attempts)}
                        <span className={`px-2 py-1 rounded text-xs border font-medium ${getEventTypeColor(event.event)}`}>
                          {event.event}
                        </span>
                        <span className="text-gray-400 text-sm font-mono">{event.eventId}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Attempts: {event.attempts}</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <details className="cursor-pointer">
                      <summary className="text-amber-400 hover:text-amber-300 transition-colors text-sm">
                        View payload
                      </summary>
                      <div className="mt-3 bg-slate-900/50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">Event Data</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(event.data, null, 2))}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <pre className="text-xs text-gray-300 overflow-x-auto">
                          <code>{JSON.stringify(event.data, null, 2)}</code>
                        </pre>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && deliveryStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Delivery Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Deliveries</span>
                    <span className="text-white font-medium">{deliveryStats.totalDeliveries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Successful</span>
                    <span className="text-green-400 font-medium">{deliveryStats.successfulDeliveries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Failed</span>
                    <span className="text-red-400 font-medium">{deliveryStats.failedDeliveries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Success Rate</span>
                    <span className="text-amber-400 font-medium">{deliveryStats.successRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Avg Response Time</span>
                    <span className="text-white font-medium">{deliveryStats.averageResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Endpoints</span>
                    <span className="text-green-400 font-medium">
                      {subscriptions.filter(sub => sub.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Health Score</span>
                    <span className={`font-medium ${
                      deliveryStats.successRate >= 95 ? 'text-green-400' :
                      deliveryStats.successRate >= 90 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {deliveryStats.successRate >= 95 ? 'Excellent' :
                       deliveryStats.successRate >= 90 ? 'Good' : 'Poor'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Event Type Distribution</h3>
              <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Event Distribution Chart</p>
                  <p className="text-sm opacity-75">Real-time analytics visualization</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-amber-500/20 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create Webhook Subscription</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://your-domain.com/webhook"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Events</label>
                <div className="space-y-2">
                  {['loan.created', 'risk.alert', 'liquidation.executed', 'portfolio.updated'].map((event) => (
                    <label key={event} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-300 text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createWebhookSubscription({})}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-lg font-medium hover:from-amber-400 hover:to-yellow-500 transition-all duration-200"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WebhookMonitoringPortal