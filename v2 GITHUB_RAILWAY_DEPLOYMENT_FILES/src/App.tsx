import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Web3Provider } from './components/Web3Provider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import FloatingChatButton from './components/FloatingChatButton'
import AppLayout from './components/layout/AppLayout'
import DemoRedirectPage from './components/DemoRedirectPage'


// Import marketing pages
import HomePage from './components/pages/HomePage'
import WhitepaperPage from './components/pages/WhitepaperPage'
import ContactPage from './components/pages/ContactPage'
import TermsPage from './components/pages/TermsPage'
import PrivacyPage from './components/pages/PrivacyPage'
import BonusProgramPage from './components/pages/BonusProgramPage'
import MultichainPage from './components/pages/MultichainPage'

// Import institutional/lender pages 
import EnhancedLenderDashboard from './components/pages/EnhancedLenderDashboard'
import LenderOnboardingPage from './components/pages/LenderOnboardingPage'
import APIDocumentationPortal from './components/pages/APIDocumentationPortal'
import IntegrationPortalPage from './components/pages/IntegrationPortalPage'
import WebhookMonitoringPortal from './components/pages/WebhookMonitoringPortal'

// Import dApp pages
import AppDashboard from './components/pages/AppDashboard'
import StakingPage from './components/pages/StakingPage'
import LendingPage from './components/pages/LendingPage'
import AssetManagementDashboard from './components/pages/AssetManagementDashboard'

// Marketing site layout component
const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
    <AnimatedBackground />
    <div className="relative z-10">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingChatButton />
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Web3Provider>
        <Router>
          <Routes>
            {/* DeFi Application Routes - Separate Layout */}
            <Route 
              path="/app/*" 
              element={
                <AppLayout>
                  <Routes>
                    <Route index element={<AppDashboard />} />
                    <Route path="asset-management" element={<AssetManagementDashboard />} />
                    <Route path="stake" element={<StakingPage />} />
                    <Route path="lend" element={<LendingPage />} />
                    <Route path="analytics" element={<div className="p-8 text-center text-white">Analytics Dashboard Coming Soon</div>} />
                    <Route path="portfolio" element={<div className="p-8 text-center text-white">Portfolio Management Coming Soon</div>} />
                    
                    {/* Lender Hub Integration Pages - App Only */}
                    <Route path="lender-dashboard" element={<EnhancedLenderDashboard />} />
                    <Route path="lender-onboarding" element={<LenderOnboardingPage />} />
                    <Route path="api-docs" element={<APIDocumentationPortal />} />
                    <Route path="integration-portal" element={<IntegrationPortalPage />} />
                    <Route path="webhook-monitoring" element={<WebhookMonitoringPortal />} />
                  </Routes>
                </AppLayout>
              } 
            />
            
            {/* Marketing Site Routes - Traditional Layout */}
            <Route path="/" element={<MarketingLayout><HomePage /></MarketingLayout>} />
            <Route path="/whitepaper" element={<MarketingLayout><WhitepaperPage /></MarketingLayout>} />
            <Route path="/contact" element={<MarketingLayout><ContactPage /></MarketingLayout>} />
            <Route path="/terms" element={<MarketingLayout><TermsPage /></MarketingLayout>} />
            <Route path="/privacy" element={<MarketingLayout><PrivacyPage /></MarketingLayout>} />
            <Route path="/bonus-program" element={<MarketingLayout><BonusProgramPage /></MarketingLayout>} />
            <Route path="/multichain" element={<MarketingLayout><MultichainPage /></MarketingLayout>} />
            
            {/* Legacy/Marketing staking and lending pages - redirect to app */}
            <Route path="/staking" element={<MarketingLayout><StakingPage /></MarketingLayout>} />
            <Route path="/lending" element={<MarketingLayout><LendingPage /></MarketingLayout>} />
            
            {/* Demo Pages - Redirect to App */}
            <Route path="/enhanced-lender-dashboard" element={<MarketingLayout><div className="min-h-screen flex items-center justify-center"><DemoRedirectPage title="Enhanced Lender Dashboard" target="/app/lender-dashboard" /></div></MarketingLayout>} />
            <Route path="/lender-onboarding" element={<MarketingLayout><div className="min-h-screen flex items-center justify-center"><DemoRedirectPage title="Lender Onboarding" target="/app/lender-onboarding" /></div></MarketingLayout>} />
            <Route path="/api-documentation" element={<MarketingLayout><div className="min-h-screen flex items-center justify-center"><DemoRedirectPage title="API Documentation" target="/app/api-docs" /></div></MarketingLayout>} />
            <Route path="/integration-portal" element={<MarketingLayout><div className="min-h-screen flex items-center justify-center"><DemoRedirectPage title="Integration Portal" target="/app/integration-portal" /></div></MarketingLayout>} />
            <Route path="/webhook-monitoring" element={<MarketingLayout><div className="min-h-screen flex items-center justify-center"><DemoRedirectPage title="Webhook Monitoring" target="/app/webhook-monitoring" /></div></MarketingLayout>} />
            
            {/* Fallback to homepage */}
            <Route path="*" element={<MarketingLayout><HomePage /></MarketingLayout>} />
          </Routes>
          <Toaster />
        </Router>
      </Web3Provider>
    </ErrorBoundary>
  )
}

export default App