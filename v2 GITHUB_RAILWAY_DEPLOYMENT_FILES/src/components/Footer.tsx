import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coins, Facebook, Send, Twitter } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Home', href: '/' },
      { name: 'Staking', href: '/staking' },
      { name: 'Whitepaper', href: '/whitepaper' },
      { name: 'Multi-Chain', href: '/multichain' },
      { name: '🚀 Bonus Program', href: '/bonus-program', highlight: true },
    ],
    institutional: [
      { name: 'Lender Dashboard', href: '/enhanced-lender-dashboard' },
      { name: 'Lender Onboarding', href: '/lender-onboarding' },
      { name: 'API Documentation', href: '/api-documentation' },
      { name: 'Integration Portal', href: '/integration-portal' },
      { name: 'Webhook Monitoring', href: '/webhook-monitoring' },
    ],
    resources: [
      { name: 'Documentation', href: '/whitepaper' },
      { name: 'Support', href: '/contact' },
      { name: 'Audit Reports', href: '/whitepaper' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Telegram', icon: Send, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
  ]

  return (
    <footer className="bg-slate-900 border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/goldbackbond-transparent.png" 
                alt="GoldBackBond" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                GoldBackBond
              </span>
            </Link>
            <p className="text-gray-400 text-xs mb-4">
              World's Largest Reserve Stablecoin backed by physical gold certificates on Base Chain.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 hover:bg-amber-500/20 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-sm transition-colors ${
                      link.highlight 
                        ? 'text-amber-400 hover:text-amber-300 font-semibold animate-pulse' 
                        : 'text-gray-400 hover:text-amber-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional/Lender Hub */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Lender Hub</h3>
            <ul className="space-y-2">
              {footerLinks.institutional.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-amber-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} GoldBackBond. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Trading 24/7</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Built on Base Chain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
