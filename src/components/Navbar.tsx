import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Coins, BarChart3, Users, Globe, Gift } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Home', href: '/', icon: Coins },
    { name: 'Staking', href: '/staking', icon: BarChart3 },
    { name: 'Lending', href: '/lending', icon: Users },
    { name: '🚀 Bonus Program', href: '/bonus-program', icon: Gift, highlight: true },
    { name: 'Multi-Chain', href: '/multichain', icon: Globe },
    { name: 'Contact', href: '/contact', icon: null },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-amber-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center min-w-0 mr-8">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/images/goldbackbond-transparent.png" 
                alt="GoldBackBond" 
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent whitespace-nowrap">
                GoldBackBond
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 justify-center">
            {/* Main Navigation */}
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-amber-400 bg-amber-400/10'
                      : item.highlight
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 animate-pulse'
                      : 'text-gray-300 hover:text-amber-400 hover:bg-amber-400/5'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {/* CTA Button - FULLY VISIBLE when modal is active */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/app')}
              className="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-xs shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25"
            >
              <span className="whitespace-nowrap font-bold">
                LAUNCH APP
              </span>
            </motion.button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-amber-400 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="lg:hidden overflow-hidden bg-slate-800/95 backdrop-blur-sm border-t border-amber-500/20"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* Navigation */}
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-amber-400 bg-amber-400/10'
                    : item.highlight
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 animate-pulse'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-amber-400/5'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            )
          })}

          <div className="pt-4 pb-2">
            <button 
              onClick={() => {
                navigate('/app')
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 rounded-lg font-semibold text-sm shadow-xl transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25"
            >
              <span className="font-bold">
                LAUNCH APP
              </span>
            </button>
          </div>
        </div>
      </motion.div>


    </nav>
  )
}

export default Navbar