import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Code, 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  Download,
  Zap,
  Shield,
  Globe,
  Settings,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Key
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'

interface APIEndpoint {
  method: string
  path: string
  description: string
  parameters?: Parameter[]
  requestBody?: RequestBodySchema
  responses: Response[]
  examples: CodeExample[]
  authentication: string
  rateLimit: string
}

interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
  example: any
}

interface RequestBodySchema {
  contentType: string
  schema: any
  example: any
}

interface Response {
  statusCode: number
  description: string
  schema: any
  example: any
}

interface CodeExample {
  language: string
  title: string
  code: string
}

interface WebhookDoc {
  overview: string
  authentication: string
  retryPolicy: string
  events: Array<{
    event: string
    description: string
    payload: any
  }>
}

const APIDocumentationPortal = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([])
  const [sdkExamples, setSdkExamples] = useState<{ [key: string]: string }>({})
  const [webhookDocs, setWebhookDocs] = useState<WebhookDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['endpoints']))
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAPIDocumentation()
  }, [])

  const loadAPIDocumentation = async () => {
    try {
      // Mock API call - replace with actual API endpoint
      const mockData = {
        endpoints: [
          {
            method: 'POST',
            path: '/api/enhanced-lenders/register',
            description: 'Register a new institutional lender with enhanced KYC verification and tier assignment',
            requestBody: {
              contentType: 'application/json',
              schema: {
                type: 'object',
                required: ['lenderAddress', 'entityName', 'licenseNumber', 'maxLendingCapacity'],
                properties: {
                  lenderAddress: { type: 'string', description: 'Ethereum wallet address' },
                  entityName: { type: 'string', description: 'Legal entity name' },
                  licenseNumber: { type: 'string', description: 'Regulatory license number' },
                  maxLendingCapacity: { type: 'string', description: 'Maximum lending capacity in wei' },
                  tierLevel: { type: 'number', description: 'Tier level (1-5)', default: 1 }
                }
              },
              example: {
                lenderAddress: '0x742d35Cc6634C0532925a3b8D5a1A8e1aC29c4b1',
                entityName: 'Lender Bank Digital Assets (demo)',
                licenseNumber: 'FDIC-2024-GS-001',
                maxLendingCapacity: '5000000000000000000000000000',
                tierLevel: 5
              }
            },
            responses: [
              {
                statusCode: 201,
                description: 'Lender registered successfully',
                schema: {},
                example: {
                  message: 'Enhanced institutional lender registered successfully',
                  data: {
                    lenderId: 1,
                    entityName: 'Lender Bank Digital Assets (demo)',
                    tierLevel: 5,
                    registrationDate: '2025-01-15T10:30:00.000Z'
                  }
                }
              }
            ],
            examples: [
              {
                language: 'javascript',
                title: 'Node.js with Axios',
                code: `const axios = require('axios');

const registerLender = async () => {
  try {
    const response = await axios.post('https://api.goldbackbond.com/api/enhanced-lenders/register', {
      lenderAddress: '0x742d35Cc6634C0532925a3b8D5a1A8e1aC29c4b1',
      entityName: 'Lender Bank Digital Assets (demo)',
      licenseNumber: 'FDIC-2024-GS-001',
      maxLendingCapacity: '5000000000000000000000000000',
      tierLevel: 5
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Lender ID:', response.data.data.lenderId);
  } catch (error) {
    console.error('Registration failed:', error.response.data);
  }
};`
              },
              {
                language: 'python',
                title: 'Python with Requests',
                code: `import requests
import json

def register_lender():
    url = 'https://api.goldbackbond.com/api/enhanced-lenders/register'
    headers = {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'lenderAddress': '0x742d35Cc6634C0532925a3b8D5a1A8e1aC29c4b1',
        'entityName': 'Lender Bank Digital Assets (demo)',
        'licenseNumber': 'FDIC-2024-GS-001',
        'maxLendingCapacity': '5000000000000000000000000000',
        'tierLevel': 5
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        print(f"Lender ID: {result['data']['lenderId']}")
    except requests.exceptions.RequestException as e:
        print(f"Registration failed: {e}")`
              }
            ],
            authentication: 'Bearer Token Required',
            rateLimit: '100 requests per minute'
          },
          {
            method: 'GET',
            path: '/api/enhanced-lenders/{lenderId}/portfolio',
            description: 'Get comprehensive portfolio analytics with enhanced risk metrics and performance indicators',
            parameters: [
              {
                name: 'lenderId',
                type: 'integer',
                required: true,
                description: 'Unique lender identifier',
                example: 1
              }
            ],
            responses: [
              {
                statusCode: 200,
                description: 'Portfolio data retrieved successfully',
                schema: {},
                example: {
                  message: 'Enhanced portfolio data retrieved successfully',
                  data: {
                    totalLoansActive: 43,
                    totalValueLent: '250000000000000000000000000',
                    totalInterestEarned: '18750000000000000000000000',
                    portfolioRiskScore: 125,
                    utilizationRate: '25.00%',
                    annualizedReturn: '8.50%'
                  }
                }
              }
            ],
            examples: [
              {
                language: 'javascript',
                title: 'Fetch Portfolio Analytics',
                code: `const getPortfolio = async (lenderId) => {
  const response = await fetch(\`https://api.goldbackbond.com/api/enhanced-lenders/\${lenderId}/portfolio\`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const portfolio = await response.json();
  console.log('Risk Score:', portfolio.data.portfolioRiskScore);
  return portfolio.data;
};`
              }
            ],
            authentication: 'Bearer Token Required',
            rateLimit: '500 requests per minute'
          }
        ],
        sdkExamples: {
          javascript: `// GoldBackBond Node.js SDK\nconst { GoldBackBondAPI } = require('@goldbackbond/api-sdk');\n\nconst client = new GoldBackBondAPI({\n  apiKey: 'YOUR_API_KEY',\n  baseURL: 'https://api.goldbackbond.com'\n});\n\n// Register enhanced lender\nconst lender = await client.enhancedLenders.register({\n  entityName: 'Lender Bank Digital Assets (demo)',\n  licenseNumber: 'FDIC-2024-GS-001',\n  tierLevel: 5\n});\n\n// Get portfolio analytics\nconst portfolio = await client.enhancedLenders.getPortfolio(lender.id);\n\n// Monitor risk analytics\nconst riskAnalytics = await client.enhancedLenders.getRiskAnalytics(lender.id);`,
          python: `# GoldBackBond Python SDK\nfrom goldbackbond import GoldBackBondAPI\n\nclient = GoldBackBondAPI(\n    api_key="YOUR_API_KEY",\n    base_url="https://api.goldbackbond.com"\n)\n\n# Register enhanced lender\nlender = client.enhanced_lenders.register(\n    entity_name="Lender Bank Digital Assets (demo)",\n    license_number="FDIC-2024-GS-001",\n    tier_level=5\n)\n\n# Get portfolio analytics\nportfolio = client.enhanced_lenders.get_portfolio(lender.id)\n\n# Monitor risk analytics\nrisk_analytics = client.enhanced_lenders.get_risk_analytics(lender.id)`
        },
        webhookDocs: {
          overview: 'Real-time event notifications via HTTPS webhooks with HMAC signature verification',
          authentication: 'HMAC-SHA256 signature verification',
          retryPolicy: 'Exponential backoff up to 24 hours',
          events: [
            {
              event: 'lender.registered',
              description: 'Triggered when a new institutional lender is registered',
              payload: {
                event: 'lender.registered',
                data: {
                  lenderId: 123,
                  entityName: 'Lender Bank Digital Assets (demo)',
                  tierLevel: 5,
                  registrationDate: '2025-01-15T10:30:00.000Z'
                },
                timestamp: '2025-01-15T10:30:00.000Z'
              }
            },
            {
              event: 'risk.alert',
              description: 'Triggered when loan risk threshold is exceeded',
              payload: {
                event: 'risk.alert',
                data: {
                  loanId: 456,
                  currentLTV: 8200,
                  threshold: 8000,
                  severity: 'HIGH'
                },
                timestamp: '2025-01-15T10:30:00.000Z'
              }
            }
          ]
        }
      }

      setEndpoints(mockData.endpoints)
      setSdkExamples(mockData.sdkExamples)
      setWebhookDocs(mockData.webhookDocs)
      setSelectedEndpoint(mockData.endpoints[0])
      setLoading(false)
    } catch (error) {
      console.error('Failed to load API documentation:', error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to load API documentation",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-500'
      case 'POST': return 'bg-blue-500'
      case 'PUT': return 'bg-yellow-500'
      case 'DELETE': return 'bg-red-500'
      case 'PATCH': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading API Documentation...</p>
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
                <Book className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">API Documentation Portal</h1>
                <p className="text-gray-400">Complete guide to GoldBackBond Enhanced Lender Protocol</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download SDK
              </button>
              <button className="border border-amber-500 text-amber-400 px-4 py-2 rounded-lg font-medium hover:bg-amber-500/10 transition-all duration-200 flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Get API Key
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
              
              {/* Quick Links */}
              <div className="space-y-3">
                <button 
                  onClick={() => toggleSection('overview')}
                  className="w-full flex items-center justify-between text-left text-gray-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Overview
                  </span>
                  {expandedSections.has('overview') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                
                <button 
                  onClick={() => toggleSection('endpoints')}
                  className="w-full flex items-center justify-between text-left text-gray-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    API Endpoints
                  </span>
                  {expandedSections.has('endpoints') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                
                {expandedSections.has('endpoints') && (
                  <div className="ml-6 space-y-2">
                    {endpoints.map((endpoint, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEndpoint(endpoint)}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                          selectedEndpoint === endpoint 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded text-white ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <span className="truncate">{endpoint.path}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                <button 
                  onClick={() => toggleSection('webhooks')}
                  className="w-full flex items-center justify-between text-left text-gray-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Webhooks
                  </span>
                  {expandedSections.has('webhooks') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                
                <button 
                  onClick={() => toggleSection('sdks')}
                  className="w-full flex items-center justify-between text-left text-gray-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    SDKs
                  </span>
                  {expandedSections.has('sdks') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Section */}
            {expandedSections.has('overview') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Enhanced Lender Protocol API</h2>
                <p className="text-gray-300 mb-6">
                  The GoldBackBond Enhanced Lender Protocol provides institutional-grade APIs for managing 
                  large-scale lending operations with USDGB collateral. Features include advanced risk 
                  analytics, automated liquidation, tier-based fee structures, and real-time webhooks.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <Shield className="h-8 w-8 text-emerald-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1">Enterprise Security</h3>
                    <p className="text-sm text-gray-400">Multi-sig protection, HMAC webhooks, rate limiting</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <Zap className="h-8 w-8 text-amber-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1">Real-time Analytics</h3>
                    <p className="text-sm text-gray-400">Live portfolio metrics, risk scoring, performance tracking</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <Globe className="h-8 w-8 text-blue-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1">Multi-chain Support</h3>
                    <p className="text-sm text-gray-400">LayerZero integration across 100+ blockchains</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Selected Endpoint Details */}
            {selectedEndpoint && expandedSections.has('endpoints') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getMethodColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="bg-slate-700/50 px-3 py-1 rounded text-amber-400 font-mono text-sm">
                    {selectedEndpoint.path}
                  </code>
                </div>
                
                <p className="text-gray-300 mb-6">{selectedEndpoint.description}</p>
                
                {/* Authentication & Rate Limit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Authentication
                    </h4>
                    <p className="text-sm text-gray-400">{selectedEndpoint.authentication}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Rate Limit
                    </h4>
                    <p className="text-sm text-gray-400">{selectedEndpoint.rateLimit}</p>
                  </div>
                </div>
                
                {/* Parameters */}
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3">Parameters</h4>
                    <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-slate-600/50">
                          <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Required</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEndpoint.parameters.map((param, index) => (
                            <tr key={index} className="border-t border-slate-600/50">
                              <td className="py-3 px-4 text-sm font-mono text-amber-400">{param.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-300">{param.type}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${param.required ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                  {param.required ? 'Required' : 'Optional'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-300">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Request Body */}
                {selectedEndpoint.requestBody && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3">Request Body</h4>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Content-Type: {selectedEndpoint.requestBody.contentType}</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.requestBody.example, null, 2), 'request-body')}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === 'request-body' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{JSON.stringify(selectedEndpoint.requestBody.example, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* Response Examples */}
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Response Examples</h4>
                  {selectedEndpoint.responses.map((response, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs text-white ${
                          response.statusCode >= 200 && response.statusCode < 300 ? 'bg-green-500' :
                          response.statusCode >= 400 ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {response.statusCode}
                        </span>
                        <span className="text-sm text-gray-400">{response.description}</span>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Response Body</span>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2), `response-${index}`)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedCode === `response-${index}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{JSON.stringify(response.example, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Code Examples */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Code Examples</h4>
                  <div className="flex space-x-2 mb-4">
                    {selectedEndpoint.examples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedLanguage(example.language)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          selectedLanguage === example.language
                            ? 'bg-amber-500 text-slate-900'
                            : 'bg-slate-700/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        {example.title}
                      </button>
                    ))}
                  </div>
                  {selectedEndpoint.examples
                    .filter(example => example.language === selectedLanguage)
                    .map((example, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">{example.title}</span>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-white transition-colors">
                              <Play className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => copyToClipboard(example.code, `example-${index}`)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {copiedCode === `example-${index}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}

            {/* Webhooks Section */}
            {expandedSections.has('webhooks') && webhookDocs && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Webhook Events</h2>
                <p className="text-gray-300 mb-6">{webhookDocs.overview}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Authentication</h4>
                    <p className="text-sm text-gray-400">{webhookDocs.authentication}</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Retry Policy</h4>
                    <p className="text-sm text-gray-400">{webhookDocs.retryPolicy}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-4">Available Events</h3>
                <div className="space-y-4">
                  {webhookDocs.events.map((event, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-sm">
                          {event.event}
                        </code>
                      </div>
                      <p className="text-gray-300 mb-3">{event.description}</p>
                      <details className="cursor-pointer">
                        <summary className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                          View payload example
                        </summary>
                        <div className="mt-2 bg-slate-900/50 rounded p-3">
                          <pre className="text-xs text-gray-300 overflow-x-auto">
                            <code>{JSON.stringify(event.payload, null, 2)}</code>
                          </pre>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SDK Examples Section */}
            {expandedSections.has('sdks') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">SDK Examples</h2>
                <p className="text-gray-300 mb-6">
                  Official SDKs for rapid integration with the Enhanced Lender Protocol.
                </p>
                
                <div className="flex space-x-2 mb-4">
                  {Object.keys(sdkExamples).map((language) => (
                    <button
                      key={language}
                      onClick={() => setSelectedLanguage(language)}
                      className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
                        selectedLanguage === language
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-slate-700/50 text-gray-400 hover:text-white'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
                
                {Object.entries(sdkExamples)
                  .filter(([language]) => language === selectedLanguage)
                  .map(([language, code]) => (
                    <div key={language} className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400 capitalize">{language} SDK</span>
                        <div className="flex items-center space-x-2">
                          <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded text-xs transition-colors flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            Install
                          </button>
                          <button
                            onClick={() => copyToClipboard(code, `sdk-${language}`)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedCode === `sdk-${language}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))
                }
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default APIDocumentationPortal