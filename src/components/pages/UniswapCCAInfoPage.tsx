import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Zap,
  BarChart3,
  Shield,
  Clock,
  TrendingUp,
  Coins,
  Lock,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Globe,
  Star,
  Layers,
  ChevronRight
} from 'lucide-react'

const UniswapCCAInfoPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  }
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900 to-emerald-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            {/* Live Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-full px-5 py-2 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2" />
              <span className="text-emerald-400 text-sm font-semibold tracking-wide">LIVE: March 15 – April 31, 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Uniswap CCA
              </span>
              <br />
              <span className="text-white">× Goldbackbond</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The Goldbackbond USDGB token is launching via a <strong className="text-white">Uniswap Concentrated Capital Auction</strong> — 
              the most transparent, permissionless, and fair method for bootstrapping deep on-chain liquidity for a new token.
            </p>
          </motion.div>

          {/* Key Numbers */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { value: '$0.80', label: 'Pre-Sale Price', sublabel: '20% below $1.00 NAV', color: 'text-amber-400', border: 'border-amber-500/30' },
              { value: '$25M–$35M', label: 'Liquidity Target', sublabel: 'Initial pool depth', color: 'text-violet-400', border: 'border-violet-500/30' },
              { value: '9% APR', label: 'Staking Rewards', sublabel: 'Current program target', color: 'text-emerald-400', border: 'border-emerald-500/30' },
              { value: '70% LTV', label: 'Borrow Access', sublabel: 'Via Genesis Bank & Trust', color: 'text-blue-400', border: 'border-blue-500/30' },
            ].map((stat, i) => (
              <div key={i} className={`bg-slate-800/60 backdrop-blur-sm border ${stat.border} rounded-2xl p-5 text-center`}>
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-gray-400 text-xs">{stat.sublabel}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* What is a CCA? */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                What Is a Uniswap <span className="text-violet-400">CCA?</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                A <strong className="text-white">Concentrated Capital Auction (CCA)</strong> is a Uniswap v4-native liquidity bootstrapping mechanism 
                that replaces traditional token launch methods. Instead of selling tokens to VCs at discounts and dumping on retail, 
                the CCA lets the <em>market</em> discover the fair clearing price on-chain — transparently and permissionlessly.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                The auction aggregates buyer bids across a price range, then automatically seeds a deep, stable Uniswap 
                liquidity pool at the market-clearing price. This creates immediate real on-chain liquidity — not artificial 
                market-making — from day one.
              </p>

              {/* CCA vs Traditional Launch */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 text-xs font-semibold">
                  <div className="bg-red-500/10 border-r border-slate-700/50 p-3 text-red-400 text-center">Traditional IDO Launch</div>
                  <div className="bg-violet-500/10 p-3 text-violet-400 text-center">Uniswap CCA Launch ✓</div>
                </div>
                {[
                  ['VC allocations at huge discounts', 'Market discovers fair price on-chain'],
                  ['Bots front-run retail buyers', 'Batch clearing — everyone pays same price'],
                  ['Thin liquidity on day 1', 'Deep pool seeded automatically at clearing price'],
                  ['Token price set by insider', 'Set by aggregate public demand'],
                  ['Opaque, trust-based', 'Permissionless, fully on-chain, auditable'],
                ].map(([bad, good], i) => (
                  <div key={i} className="grid grid-cols-2 border-t border-slate-700/50">
                    <div className="p-3 text-gray-400 text-xs border-r border-slate-700/50 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{bad}
                    </div>
                    <div className="p-3 text-gray-300 text-xs flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>{good}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why CCA Is a <span className="text-emerald-400">Perfect Fit</span> for USDGB
              </h2>

              {[
                {
                  icon: Shield,
                  color: 'text-violet-400',
                  bg: 'bg-violet-500/10',
                  title: 'Stable NAV Requires Deep Liquidity',
                  body: 'USDGB is pegged to $1.00 worth of gold. Maintaining this NAV peg post-listing requires deep, stable on-chain liquidity. The CCA bootstraps $25M–$35M in pool depth from day one — far exceeding what most new tokens achieve in their first months.'
                },
                {
                  icon: BarChart3,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10',
                  title: 'Fair Price Discovery for a Gold-Backed Asset',
                  body: 'USDGB has real, verifiable backing (Trust Certificate Units, InterFi Security audit, multi-party attestation). The CCA lets the market confirm this value through open bidding at $0.85 → $0.90 → $0.95 → $1.00 tranches — validating upward momentum publicly and transparently.'
                },
                {
                  icon: Globe,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10',
                  title: 'Permissionless, Institutional-Grade Infrastructure',
                  body: 'Uniswap v4 on Base is battle-tested infrastructure securing billions in TVL. By launching via CCA, USDGB immediately inherits this security, composability, and institutional confidence — directly relevant for a token designed for institutional lending via Genesis Bank & Trust.'
                },
                {
                  icon: Lock,
                  color: 'text-amber-400',
                  bg: 'bg-amber-500/10',
                  title: 'Pre-Sale Lock Protects Public Buyers',
                  body: 'Pre-sale tokens are delivered in a staked (sUSDGB) state and locked during the CCA period to prevent dumping. This protects public CCA participants — ensuring early buyers can\'t suppress the fair-market clearing price during the auction window.'
                },
              ].map(({ icon: Icon, color, bg, title, body }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 mb-6 last:mb-0"
                >
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-1`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How the CCA Works - Step by Step */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              How the USDGB CCA Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A step-by-step breakdown of the Goldbackbond Uniswap CCA process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: DollarSign,
                color: 'text-amber-400',
                bg: 'from-amber-500/20 to-amber-600/10',
                border: 'border-amber-500/30',
                title: 'Pre-Sale at $0.80',
                body: 'Qualified buyers (Tier 1 KYC, min $10K) purchase USDGB at $0.80 during March 15 – April 31, 2026 — a 20% discount to the $1.00 NAV. Pre-sale tokens are delivered staked (sUSDGB) and locked during the CCA period.'
              },
              {
                step: '02',
                icon: BarChart3,
                color: 'text-violet-400',
                bg: 'from-violet-500/20 to-violet-600/10',
                border: 'border-violet-500/30',
                title: 'CCA Auction Opens on Uniswap',
                body: 'The CCA runs on Uniswap v4 (Base Mainnet). Public participants bid on USDGB across price tranches: $0.85, $0.90, $0.95, and $1.00. All bids are on-chain and publicly visible — no order front-running.'
              },
              {
                step: '03',
                icon: TrendingUp,
                color: 'text-emerald-400',
                bg: 'from-emerald-500/20 to-emerald-600/10',
                border: 'border-emerald-500/30',
                title: 'Market-Driven Price Discovery',
                body: 'Aggregate demand across all bidders determines the clearing price. The auction software calculates the highest price at which the entire auction allocation can be sold. Everyone pays the same final clearing price — no insider advantages.'
              },
              {
                step: '04',
                icon: Layers,
                color: 'text-blue-400',
                bg: 'from-blue-500/20 to-blue-600/10',
                border: 'border-blue-500/30',
                title: 'Deep Liquidity Pool Seeded',
                body: 'Upon auction close, proceeds automatically seed a concentrated Uniswap v4 USDGB/USDC liquidity pool targeting $25M–$35M depth. 60% of proceeds + matched USDGB are deposited into the pool — creating immediate, deep on-chain liquidity.'
              },
              {
                step: '05',
                icon: Coins,
                color: 'text-pink-400',
                bg: 'from-pink-500/20 to-pink-600/10',
                border: 'border-pink-500/30',
                title: 'Trading Goes Live',
                body: 'USDGB is immediately tradeable on Uniswap at the cleared market price. No artificial market-making. Arbitrageurs can enforce the $1.00 NAV peg through open-market trading without any restriction.'
              },
              {
                step: '06',
                icon: Star,
                color: 'text-amber-400',
                bg: 'from-amber-500/20 to-amber-600/10',
                border: 'border-amber-500/30',
                title: '$2M Rewards Pool Unlocks',
                body: 'Pre-sale buyers and CCA participants are pro-rata eligible for the $2M USDGB Rewards Pool, distributed at or after Hyperliquid listing (Q2 2026). Pre-sale tokens unlock for free trading once the CCA Auction period concludes.'
              },
            ].map(({ step, icon: Icon, color, bg, border, title, body }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-6 relative group hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-slate-800/80 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <span className="text-4xl font-black text-slate-700 group-hover:text-slate-600 transition-colors">{step}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Value Summary */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Pre-Sale Buyers Receive
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              The $0.80 pre-sale price during the CCA launch window represents the best pricing available in the Goldbackbond ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle, label: '$0.80 pre-list price — 20% below $1.00 NAV', sublabel: '125,000 USDGB per $100K (vs. 100,000 post-list)' },
              { icon: CheckCircle, label: '9% APR growth rewards on sUSDGB (current target)', sublabel: 'Earn $90K/year on $1M staked — while locked' },
              { icon: CheckCircle, label: '70% LTV institutional lending via Genesis Bank & Trust', sublabel: 'Borrow $700K against $1M in sUSDGB — keep rewards' },
              { icon: CheckCircle, label: 'Pro-rata share of $2M USDGB Rewards Pool', sublabel: 'Distributed at / after Hyperliquid listing (Q2 2026)' },
              { icon: CheckCircle, label: '15% Gold Bonus Rewards through Q2 2026', sublabel: 'Accrues when Trust Certificate Unit value appreciates' },
              { icon: CheckCircle, label: 'No price-based liquidation on sUSDGB positions', sublabel: 'Loss only via contractual default — not market volatility' },
            ].map(({ icon: Icon, label, sublabel }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 bg-slate-800/60 border border-slate-700/40 rounded-xl p-5"
              >
                <Icon className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium text-sm">{label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{sublabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Launch Timeline</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-emerald-500/50 to-blue-500/50" />
            {[
              { date: 'March 15, 2026', label: 'CCA Auction Opens', desc: 'Pre-sale window opens at $0.80/USDGB on Uniswap v4 (Base). Tier 1 KYC required. Min $10K.', color: 'bg-violet-500', active: true },
              { date: 'March 15 – April 31', label: 'Auction Window Active', desc: 'Public bidding across $0.85 → $0.90 → $0.95 → $1.00 tranches. $25M–$35M liquidity target.', color: 'bg-emerald-500', active: true },
              { date: 'April 31, 2026', label: 'CCA Auction Closes', desc: 'Clearing price set. Uniswap v4 pool seeded automatically. Pre-sale tokens unlock for free trading.', color: 'bg-amber-500', active: false },
              { date: 'Q2 2026', label: 'Hyperliquid Listing', desc: 'USDGB lists on Hyperliquid for institutional depth. $2M Rewards Pool distributed to eligible holders.', color: 'bg-blue-500', active: false },
              { date: 'Q3 2026', label: 'Railgun Privacy (Tier 3)', desc: 'Railgun shielded environment activates for fully KYC\'d Tier 2 users. No new token — same USDGB.', color: 'bg-purple-500', active: false },
              { date: 'Q4 2026+', label: 'CEX Listings', desc: 'MEXC listing Nov 1, 2026. BTCC/KuCoin/Binance targeted sequentially thereafter.', color: 'bg-pink-500', active: false },
            ].map(({ date, label, desc, color, active }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="relative flex gap-6 mb-8 last:mb-0"
              >
                <div className={`w-4 h-4 ${color} rounded-full flex-shrink-0 mt-1 z-10 shadow-lg ${active ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-slate-900' : ''}`} style={{ marginLeft: '24px' }} />
                <div className={`flex-1 bg-slate-800/60 border ${active ? 'border-emerald-500/40' : 'border-slate-700/40'} rounded-xl p-5`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold">{label}</span>
                    {active && <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE NOW</span>}
                  </div>
                  <div className="text-amber-400 text-xs font-medium mb-2">{date}</div>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-900/30 via-slate-900 to-emerald-900/20 border-t border-slate-700/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Participate?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              The Uniswap CCA Auction is live now. Pre-sale pricing at <strong className="text-amber-400">$0.80</strong> closes April 31, 2026.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/app">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-violet-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Zap className="h-5 w-5" />
                  Participate in CCA Auction
                </motion.button>
              </Link>
              <Link to="/whitepaper">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-amber-500 text-amber-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-500/10 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ChevronRight className="h-5 w-5" />
                  Read Full Whitepaper
                </motion.button>
              </Link>
            </div>

            <p className="text-gray-500 text-xs max-w-3xl mx-auto">
              USDGB and sUSDGB are digital utility tokens and are not securities. The 9% annualized growth reward on sUSDGB is a current program target funded by
              treasury-management activities; it is not a guaranteed return and may be modified for future staking programs. This page does not constitute an
              offer of securities. Minimum $10,000 allocation required. Tier 1 KYC required. Restricted in OFAC-sanctioned jurisdictions. Consult your financial,
              legal, and tax advisors before participating.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default UniswapCCAInfoPage
