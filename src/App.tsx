import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Web3Provider } from './components/Web3Provider'
import { ToastProvider } from './components/ToastProvider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import FloatingChatButton from './components/FloatingChatButton'
import AppLayout from './components/layout/AppLayout'


// Import marketing pages
import HomePage from './components/pages/HomePage'
import WhitepaperPage from './components/pages/WhitepaperPage'
import PlatformUsersPage from './components/pages/PlatformUsersPage'
import FaqPage from './components/pages/FaqPage'
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
import AllocationApprovalPage from './components/pages/AllocationApprovalPage'
import StakingPage from './components/pages/StakingPage'
import LendingPage from './components/pages/LendingPage'
import AssetManagementDashboard from './components/pages/AssetManagementDashboard'
import ComingSoonPage from './components/pages/ComingSoonPage'
import { BuyWizardPage } from './components/pages/BuyWizardPage'

// Marketing site layout component
const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-x-clip">
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
        <ToastProvider>
          <Router>
            <Routes>
              {/* DeFi Application Routes - Separate Layout */}
              <Route
                path="/app/*"
                element={
                  <AppLayout>
                    <Routes>
                      <Route index element={<AppDashboard />} />
                      <Route path="buy-wizard" element={<BuyWizardPage />} />
                      <Route path="asset-management" element={<AssetManagementDashboard />} />
                      <Route path="stake" element={<StakingPage />} />
                      <Route path="lend" element={<LendingPage />} />
                      <Route path="analytics" element={<ComingSoonPage title="Analytics Dashboard" description="Advanced analytics and reporting tools are being built." />} />
                      <Route path="portfolio" element={<ComingSoonPage title="Portfolio Management" description="Track and manage your DeFi positions in one place." />} />

                      {/* Lender Hub Integration Pages - App Only */}
                      <Route path="lender-dashboard" element={<EnhancedLenderDashboard />} />
                      <Route path="lender-onboarding" element={<LenderOnboardingPage />} />
                      <Route path="api-docs" element={<APIDocumentationPortal />} />
                      <Route path="integration-portal" element={<IntegrationPortalPage />} />
                      <Route path="webhook-monitoring" element={<WebhookMonitoringPortal />} />

                      {/* Admin / Issuance routes */}
                      <Route path="allocations" element={<AllocationApprovalPage />} />
                    </Routes>
                  </AppLayout>
                }
              />

              {/* Marketing Site Routes - Traditional Layout */}
              <Route path="/" element={<MarketingLayout><HomePage /></MarketingLayout>} />
              <Route path="/whitepaper" element={<MarketingLayout><WhitepaperPage /></MarketingLayout>} />
              <Route path="/users-manual" element={<MarketingLayout><PlatformUsersPage /></MarketingLayout>} />
              <Route path="/faq" element={<MarketingLayout><FaqPage /></MarketingLayout>} />
              <Route path="/contact" element={<MarketingLayout><ContactPage /></MarketingLayout>} />
              <Route path="/terms" element={<MarketingLayout><TermsPage /></MarketingLayout>} />
              <Route path="/privacy" element={<MarketingLayout><PrivacyPage /></MarketingLayout>} />
              <Route path="/bonus-program" element={<MarketingLayout><BonusProgramPage /></MarketingLayout>} />
              <Route path="/multichain" element={<MarketingLayout><MultichainPage /></MarketingLayout>} />

              {/* Legacy/Marketing staking and lending pages - redirect to app */}
              <Route path="/staking" element={<MarketingLayout><StakingPage /></MarketingLayout>} />
              <Route path="/lending" element={<MarketingLayout><LendingPage /></MarketingLayout>} />

              {/* Legacy Routes - Redirect to App */}
              <Route path="/enhanced-lender-dashboard" element={<Navigate to="/app/lender-dashboard" replace />} />
              <Route path="/lender-onboarding" element={<Navigate to="/app/lender-onboarding" replace />} />
              <Route path="/api-documentation" element={<Navigate to="/app/api-docs" replace />} />
              <Route path="/integration-portal" element={<Navigate to="/app/integration-portal" replace />} />
              <Route path="/webhook-monitoring" element={<Navigate to="/app/webhook-monitoring" replace />} />

              {/* Fallback to homepage */}
              <Route path="*" element={<MarketingLayout><HomePage /></MarketingLayout>} />
            </Routes>
            <Toaster />
          </Router>
        </ToastProvider>
      </Web3Provider>
    </ErrorBoundary>
  )
}

export default App