import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Shield, 
  Scale, 
  Globe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface TermsData {
  features: Array<{
    name: string
    description: string
  }>
  temporal_info: {
    effective_date: string
  }
  geographical_data: {
    controlling_entity_location: string
    governing_law: string
    exclusive_jurisdiction: string
  }
}

const TermsPage = () => {
  const [termsData, setTermsData] = useState<TermsData | null>(null)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    // Load terms data
    fetch('/data/goldbackbond_terms.json')
      .then(response => response.json())
      .then(data => setTermsData(data))
      .catch(error => console.error('Error loading terms data:', error))
  }, [])

  const navigationSections = [
    { id: 'overview', title: 'Overview', icon: Info },
    { id: 'agreement', title: 'Agreement', icon: FileText },
    { id: 'license', title: 'License', icon: Shield },
    { id: 'conduct', title: 'User Conduct', icon: Scale },
    { id: 'legal', title: 'Legal Compliance', icon: Globe },
    { id: 'disputes', title: 'Dispute Resolution', icon: Scale }
  ]

  const getFeaturesByCategory = (category: string) => {
    if (!termsData?.features) return []
    
    const categoryMap: { [key: string]: string[] } = {
      agreement: ['Agreement Acceptance', 'Age Requirement'],
      license: ['License to Use Site', 'License Restrictions', 'Security'],
      conduct: ['User Conduct', 'User Submissions and Feedback'],
      legal: ['Legal Compliance', 'Disclaimer of Warranties & Acknowledgement of Risk', 'Limitation of Liability', 'Indemnification'],
      disputes: ['Dispute Resolution: Binding Arbitration and Class Action Waiver']
    }
    
    const relevantFeatures = categoryMap[category] || []
    return termsData.features.filter(feature => 
      relevantFeatures.includes(feature.name)
    )
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                Terms & Conditions
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our services
            </p>
            
            {termsData?.temporal_info?.effective_date && (
              <div className="mt-8 inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-6 py-3">
                <Calendar className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-medium">
                  Effective Date: {termsData.temporal_info.effective_date}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6">Table of Contents</h3>
                <nav className="space-y-2">
                  {navigationSections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-gray-300 hover:bg-slate-700/50 hover:text-amber-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{section.title}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 space-y-12"
            >
              {/* Overview Section */}
              <div id="overview" className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Info className="h-8 w-8 text-amber-400 mr-3" />
                  Overview
                </h2>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-6">
                    These Terms and Conditions govern your use of the GoldBackBond website and services. 
                    By accessing or using our platform, you agree to be bound by these terms.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h4 className="font-semibold text-green-400">What You Get</h4>
                      </div>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Access to USDGB trading platform</li>
                        <li>• Premium staking and lending features</li>
                        <li>• Multi-chain bridge functionality</li>
                        <li>• 24/7 customer support</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <h4 className="font-semibold text-amber-400">Your Responsibilities</h4>
                      </div>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Comply with all applicable laws</li>
                        <li>• Maintain account security</li>
                        <li>• Provide accurate information</li>
                        <li>• Use services responsibly</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Key Information */}
                {termsData?.geographical_data && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <Globe className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <h4 className="font-semibold text-white mb-1">Governing Law</h4>
                      <p className="text-gray-400 text-sm">{termsData.geographical_data.governing_law}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <Scale className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                      <h4 className="font-semibold text-white mb-1">Jurisdiction</h4>
                      <p className="text-gray-400 text-sm">{termsData.geographical_data.exclusive_jurisdiction}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <h4 className="font-semibold text-white mb-1">Entity Location</h4>
                      <p className="text-gray-400 text-sm">{termsData.geographical_data.controlling_entity_location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Agreement Section */}
              <div id="agreement" className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <FileText className="h-8 w-8 text-amber-400 mr-3" />
                  Agreement Terms
                </h2>
                
                <div className="space-y-6">
                  {getFeaturesByCategory('agreement').map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-amber-400 pl-6"
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.name}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* License Section */}
              <div id="license" className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Shield className="h-8 w-8 text-amber-400 mr-3" />
                  License & Security
                </h2>
                
                <div className="space-y-6">
                  {getFeaturesByCategory('license').map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-amber-400 pl-6"
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.name}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* User Conduct Section */}
              <div id="conduct" className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Scale className="h-8 w-8 text-amber-400 mr-3" />
                  User Conduct
                </h2>
                
                <div className="space-y-6">
                  {getFeaturesByCategory('conduct').map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-amber-400 pl-6"
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.name}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Legal Compliance Section */}
              <div id="legal" className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Globe className="h-8 w-8 text-amber-400 mr-3" />
                  Legal Compliance
                </h2>
                
                <div className="space-y-6">
                  {getFeaturesByCategory('legal').map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={ { delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-amber-400 pl-6"
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.name}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Dispute Resolution Section */}
              <div id="disputes" className="bg-slate-800/60 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <Scale className="h-8 w-8 text-red-400 mr-3" />
                  Dispute Resolution
                </h2>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h4 className="font-semibold text-red-400">Important Notice</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    This section contains mandatory arbitration and class action waiver provisions that affect your legal rights.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {getFeaturesByCategory('disputes').map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-red-400 pl-6"
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.name}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
                <p className="text-gray-300 mb-6">
                  If you have any questions about these Terms and Conditions, please don't hesitate to contact us.
                </p>
                <div className="flex justify-center">
                  <Link
                    to="/contact"
                    className="bg-amber-500/20 text-amber-400 px-6 py-3 rounded-lg font-medium hover:bg-amber-500/30 transition-colors"
                  >
                    Contact Form
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
