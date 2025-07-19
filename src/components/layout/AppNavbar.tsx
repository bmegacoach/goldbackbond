/**
 * AppNavbar - Navigation specifically for the DeFi dApp
 * Focused on functional navigation within the application
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home,
  Lock,
  DollarSign,
  BarChart3,
  Settings,
  ArrowLeft,
  Wallet,
  Shield
} from 'lucide-react'
import { useAccount } from 'wagmi'
import WalletStatus from '../WalletStatus'

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isConnected } = useAccount()

  const isActive = (path: string) => {
    if (path.includes('?')) {
      const [pathname, query] = path.split('?')
      return location.pathname === pathname && location.search.includes(query)
    }
    return location.pathname === path
  }

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Stake', href: '/app/asset-management?tab=staking', icon: Lock },
    { name: 'Lending', href: '/app/asset-management?tab=lending', icon: DollarSign },
    { name: 'Analytics', href: '/app/asset-management?tab=analytics', icon: BarChart3 }
  ]

  return (
    <nav className="bg-slate-800/95 backdrop-blur-sm border-b border-amber-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/app" className="flex items-center space-x-2 group">
              <img 
                src="/images/goldbackbond-transparent.png" 
                alt="GoldBackBond" 
                className="w-8 h-8 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <span className="text-white font-bold text-xl">GoldBackBond</span>
                <div className="text-xs text-amber-400 font-medium">DeFi App</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20'
                      : 'text-gray-300 hover:text-amber-400 hover:bg-amber-400/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Wallet Status and Controls */}
          <div className="flex items-center space-x-4">
            {/* Back to Marketing Site */}
            <Link
              to="/"
              className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Homepage</span>
            </Link>

            {/* Wallet Connection */}
            <WalletStatus />

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50">
              <Settings className="h-5 w-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-amber-400 transition-colors p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="lg:hidden overflow-hidden bg-slate-800/95 backdrop-blur-sm border-t border-amber-500/20"
      >
        <div className="px-4 py-3 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-amber-400/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
          
          <div className="pt-2 border-t border-slate-700">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  )
}

export default AppNavbar