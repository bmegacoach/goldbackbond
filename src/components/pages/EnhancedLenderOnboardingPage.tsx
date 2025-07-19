import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Building2,
  Shield,
  DollarSign,
  Code,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Lock,
  Users,
  Globe,
  Zap,
  ArrowRight,
  Download,
  ExternalLink,
  Calculator
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'

const EnhancedLenderOnboardingPage = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<'portal' | 'api' | null>(null)
  const [estimatedVolume, setEstimatedVolume] = useState<string>('')
  const [selectedTier, setSelectedTier] = useState<number>(1)
  const [agreementAccepted, setAgreementAccepted] = useState<boolean>(false)
  const [calculatedFees, setCalculatedFees] = useState<any>(null)

  // Fee calculation based on tier and volume
  const calculateFees = (volume: number, tier: number) => {
    const baseFee = 0.0025 // 0.25% base technology fee
    const tierDiscounts = {
      1: 0, // No discount
      2: 0.1, // 10% discount
      3: 0.15, // 15% discount
      4: 0.2, // 20% discount
      5: 0.25 // 25% discount
    }
    
    const discountRate = tierDiscounts[tier as keyof typeof tierDiscounts] || 0
    const discountedFee = baseFee * (1 - discountRate)
    const annualFee = volume * discountedFee
    
    return {
      baseFeeRate: `${(baseFee * 100).toFixed(2)}%`,
      tierDiscount: `${(discountRate * 100).toFixed(0)}%`,
      finalFeeRate: `${(discountedFee * 100).toFixed(2)}%`,
      annualFeeAmount: annualFee,
      monthlyFeeAmount: annualFee / 12
    }
  }

  useEffect(() => {
    if (estimatedVolume && selectedTier) {
      const volume = parseFloat(estimatedVolume.replace(/[^0-9.]/g, ''))
      if (volume > 0) {
        setCalculatedFees(calculateFees(volume, selectedTier))
      }
    }
  }, [estimatedVolume, selectedTier])

  const smartContractFeatures = [
    {
      title: 'Automated Loan Origination',
      description: 'Smart contracts automatically process loan applications based on predefined criteria',
      icon: Zap,
      technical: 'LenderProtocol.originateLoan() with automated LTV validation'
    },
    {
      title: 'Real-time Collateral Monitoring',
      description: '24/7 monitoring of USDGB collateral values with 70% LTV enforcement',
      icon: Shield,
      technical: 'Chainlink price feeds integrated with liquidation triggers'
    },
    {
      title: 'Technology Fee Collection',
      description: 'Automated fee collection with tier-based discounts and transparent reporting',
      icon: DollarSign,
      technical: 'FeeCollection.collectTechnologyFee() with volume-based pricing'
    },
    {
      title: 'Multi-chain Deployment',
      description: 'Deployment across 100+ blockchains via LayerZero for maximum accessibility',
      icon: Globe,
      technical: 'LayerZero OmniChain protocol for seamless cross-chain operations'
    }
  ]

  const integrationOptions = [
    {
      type: 'portal' as const,
      title: 'Management Portal',
      description: 'Use our professional web interface for portfolio management',
      features: [
        'Real-time dashboard with portfolio analytics',
        'Loan monitoring and risk management tools',
        'Automated alerts and notifications',
        'Export capabilities and reporting'
      ],
      ideal: 'Teams that prefer web-based management',
      setup: 'Ready to use immediately after onboarding'
    },
    {
      type: 'api' as const,
      title: 'API Integration',
      description: 'Build custom integrations with our comprehensive API',
      features: [
        'RESTful API with comprehensive endpoints',
        'Real-time webhooks for loan events',
        'Multi-language SDKs (JS, Python, Go)',
        'Complete documentation and testing tools'
      ],
      ideal: 'Development teams building custom solutions',
      setup: 'Technical integration with developer support'
    }
  ]

  const tierBenefits = {
    1: { name: 'Bronze', discount: '0%', minVolume: '$1M', features: ['Basic API Access', 'Email Support'] },
    2: { name: 'Silver', discount: '10%', minVolume: '$10M', features: ['Priority API', 'Phone Support', 'Custom Reports'] },
    3: { name: 'Gold', discount: '15%', minVolume: '$50M', features: ['Dedicated Support', 'Advanced Analytics', 'Custom Integrations'] },
    4: { name: 'Platinum', discount: '20%', minVolume: '$100M', features: ['Personal Account Manager', 'White-label Options', 'Priority Processing'] },
    5: { name: 'Diamond', discount: '25%', minVolume: '$500M', features: ['Enterprise Support', 'Custom Smart Contracts', 'Regulatory Assistance'] }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Institutional Lender Onboarding
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join the world's largest gold-backed lending protocol. Access $250B in gold certificates 
                with smart contract automation and enterprise-grade tools.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-slate-800/50 border border-amber-500/20 grid grid-cols-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Protocol Overview
            </TabsTrigger>
            <TabsTrigger value="integration" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Integration Options
            </TabsTrigger>
            <TabsTrigger value="fees" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Fee Structure
            </TabsTrigger>
            <TabsTrigger value="onboard" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              Complete Onboarding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Smart Contract Protocol */}
            <Card className="bg-slate-800/60 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-amber-400" />
                  Smart Contract Protocol
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Built on battle-tested smart contracts with $250B in gold certificate backing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {smartContractFeatures.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                      >
                        <div className="flex items-center mb-3">
                          <Icon className="h-5 w-5 text-amber-400 mr-2" />
                          <h3 className="text-white font-semibold">{feature.title}</h3>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                        <div className="bg-slate-900/50 rounded p-2">
                          <code className="text-xs text-green-400">{feature.technical}</code>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                    $250B Gold Backing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Access to world's largest tokenized gold reserve with US government certificates</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-400" />
                    70% LTV Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Automated liquidation protection with real-time collateral monitoring</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-purple-400" />
                    100+ Blockchains
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Multi-chain deployment for maximum market accessibility</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {integrationOptions.map((option) => (
                <motion.div key={option.type} className="space-y-4">
                  <Card 
                    className={`bg-slate-800/60 border-2 transition-all cursor-pointer ${
                      selectedIntegration === option.type 
                        ? 'border-amber-500 bg-amber-500/10' 
                        : 'border-slate-600 hover:border-amber-500/50'
                    }`}
                    onClick={() => setSelectedIntegration(option.type)}
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center">
                          {option.type === 'portal' ? <Building2 className="h-5 w-5 mr-2" /> : <Code className="h-5 w-5 mr-2" />}
                          {option.title}
                        </span>
                        {selectedIntegration === option.type && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-white font-medium mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {option.features.map((feature, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t border-slate-600 pt-3">
                          <div className="text-sm text-gray-400">
                            <strong>Ideal for:</strong> {option.ideal}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            <strong>Setup:</strong> {option.setup}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedIntegration && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {selectedIntegration === 'portal' ? 'Management Portal' : 'API Integration'} Selected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 mb-2">
                          {selectedIntegration === 'portal' 
                            ? 'You\'ll have access to our professional management portal immediately after onboarding.' 
                            : 'Our team will provide API credentials and technical support for your integration.'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>✓ Documentation included</span>
                          <span>✓ Support team assigned</span>
                          <span>✓ Training provided</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {selectedIntegration === 'portal' ? (
                          <Link to="/lender-dashboard">
                            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                              Preview Portal
                            </Button>
                          </Link>
                        ) : (
                          <Link to="/integration">
                            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                              View API Docs
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="fees" className="space-y-8">
            <Card className="bg-slate-800/60 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-amber-400" />
                  Technology Fee Calculator
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Calculate your annual technology fees based on lending volume and tier level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Estimated Annual Lending Volume</label>
                    <Input
                      placeholder="e.g., $50,000,000"
                      value={estimatedVolume}
                      onChange={(e) => setEstimatedVolume(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Institution Tier</label>
                    <Select value={selectedTier.toString()} onValueChange={(value) => setSelectedTier(parseInt(value))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(tierBenefits).map(([tier, benefits]) => (
                          <SelectItem key={tier} value={tier}>
                            Tier {tier} - {benefits.name} ({benefits.discount} off)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {calculatedFees && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-700/50 rounded-lg p-6 border border-amber-500/30"
                  >
                    <h3 className="text-white font-semibold mb-4">Fee Calculation Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-amber-400 font-bold text-lg">{calculatedFees.baseFeeRate}</div>
                        <div className="text-gray-400 text-xs">Base Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold text-lg">-{calculatedFees.tierDiscount}</div>
                        <div className="text-gray-400 text-xs">Tier Discount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{calculatedFees.finalFeeRate}</div>
                        <div className="text-gray-400 text-xs">Final Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-amber-400 font-bold text-lg">
                          ${calculatedFees.annualFeeAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-gray-400 text-xs">Annual Fee</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center text-gray-300">
                      Monthly: <span className="text-white font-semibold">
                        ${calculatedFees.monthlyFeeAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Tier Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(tierBenefits).map(([tier, benefits]) => (
                    <Card 
                      key={tier} 
                      className={`bg-slate-700/50 border ${
                        selectedTier === parseInt(tier) 
                          ? 'border-amber-500 bg-amber-500/10' 
                          : 'border-slate-600'
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm text-center">
                          Tier {tier} - {benefits.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center mb-3">
                          <div className="text-green-400 font-bold">{benefits.discount} Discount</div>
                          <div className="text-gray-400 text-xs">Min: {benefits.minVolume}</div>
                        </div>
                        <ul className="space-y-1">
                          {benefits.features.map((feature, index) => (
                            <li key={index} className="text-gray-300 text-xs flex items-center">
                              <CheckCircle className="h-2 w-2 text-green-400 mr-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onboard" className="space-y-8">
            <Card className="bg-slate-800/60 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white">Complete Your Onboarding</CardTitle>
                <CardDescription className="text-gray-400">
                  Finalize your institutional lender registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Institution Name</label>
                    <Input
                      placeholder="Lender Bank Digital Assets (demo)"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">License Number</label>
                    <Input
                      placeholder="FDIC-12345"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Contact Email</label>
                    <Input
                      type="email"
                      placeholder="institutional@yourbank.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Maximum Lending Capacity</label>
                    <Input
                      placeholder="$1,000,000,000"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Ethereum Wallet Address</label>
                  <Input
                    placeholder="0x742d35Cc6634C0532925a3b8D5a1A8e1aC29c4b1"
                    className="bg-slate-700 border-slate-600 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Additional Requirements</label>
                  <Textarea
                    placeholder="Describe any specific integration requirements, compliance needs, or custom features..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>

                {/* Agreement */}
                <div className="bg-slate-700/50 rounded-lg p-6 border border-amber-500/30">
                  <h3 className="text-white font-semibold mb-4">Smart Contract Agreement</h3>
                  <div className="space-y-3 text-gray-300 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Technology fees are automatically collected via smart contract</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>70% LTV enforcement with automated liquidation protection</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>USDGB collateral monitoring via Chainlink price feeds</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Multi-chain deployment and LayerZero integration</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <Checkbox 
                      id="agreement" 
                      checked={agreementAccepted}
                      onCheckedChange={(checked) => setAgreementAccepted(checked as boolean)}
                    />
                    <label htmlFor="agreement" className="text-white text-sm">
                      I accept the smart contract terms and technology fee structure
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-center">
                  <Button 
                    disabled={!agreementAccepted || !selectedIntegration}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 hover:from-amber-400 hover:to-yellow-500 px-8 py-3 text-lg font-semibold"
                  >
                    Complete Institutional Onboarding
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>

                {selectedIntegration && agreementAccepted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <Card className="bg-green-500/10 border-green-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span>Ready to submit - All requirements met</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default EnhancedLenderOnboardingPage