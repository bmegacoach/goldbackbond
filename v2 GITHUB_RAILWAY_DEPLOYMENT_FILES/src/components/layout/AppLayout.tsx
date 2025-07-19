/**
 * AppLayout - Layout specifically for the DeFi dApp interface
 * Focused on functionality and user actions within the application
 */

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

import AppNavbar from './AppNavbar'



interface AppLayoutProps {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* App-specific Navigation */}
      <AppNavbar />
      
      {/* App Content */}
      <main className="relative">
        {children}
      </main>

      {/* App Footer - Minimal and functional */}
      <footer className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-sm">GB</span>
                </div>
                <span className="text-white font-semibold">GoldBackBond App</span>
              </div>
              <div className="h-4 w-px bg-slate-600"></div>
              <span className="text-gray-400 text-sm">DeFi Protocol</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="/docs" className="hover:text-amber-400 transition-colors">Documentation</a>
              <a href="/support" className="hover:text-amber-400 transition-colors">Support</a>
              <a href="/audit" className="hover:text-amber-400 transition-colors">Audit Reports</a>
              <a href="/" className="hover:text-amber-400 transition-colors">← Back to Homepage</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout