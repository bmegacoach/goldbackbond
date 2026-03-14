/**
 * GenesisBankPage — Genesis Bank and Trust institutional lender module
 * Shows active on-chain registration + Coming Soon functionality
 */

import { motion } from 'framer-motion'
import { Building2, Shield, CheckCircle2, Clock, ExternalLink, ArrowLeft, Landmark, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CONTRACTS } from '../../lib/contractAddresses'

const GENESIS_BANK_ADDRESS = '0xc2FF845095ADC1EE93c93Bec0c33a538D0208407'

const features = [
  {
    icon: Landmark,
    title: 'Institutional Lending',
    description: 'High-volume USDGB token lending with bespoke terms and dedicated relationship management.',
    status: 'coming-soon',
  },
  {
    icon: Shield,
    title: 'Compliance Dashboard',
    description: 'Real-time KYC/AML status, transaction monitoring, and regulatory reporting tools.',
    status: 'coming-soon',
  },
  {
    icon: Lock,
    title: 'Collateral Management',
    description: 'On-chain collateral tracking, automated margin calls, and liquidation protection.',
    status: 'coming-soon',
  },
]

const GenesisBankPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-4 mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Genesis Bank and Trust</h1>
            <p className="text-amber-400 text-sm font-medium mt-0.5">Institutional Lender — Base Mainnet</p>
          </div>
        </div>
      </motion.div>

      {/* On-chain registration status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-slate-800/60 border border-amber-500/20 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">On-Chain Registration Active</span>
            </div>
            <h2 className="text-white font-bold text-lg">LenderRegistry</h2>
            <p className="text-gray-400 text-sm mt-1">
              Genesis Bank and Trust is an approved lender in the GoldBackBond protocol, verified on Base Mainnet.
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <a
              href={`https://basescan.org/address/${CONTRACTS.LENDER_REGISTRY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 transition-colors text-sm"
            >
              <span>View Registry</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://basescan.org/address/${GENESIS_BANK_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-gray-400 hover:text-gray-300 transition-colors text-xs"
            >
              <span>{GENESIS_BANK_ADDRESS.slice(0, 6)}...{GENESIS_BANK_ADDRESS.slice(-4)}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/50">
          {[
            { label: 'Status', value: 'Approved', color: 'text-green-400' },
            { label: 'Network', value: 'Base Mainnet', color: 'text-amber-400' },
            { label: 'Lender Type', value: 'Institutional', color: 'text-blue-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <div className={`font-bold text-sm ${color}`}>{value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Coming Soon features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Coming Soon</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 relative overflow-hidden"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-xs text-amber-500/70 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Soon
                  </span>
                </div>
                <div className="w-10 h-10 bg-slate-700/60 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-amber-400/70" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10 p-6 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-2xl text-center"
      >
        <h3 className="text-white font-bold text-lg mb-2">Institutional Access</h3>
        <p className="text-gray-400 text-sm mb-4">
          Genesis Bank and Trust institutional lending features are in active development. Contact us for priority access.
        </p>
        <a
          href="https://goldbackbond.com/contact"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          <span>Request Early Access</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  )
}

export default GenesisBankPage
