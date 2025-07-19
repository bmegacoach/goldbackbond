import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Shield, 
  FileCheck, 
  Users, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Percent,
  Lock,
  Globe,
  Award,
  ArrowRight,
  Download,
  Upload,
  Eye,
  Wallet,
  BarChart3
} from 'lucide-react'

const LenderOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    entityName: '',
    entityType: '',
    licenseNumber: '',
    jurisdiction: '',
    contactEmail: '',
    businessAddress: '',
    aum: '',
    yearsInBusiness: '',
    regulatoryStatus: '',
    kycDocuments: [] as string[],
    complianceFramework: ''
  })

  const onboardingSteps = [
    {
      id: 1,
      title: "Entity Information",
      description: "Basic institutional details and licensing",
      icon: Building2,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending'
    },
    {
      id: 2,
      title: "KYC & Compliance",
      description: "Document verification and regulatory compliance",
      icon: FileCheck,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending'
    },
    {
      id: 3,
      title: "Risk Assessment",
      description: "Financial profile and risk evaluation",
      icon: Shield,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending'
    },
    {
      id: 4,
      title: "Technical Integration",
      description: "Wallet setup and smart contract integration",
      icon: Lock,
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending'
    },
    {
      id: 5,
      title: "Final Approval",
      description: "Review and whitelist activation",
      icon: Award,
      status: currentStep === 5 ? 'active' : 'pending'
    }
  ]

  const institutionalFeatures = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Multi-party computation (MPC) wallets with hardware security modules"
    },
    {
      icon: FileCheck,
      title: "Automated Compliance",
      description: "Real-time AML/KYC monitoring with regulatory reporting"
    },
    {
      icon: BarChart3,
      title: "Risk Analytics",
      description: "AI-powered risk assessment with real-time collateral monitoring"
    },
    {
      icon: Globe,
      title: "Multi-Jurisdiction",
      description: "Compliant operations across US, EU, and UK regulatory frameworks"
    }
  ]

  const platformBenefits = [
    {
      metric: "$250.56B+",
      label: "Gold Certificate Backing",
      description: "US federal gold certificates provide unprecedented asset security"
    },
    {
      metric: "150-200%",
      label: "Overcollateralization",
      description: "Conservative LTV ratios protect lender investments"
    },
    {
      metric: "99.9%",
      label: "Platform Uptime",
      description: "Enterprise-grade infrastructure with 24/7 monitoring"
    },
    {
      metric: "3:1",
      label: "Gold Certificate Leverage",
      description: "USDGB stakers hold 3x gold certificate value on balance sheet"
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Entity Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Entity Name *</label>
                <input
                  type="text"
                  value={formData.entityName}
                  onChange={(e) => handleInputChange('entityName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  placeholder="ABC Capital Management LLC"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Entity Type *</label>
                <select
                  value={formData.entityType}
                  onChange={(e) => handleInputChange('entityType', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select entity type</option>
                  <option value="bank">Commercial Bank</option>
                  <option value="credit_union">Credit Union</option>
                  <option value="investment_firm">Investment Firm</option>
                  <option value="hedge_fund">Hedge Fund</option>
                  <option value="family_office">Family Office</option>
                  <option value="pension_fund">Pension Fund</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Regulatory License Number *</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  placeholder="FDIC Certificate #12345"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Primary Jurisdiction *</label>
                <select
                  value={formData.jurisdiction}
                  onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select jurisdiction</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="eu">European Union</option>
                  <option value="singapore">Singapore</option>
                  <option value="switzerland">Switzerland</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Business Address *</label>
                <textarea
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  rows={3}
                  placeholder="123 Financial Street, New York, NY 10005, USA"
                />
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">KYC & Compliance Documentation</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Upload className="h-5 w-5 text-amber-400 mr-2" />
                  Required Documents
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-green-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Articles of Incorporation</p>
                        <p className="text-gray-400 text-sm">Legal entity formation documents</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
                      Upload
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-yellow-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Regulatory Licenses</p>
                        <p className="text-gray-400 text-sm">Current banking/financial services licenses</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
                      Upload
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-yellow-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">Beneficial Ownership Disclosure</p>
                        <p className="text-gray-400 text-sm">Ultimate beneficial owners (25%+ ownership)</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
                      Upload
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-yellow-400 mr-3" />
                      <div>
                        <p className="text-white font-medium">AML/KYC Policies</p>
                        <p className="text-gray-400 text-sm">Current compliance framework documentation</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Risk Profile Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Assets Under Management (AUM) *</label>
                <select
                  value={formData.aum}
                  onChange={(e) => handleInputChange('aum', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select AUM range</option>
                  <option value="100m-500m">$100M - $500M</option>
                  <option value="500m-1b">$500M - $1B</option>
                  <option value="1b-5b">$1B - $5B</option>
                  <option value="5b-10b">$5B - $10B</option>
                  <option value="10b+">$10B+</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Years in Business *</label>
                <select
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select experience</option>
                  <option value="1-5">1-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10-20">10-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Lending Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">150-200%</div>
                  <div className="text-gray-300 text-sm">Collateralization Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">5-12%</div>
                  <div className="text-gray-300 text-sm">Target APR Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">70%</div>
                  <div className="text-gray-300 text-sm">Maximum LTV</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Technical Integration</h3>
            <div className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Wallet className="h-5 w-5 text-amber-400 mr-2" />
                  Institutional Wallet Setup
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Multi-Party Computation (MPC) Wallet</p>
                      <p className="text-gray-400 text-sm">Enterprise-grade key management with distributed signatures</p>
                    </div>
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">Configured</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Hardware Security Module (HSM)</p>
                      <p className="text-gray-400 text-sm">Dedicated hardware for cryptographic operations</p>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Smart Contract Integration</p>
                      <p className="text-gray-400 text-sm">Automated lending and collateral management</p>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
                      Deploy
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">API Integration</h4>
                <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400"># Initialize GoldBackBond API client</div>
                  <div className="text-white">curl -X POST https://api.goldbackbond.com/v1/lender/initialize \\</div>
                  <div className="text-white ml-4">-H "Authorization: Bearer YOUR_API_KEY" \\</div>
                  <div className="text-white ml-4">-H "Content-Type: application/json"</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Final Review & Approval</h3>
            <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg p-6 border border-emerald-500/30">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-400 mr-3" />
                <div>
                  <h4 className="text-xl font-semibold text-white">Onboarding Complete</h4>
                  <p className="text-gray-300">Your institutional lender account is ready for activation</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h5 className="font-semibold text-white">Account Details:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lender ID:</span>
                      <span className="text-white">GBB-LEND-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Whitelist Status:</span>
                      <span className="text-emerald-400">Approved</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Lending Capacity:</span>
                      <span className="text-white">$50M (initial)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Go-Live Date:</span>
                      <span className="text-white">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-semibold text-white">Next Steps:</h5>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                      <span>Fund institutional wallet</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                      <span>Complete final API testing</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                      <span>Schedule go-live date</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                      <span>Begin lending operations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Institutional Lender
              </span>
              <br />
              <span className="text-white">Onboarding</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join the next generation of institutional DeFi lending with enterprise-grade security, 
              regulatory compliance, and gold-backed collateral protection.
            </p>
          </motion.div>

          {/* Platform Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {platformBenefits.map((benefit, index) => (
              <div key={index} className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">{benefit.metric}</div>
                <div className="text-lg font-semibold text-white mb-2">{benefit.label}</div>
                <div className="text-gray-300 text-sm">{benefit.description}</div>
              </div>
            ))}
          </motion.div>

          {/* Institutional Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {institutionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
                  <Icon className="h-8 w-8 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Onboarding Process */}
      <div className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Streamlined Onboarding Process</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our enterprise-grade onboarding ensures compliance, security, and rapid deployment 
              for institutional lenders.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {onboardingSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        step.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500'
                          : step.status === 'active'
                          ? 'bg-amber-500 border-amber-500'
                          : 'bg-slate-700 border-slate-600'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <Icon className={`h-6 w-6 ${
                          step.status === 'active' ? 'text-slate-900' : 'text-gray-400'
                        }`} />
                      )}
                    </div>
                    {index < onboardingSteps.length - 1 && (
                      <div className={`w-16 h-0.5 ${
                        step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                Step {currentStep} of {onboardingSteps.length}
              </span>
              
              {currentStep < onboardingSteps.length ? (
                <button
                  onClick={() => setCurrentStep(Math.min(onboardingSteps.length, currentStep + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-lg font-medium hover:from-amber-400 hover:to-yellow-500 transition-all duration-200 flex items-center"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg font-medium hover:from-emerald-400 hover:to-blue-500 transition-all duration-200 flex items-center">
                  Complete Onboarding
                  <CheckCircle className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Technical Documentation</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comprehensive guides and resources for institutional integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
              <Download className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">API Documentation</h3>
              <p className="text-gray-300 text-sm mb-4">Complete API reference for institutional lending integration</p>
              <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors">
                Download PDF
              </button>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
              <FileCheck className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Compliance Framework</h3>
              <p className="text-gray-300 text-sm mb-4">Regulatory requirements and compliance procedures</p>
              <button className="w-full px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                View Guidelines
              </button>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6">
              <Lock className="h-8 w-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Security Protocols</h3>
              <p className="text-gray-300 text-sm mb-4">Enterprise security implementation and best practices</p>
              <button className="w-full px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors">
                Security Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LenderOnboardingPage
