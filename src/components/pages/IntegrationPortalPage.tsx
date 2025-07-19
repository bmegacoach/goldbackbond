import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Download,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  Book,
  Zap,
  Shield,
  Webhook,
  Key,
  Database,
  Terminal,
  PlayCircle,
  FileText,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const IntegrationPortalPage = () => {
  const [copiedCode, setCopiedCode] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [apiStatus, setApiStatus] = useState<any>(null)

  useEffect(() => {
    fetchApiStatus()
    // Generate demo API key
    setApiKey('gb_' + Math.random().toString(36).substr(2, 32))
  }, [])

  const fetchApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:8001/health')
      const data = await response.json()
      setApiStatus(data)
    } catch (error) {
      console.error('Error fetching API status:', error)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const codeExamples = {
    javascript: {
      quickStart: `// GoldBackBond Lender API - Quick Start
const GoldBackBond = require('@goldbackbond/lender-sdk');

// Initialize the client
const client = new GoldBackBond({
  apiKey: '${apiKey}',
  baseUrl: 'http://localhost:8001'
});

// Register as institutional lender
async function registerLender() {
  try {
    const result = await client.lenders.register({
      lenderAddress: '0x742d35Cc6634C0532925a3b8D5a1A8e1aC29c4b1',
      entityName: 'Your Institution Name',
      licenseNumber: 'LICENSE-12345',
      maxLendingCapacity: '1000000000000000000000000000', // $1B
      tierLevel: 3
    });
    
    console.log('Lender registered:', result.data.lenderId);
    return result.data.lenderId;
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Get portfolio data
async function getPortfolio(lenderId) {
  try {
    const portfolio = await client.lenders.getPortfolio(lenderId);
    console.log('Portfolio:', portfolio.data);
    return portfolio.data;
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
  }
}

// Monitor loans
async function getLoans(lenderId) {
  try {
    const loans = await client.lenders.getLoans(lenderId, {
      status: 'ACTIVE',
      page: 1,
      limit: 20
    });
    
    console.log('Active loans:', loans.data.loans.length);
    return loans.data.loans;
  } catch (error) {
    console.error('Failed to fetch loans:', error);
  }
}

// Calculate fees
async function calculateFees(loanAmount, duration, tierLevel) {
  try {
    const fees = await client.calculateFees({
      loanAmount,
      duration,
      lenderTier: tierLevel,
      feeType: 'origination'
    });
    
    console.log('Fee calculation:', fees.data);
    return fees.data;
  } catch (error) {
    console.error('Fee calculation failed:', error);
  }
}

// Example usage
registerLender().then(lenderId => {
  if (lenderId) {
    getPortfolio(lenderId);
    getLoans(lenderId);
  }
});`,
      webhooks: `// Webhook Integration
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Webhook endpoint
app.post('/goldbackbond-webhook', (req, res) => {
  const signature = req.headers['x-goldbackbond-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', 'your-webhook-secret')
    .update(payload)
    .digest('hex');
  
  if (signature !== \`sha256=\${expectedSignature}\`) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook event
  const { eventType, data, lenderId } = req.body;
  
  switch (eventType) {
    case 'loan.created':
      console.log('New loan created:', data.loan);
      // Handle new loan logic
      break;
      
    case 'payment.received':
      console.log('Payment received:', data.payment);
      // Update internal records
      break;
      
    case 'risk.alert':
      console.log('Risk alert:', data.alert);
      // Send notification to risk team
      sendRiskAlert(data.alert);
      break;
      
    case 'loan.liquidated':
      console.log('Loan liquidated:', data.liquidation);
      // Process liquidation
      break;
      
    default:
      console.log('Unknown event type:', eventType);
  }
  
  res.status(200).send('OK');
});

// Subscribe to webhook events
async function subscribeToWebhooks() {
  const response = await fetch('http://localhost:8001/api/webhooks/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: JSON.stringify({
      lenderId: 1,
      url: 'https://your-domain.com/goldbackbond-webhook',
      events: [
        'loan.created',
        'loan.approved',
        'payment.received',
        'payment.overdue',
        'risk.alert',
        'loan.liquidated'
      ],
      secret: 'your-webhook-secret'
    })
  });
  
  const result = await response.json();
  console.log('Webhook subscription:', result);
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
  subscribeToWebhooks();
});`,
      riskManagement: `// Risk Management Integration
class RiskManager {
  constructor(apiKey, lenderId) {
    this.apiKey = apiKey;
    this.lenderId = lenderId;
    this.baseUrl = 'http://localhost:8001';
  }
  
  // Monitor portfolio risk in real-time
  async monitorRisk() {
    try {
      const response = await fetch(
        \`\${this.baseUrl}/api/lenders/\${this.lenderId}/risk-analytics\`,
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`
          }
        }
      );
      
      const riskData = await response.json();
      const risk = riskData.data;
      
      // Check for high-risk conditions
      if (risk.portfolioRiskScore > 750) {
        await this.sendHighRiskAlert(risk);
      }
      
      // Monitor liquidation risk
      if (risk.liquidationRisk.immediate > 0) {
        await this.handleImmediateLiquidationRisk(risk.liquidationRisk);
      }
      
      // Check concentration risk
      const concentrationThreshold = 0.25; // 25%
      if (risk.concentrationRisk.single_borrower_max > concentrationThreshold) {
        await this.handleConcentrationRisk(risk.concentrationRisk);
      }
      
      return risk;
    } catch (error) {
      console.error('Risk monitoring failed:', error);
    }
  }
  
  // Handle immediate liquidation risk
  async handleImmediateLiquidationRisk(liquidationRisk) {
    console.log('URGENT: Immediate liquidation risk detected');
    
    // Get loans at immediate risk
    const loansResponse = await fetch(
      \`\${this.baseUrl}/api/lenders/\${this.lenderId}/loans?status=LIQUIDATION_RISK\`,
      {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        }
      }
    );
    
    const loans = await loansResponse.json();
    
    // Process each at-risk loan
    for (const loan of loans.data.loans) {
      if (parseFloat(loan.currentLTVPercent) > 85) {
        console.log(\`Triggering liquidation for loan #\${loan.loanId}\`);
        // Trigger liquidation process
        await this.triggerLiquidation(loan.loanId);
      }
    }
  }
  
  // Auto-rebalancing based on risk metrics
  async autoRebalance() {
    const portfolio = await this.getPortfolio();
    const riskMetrics = await this.monitorRisk();
    
    // If portfolio risk is too high, reduce exposure
    if (riskMetrics.portfolioRiskScore > 600) {
      const reductionAmount = portfolio.totalValueLent * 0.1; // Reduce by 10%
      
      console.log(\`Reducing portfolio exposure by $\${reductionAmount}\`);
      
      // Implement rebalancing logic
      await this.reduceExposure(reductionAmount);
    }
  }
  
  // Send risk alerts
  async sendHighRiskAlert(riskData) {
    const alert = {
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      riskScore: riskData.portfolioRiskScore,
      message: \`Portfolio risk score has exceeded threshold: \${riskData.portfolioRiskScore}\`,
      recommendations: [
        'Review high-LTV loans immediately',
        'Consider reducing portfolio exposure',
        'Increase collateral monitoring frequency'
      ]
    };
    
    // Send to internal systems
    console.log('HIGH RISK ALERT:', alert);
    
    // Could integrate with:
    // - Slack notifications
    // - Email alerts  
    // - SMS warnings
    // - Internal dashboards
  }
}

// Usage example
const riskManager = new RiskManager('${apiKey}', 1);

// Monitor risk every 5 minutes
setInterval(async () => {
  await riskManager.monitorRisk();
  await riskManager.autoRebalance();
}, 5 * 60 * 1000);

console.log('Risk management system started');`
    },
    python: {
      quickStart: `# GoldBackBond Lender API - Python SDK
import requests
import json
from datetime import datetime

class GoldBackBondClient:
    def __init__(self, api_key, base_url='http://localhost:8001'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def register_lender(self, entity_name, license_number, max_capacity, tier_level=1):
        """Register as institutional lender"""
        payload = {
            'lenderAddress': '0x742d35Cc6634C0532925a3b8D5a1A8e1aC29c4b1',
            'entityName': entity_name,
            'licenseNumber': license_number,
            'maxLendingCapacity': str(max_capacity),
            'tierLevel': tier_level
        }
        
        response = requests.post(
            f'{self.base_url}/api/lenders/register',
            headers=self.headers,
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Lender registered with ID: {result['data']['lenderId']}")
            return result['data']['lenderId']
        else:
            print(f"Registration failed: {response.text}")
            return None
    
    def get_portfolio(self, lender_id):
        """Get portfolio data"""
        response = requests.get(
            f'{self.base_url}/api/lenders/{lender_id}/portfolio',
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()['data']
        else:
            print(f"Failed to get portfolio: {response.text}")
            return None
    
    def get_loans(self, lender_id, status='all', page=1, limit=20):
        """Get loan portfolio"""
        params = {
            'status': status,
            'page': page,
            'limit': limit
        }
        
        response = requests.get(
            f'{self.base_url}/api/lenders/{lender_id}/loans',
            headers=self.headers,
            params=params
        )
        
        if response.status_code == 200:
            return response.json()['data']
        else:
            print(f"Failed to get loans: {response.text}")
            return None
    
    def get_risk_analytics(self, lender_id):
        """Get risk analytics"""
        response = requests.get(
            f'{self.base_url}/api/lenders/{lender_id}/risk-analytics',
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()['data']
        else:
            print(f"Failed to get risk analytics: {response.text}")
            return None
    
    def calculate_fees(self, loan_amount, duration, lender_tier, fee_type='origination'):
        """Calculate technology fees"""
        payload = {
            'loanAmount': str(loan_amount),
            'duration': duration,
            'lenderTier': lender_tier,
            'feeType': fee_type
        }
        
        response = requests.post(
            f'{self.base_url}/api/calculate-fees',
            headers=self.headers,
            json=payload
        )
        
        if response.status_code == 200:
            return response.json()['data']
        else:
            print(f"Fee calculation failed: {response.text}")
            return None

# Usage example
client = GoldBackBondClient('${apiKey}')

# Register lender
lender_id = client.register_lender(
    entity_name='Python Financial Corp',
    license_number='PY-12345',
    max_capacity=500000000,  # $500M
    tier_level=2
)

if lender_id:
    # Get portfolio data
    portfolio = client.get_portfolio(lender_id)
    print(f"Portfolio value: {portfolio['totalValueLent']}")
    
    # Get active loans
    loans = client.get_loans(lender_id, status='ACTIVE')
    print(f"Active loans: {len(loans['loans'])}")
    
    # Get risk analytics
    risk = client.get_risk_analytics(lender_id)
    print(f"Portfolio risk score: {risk['portfolioRiskScore']}")
    
    # Calculate fees for $1M loan
    fees = client.calculate_fees(
        loan_amount=1000000,
        duration=365,
        lender_tier=2
    )
    print(f"Technology fee: \${fees['discountedFeeAmount']:,.2f}")`
    }
  }

  const sdkDownloads = [
    {
      language: 'JavaScript/Node.js',
      package: '@goldbackbond/lender-sdk',
      install: 'npm install @goldbackbond/lender-sdk',
      version: '1.0.0',
      icon: '🟨'
    },
    {
      language: 'Python',
      package: 'goldbackbond-python',
      install: 'pip install goldbackbond-python',
      version: '1.0.0',
      icon: '🐍'
    },
    {
      language: 'TypeScript',
      package: '@goldbackbond/lender-sdk',
      install: 'npm install @goldbackbond/lender-sdk',
      version: '1.0.0',
      icon: '🔷'
    },
    {
      language: 'Go',
      package: 'github.com/goldbackbond/go-sdk',
      install: 'go get github.com/goldbackbond/go-sdk',
      version: '1.0.0',
      icon: '🐹'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                API Integration Portal
              </h1>
              <p className="text-gray-300">
                Complete developer resources for institutional lending integration
              </p>
            </div>
            <div className="flex items-center gap-4">
              {apiStatus && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  API Online
                </Badge>
              )}
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 hover:from-amber-400 hover:to-yellow-500">
                <Download className="h-4 w-4 mr-2" />
                Download SDK
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-amber-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Overview
            </TabsTrigger>
            <TabsTrigger value="quickstart" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="sdk" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              SDKs
            </TabsTrigger>
            <TabsTrigger value="testing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* API Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-400" />
                    API Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {apiStatus ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Status</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {apiStatus.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Version</span>
                        <span className="text-white">{apiStatus.version}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Environment</span>
                        <span className="text-white">{apiStatus.environment}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">Loading...</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-amber-400" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-300 mb-1 block">API Key</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={apiKey}
                          readOnly
                          className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(apiKey, 'apikey')}
                          className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        >
                          {copiedCode === 'apikey' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Include in Authorization header: Bearer {apiKey.slice(0, 8)}...
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Database className="h-5 w-5 mr-2 text-amber-400" />
                    Rate Limits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Requests</span>
                      <span className="text-white">1,000/15min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Webhooks</span>
                      <span className="text-white">Unlimited</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Data Export</span>
                      <span className="text-white">10/day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Core Features</CardTitle>
                  <CardDescription className="text-gray-400">
                    Complete institutional lending capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-3">✓</Badge>
                    <span className="text-gray-300">Institutional Lender Registration</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-3">✓</Badge>
                    <span className="text-gray-300">Portfolio Management</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-3">✓</Badge>
                    <span className="text-gray-300">Real-time Risk Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-3">✓</Badge>
                    <span className="text-gray-300">Automated Loan Management</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-3">✓</Badge>
                    <span className="text-gray-300">Technology Fee Calculation</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-3">✓</Badge>
                    <span className="text-gray-300">Webhook Event Notifications</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Smart Contract Integration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Blockchain-powered lending protocol
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-3">SC</Badge>
                    <span className="text-gray-300">USDGB Token Integration</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-3">SC</Badge>
                    <span className="text-gray-300">Automated Liquidations</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-3">SC</Badge>
                    <span className="text-gray-300">Collateral Monitoring</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-3">SC</Badge>
                    <span className="text-gray-300">Multi-chain Support</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-3">SC</Badge>
                    <span className="text-gray-300">Gas Optimization</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-3">SC</Badge>
                    <span className="text-gray-300">Governance Integration</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quickstart" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center">
                        <Code className="h-5 w-5 mr-2 text-amber-400" />
                        Quick Start Guide
                      </CardTitle>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-slate-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                        <code>{codeExamples[selectedLanguage as keyof typeof codeExamples]?.quickStart}</code>
                      </pre>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(codeExamples[selectedLanguage as keyof typeof codeExamples]?.quickStart || '', 'quickstart')}
                        className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      >
                        {copiedCode === 'quickstart' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mt-1">1</Badge>
                      <div>
                        <div className="text-white text-sm font-medium">Install SDK</div>
                        <div className="text-gray-400 text-xs">Choose your preferred language</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mt-1">2</Badge>
                      <div>
                        <div className="text-white text-sm font-medium">Get API Key</div>
                        <div className="text-gray-400 text-xs">Generated automatically above</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mt-1">3</Badge>
                      <div>
                        <div className="text-white text-sm font-medium">Register Lender</div>
                        <div className="text-gray-400 text-xs">Complete institutional onboarding</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mt-1">4</Badge>
                      <div>
                        <div className="text-white text-sm font-medium">Start Lending</div>
                        <div className="text-gray-400 text-xs">Begin portfolio management</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <Book className="h-4 w-4 mr-2" />
                      API Documentation
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      Interactive Playground
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      GitHub Repository
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Webhook className="h-5 w-5 mr-2 text-amber-400" />
                    Webhook Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Webhook URL</label>
                    <Input
                      placeholder="https://your-domain.com/webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Events to Subscribe</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {[
                        'loan.created', 'loan.approved', 'payment.received', 
                        'payment.overdue', 'risk.alert', 'loan.liquidated'
                      ].map(event => (
                        <div key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={event}
                            className="rounded border-slate-600 bg-slate-700"
                          />
                          <label htmlFor={event} className="text-gray-300 text-sm">{event}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900">
                    Configure Webhook
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Webhook Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-slate-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
                      <code>{codeExamples.javascript.webhooks}</code>
                    </pre>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(codeExamples.javascript.webhooks, 'webhooks')}
                      className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                    >
                      {copiedCode === 'webhooks' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sdk" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sdkDownloads.map((sdk, index) => (
                <Card key={index} className="bg-slate-800/60 border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <span className="text-2xl mr-3">{sdk.icon}</span>
                      {sdk.language}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Official SDK for {sdk.language}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Package</div>
                      <div className="text-white font-mono text-sm">{sdk.package}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Installation</div>
                      <div className="bg-slate-900 p-2 rounded font-mono text-sm text-green-400">
                        {sdk.install}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        v{sdk.version}
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-slate-800/60 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PlayCircle className="h-5 w-5 mr-2 text-amber-400" />
                  API Testing Environment
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Test your integration with live API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Test Health Endpoint
                  </Button>
                  <Button className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
                    <Key className="h-4 w-4 mr-2" />
                    Test Authentication
                  </Button>
                  <Button className="bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30">
                    <Database className="h-4 w-4 mr-2" />
                    Test Portfolio API
                  </Button>
                  <Button className="bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30">
                    <Webhook className="h-4 w-4 mr-2" />
                    Test Webhook Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default IntegrationPortalPage