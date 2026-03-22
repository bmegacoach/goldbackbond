import { ModuleLayout } from '../ModuleLayout';
import { CheckCircle2, XCircle, AlertTriangle, Gavel, Shield, Building2, Scale, FileCheck, Coins } from 'lucide-react';

export function Module2() {
  return (
    <ModuleLayout
      moduleId="module-2"
      moduleNumber={2}
      title="Sales Compliance Playbook"
      description="Product knowledge and critical compliance guidelines for operating in a regulated environment."
    >
      <div className="space-y-8">
        {/* USDGB Product Structure Section */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Coins className="w-6 h-6 text-gold-600" />
            USDGB Product Structure
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-neutral-900">Gold-Backed Token</h3>
              </div>
              <p className="text-sm text-neutral-600">
                Digital utility token backed by gold reserves at Federal Reserve Bank
              </p>
            </div>
            <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
              <div className="flex items-center gap-3 mb-2">
                <Scale className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-neutral-900">NAV Peg</h3>
              </div>
              <p className="text-sm text-neutral-600">
                1 USDGB = $1.00 USD worth of Gold at spot price
              </p>
            </div>
          </div>
        </section>

        {/* What USDGB IS */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-success" />
            What USDGB IS
          </h2>
          <ul className="space-y-3">
            {[
              'A digital utility token directly representing a pro-rata beneficial interest in Trust Certificate Units held by the USDGB Trust Fund',
              'Trust Certificate Units are backed by Series 1934 U.S. Federal Reserve Gold Certificates, associated intellectual property, and equity interests in Goldbackbond Inc.',
              'Can be held, traded on DEXs (Uniswap, Hyperliquid, Curve), or staked to become sUSDGB',
              'Pegged to $1.00 USD worth of gold at spot price (NAV target)',
              'Has NO legal, economic, or contractual relationship to Goldbackbond Secured Debentures',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-success/5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What USDGB IS NOT */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <XCircle className="w-6 h-6 text-error" />
            What USDGB IS NOT
          </h2>
          <ul className="space-y-3">
            {[
              'A security (no ownership in Goldbackbond Inc., LTD, or the USDGB Trust Fund)',
              'Backed by, derived from, or tied to Goldbackbond Secured Debentures',
              'A token whose value tracks Bloomberg bond market pricing',
              'Redeemable directly for physical gold or USD from Goldbackbond',
              'A dividend-paying investment',
              '"pUSDGB" is NOT a separate token — it is USDGB used within a Railgun-shielded environment',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-error/5 rounded-lg">
                <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Attestation Parties */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-gold-600" />
            Attestation Parties
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Rektor Law',
              'Senn Law',
              'Ex-Federal Reserve Board Member',
              'Federal Judge',
              'Wells Fargo Bank',
              'State of Pennsylvania',
            ].map((party, index) => (
              <div
                key={index}
                className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-center"
              >
                <span className="font-medium text-neutral-700">{party}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Three-Entity Structure */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-gold-600" />
            The Three-Entity Structure
          </h2>
          <p className="text-sm text-neutral-500 mb-4">Understanding who does what is critical to accurate compliance and sales conversations.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: 'USDGB Trust Fund',
                role: 'Asset Holder',
                desc: 'Holds Federal Reserve gold certificates, 100% of Goldbackbond Inc. corporate shares, and the IP portfolio. Issues Trust Certificates. Token holders do NOT own Trust assets.',
                color: 'border-gold-400 bg-gold-50',
              },
              {
                name: 'Goldbackbond LTD (Delaware)',
                role: 'Capital Markets',
                desc: 'Institutional arm. Issues Class A Debentures to accredited investors via licensed broker-dealers only. Debentures are SECURITIES — contractors cannot sell these.',
                color: 'border-blue-400 bg-blue-50',
              },
              {
                name: 'Goldbackbond Inc. (Texas)',
                role: 'Operations',
                desc: 'Issues and manages USDGB tokens. Operates the staking certificate contract, user interfaces, and coordinates with lenders and exchanges. THIS is what contractors work with.',
                color: 'border-emerald-400 bg-emerald-50',
              },
            ].map((entity, i) => (
              <div key={i} className={`p-4 rounded-xl border-2 ${entity.color}`}>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">{entity.role}</div>
                <h3 className="font-semibold text-neutral-900 mb-2">{entity.name}</h3>
                <p className="text-sm text-neutral-600">{entity.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Two Token States */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold-600" />
            The Two Token States — USDGB & sUSDGB
          </h2>
          <p className="text-sm text-neutral-500 mb-4">The ecosystem recognizes exactly <strong>two and only two</strong> token states. No third token class exists.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border-2 border-gold-400 bg-gold-50">
              <div className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">State 1 — Freely Transferable</div>
              <h3 className="font-bold text-xl text-neutral-900 mb-3">USDGB</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />Freely transferable base token</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />Issued by Goldbackbond Inc.</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />Hold, trade on DEXs, or stake</li>
                <li className="flex gap-2"><XCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />No rewards in this state (hold/trade only)</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border-2 border-emerald-400 bg-emerald-50">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">State 2 — Staked & Locked</div>
              <h3 className="font-bold text-xl text-neutral-900 mb-3">sUSDGB</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />USDGB that has been staked and locked in smart contracts</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /><strong>Earns 9% APR</strong> (current program target) — whether staked-only OR pledged as lending collateral. Reward does NOT pause or reduce upon adding a loan.</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />Rewards funded from treasury-management activities (DeFi, secured investments) — NOT from Debenture income</li>
                <li className="flex gap-2"><AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />Non-transferable while staked; default = contractual <em>reassignment</em> to lender (no price-based liquidations)</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <strong>Privacy / Railgun:</strong> "pUSDGB" is <strong>NOT</strong> a separate token. It is USDGB used within a Railgun-shielded environment. KYC is required at primary issuance. The shielded path provides in-transit privacy only.
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Approved Exit Mechanisms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border-2 border-gold-200 rounded-xl bg-gold-50/50">
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                1. Sell on Secondary Markets
              </h3>
              <p className="text-neutral-600">
                Trade on DEXs (Uniswap, Hyperliquid, etc.) at market price
              </p>
            </div>
            <div className="p-5 border-2 border-gold-200 rounded-xl bg-gold-50/50">
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                2. Use as Collateral
              </h3>
              <p className="text-neutral-600">
                Stake with third-party lenders, borrow up to 70% LTV
              </p>
            </div>
          </div>
        </section>

        {/* Staking Structure */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Staking Structure</h2>
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                <span className="text-neutral-700">
                  Users stake USDGB with third-party participating lenders (NOT Goldbackbond)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                <span className="text-neutral-700">
                  <strong>Flexible Lock Terms:</strong> Staking certificates are locked for 1, 3, 5, or 10 years, often required by institutional lenders.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                <span className="text-neutral-700">
                  <strong>9% APR on sUSDGB:</strong> Once staked (converting to sUSDGB), the position earns a current target rate of 9% annualized growth rewards, regardless of whether it is also pledged as lending collateral. Rewards come from Goldbackbond treasury activities — NOT Debenture coupons. The rate is the current program target and may be adjusted for future programs (already-accrued rewards are not affected).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </span>
                <span className="text-neutral-700">
                  <strong>No Price-Based Liquidations:</strong> Participating lenders do NOT liquidate based on market volatility, gold price movements, or USDGB price fluctuations. If a borrower fails to meet loan obligations after the 30-day cure period, the sUSDGB position is contractually <strong>reassigned</strong> to the lender — tokens are not auto-sold on the market.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  5
                </span>
                <span className="text-neutral-700">
                  <strong>Lien Release on Payoff:</strong> When a loan is fully repaid, the lender releases the lien. The certificate stays locked until its unlock date, but can be re-pledged or unstaked at term end.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  6
                </span>
                <span className="text-neutral-700">
                  <strong>Participating Lenders:</strong> Currently include <strong>Genesis Bank &amp; Trust</strong> and other institutional lending partners specializing in secured credit lines and digital-asset collateralization. Each lender sets its own underwriting criteria, rates, and terms. Goldbackbond's role is limited to providing staking infrastructure and facilitating introductions.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Launch Roadmap */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-gold-600" />
            Launch Roadmap — Know Your Pricing Story
          </h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Price / Action</th>
                  <th>Window</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Private Presale</td>
                  <td className="text-gold-700 font-bold">$0.80 / USDGB</td>
                  <td>Now – Apr 31, 2026</td>
                  <td>$10,000 min. KYC required. Tokens delivered within 2 hrs of cleared funds.</td>
                </tr>
                <tr>
                  <td className="font-semibold">Strategic Private Allocation</td>
                  <td className="text-gold-700 font-bold">$0.80 / USDGB</td>
                  <td>Now – Apr 31, 2026</td>
                  <td>Hard cap $25M. 12-month lockup. Cannot be traded or used for market-making during lock.</td>
                </tr>
                <tr>
                  <td className="font-semibold">Uniswap CCA Auctions (Base)</td>
                  <td className="font-bold">$0.85 → $1.00</td>
                  <td>Now – Apr 31, 2026</td>
                  <td>4 tranches: $0.85, $0.90, $0.95, $1.00. Market-driven price discovery. Self-service.</td>
                </tr>
                <tr>
                  <td className="font-semibold">DEX Expansion</td>
                  <td>Market price</td>
                  <td>May 1 – Oct 31, 2026</td>
                  <td>Hyperliquid, Aster, Aerodrome, Jupiter. $50M liquidity target.</td>
                </tr>
                <tr>
                  <td className="font-semibold">CEX Listing — MEXC</td>
                  <td>Market price</td>
                  <td>Nov 1, 2026</td>
                  <td>First centralized exchange listing.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t-2 border-neutral-200 pt-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Compliance Guidelines</h2>
        </div>

        {/* Compliance Overview */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Revenue Sources — What Funds sUSDGB Rewards</h2>
          <p className="text-neutral-600 mb-4">
            The USDGB token ecosystem generates revenue exclusively from:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <h3 className="font-semibold text-neutral-900 mb-1">Treasury Operations</h3>
              <p className="text-sm text-neutral-500">DeFi strategies, secured lending, and asset-backed investment programs on Trust assets</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <h3 className="font-semibold text-neutral-900 mb-1">Secured Credit Facilities</h3>
              <p className="text-sm text-neutral-500">Secured credit lines and investment programs — NOT Debenture coupons</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <h3 className="font-semibold text-neutral-900 mb-1">Token Operations</h3>
              <p className="text-sm text-neutral-500">Fees and spreads directly tied to USDGB / sUSDGB token operations</p>
            </div>
          </div>
        </section>

        {/* What Contractors CAN Do */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            What Contractors CAN Do (Green Light)
          </h2>
          <div className="bg-success/5 border-2 border-success/30 rounded-xl p-6">
            <ul className="space-y-4">
              {[
                'Sell USDGB token allocations directly (no license required)',
                'Provide educational content (no investment advice)',
                'Refer qualified buyers to Broker/Dealer for Debentures',
                'Refer borrowers to lending partners',
                'Host X Spaces, create YouTube videos, write LinkedIn posts',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What Contractors CANNOT Do */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            What Contractors CANNOT Do (Red Light)
          </h2>
          <div className="bg-error/5 border-2 border-error/30 rounded-xl p-6">
            <ul className="space-y-4">
              {[
                'Sell Secured Debentures directly (requires Broker/Dealer license)',
                'Provide investment advice (requires RIA license)',
                'Make false gold redemption claims',
                'Market USDGB as "backed by Bloomberg Securities"',
                'Promise passive yield or guaranteed returns',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Marketing Language */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold-600" />
            Marketing Language Guidelines
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Approved */}
            <div className="bg-success/5 rounded-xl p-6 border-2 border-success/30">
              <h3 className="font-semibold text-success mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Approved Marketing Language
              </h3>
              <ul className="space-y-3">
                <li className="p-3 bg-white rounded-lg border border-success/20 text-sm text-neutral-700">
                  "When you stake your USDGB it becomes sUSDGB and earns a current rate of 9% annualized growth rewards from Goldbackbond's treasury operations."
                </li>
                <li className="p-3 bg-white rounded-lg border border-success/20 text-sm text-neutral-700">
                  "Those rewards apply whether you take a loan against your staked position or simply hold it staked with no borrowing."
                </li>
                <li className="p-3 bg-white rounded-lg border border-success/20 text-sm text-neutral-700">
                  "The 9% is the current program target; Goldbackbond can adjust it for future staking cycles but cannot take back rewards you've already earned."
                </li>
                <li className="p-3 bg-white rounded-lg border border-success/20 text-sm text-neutral-700">
                  "If you pledge your sUSDGB as collateral for a loan and default, the lender takes the staked position — but there are no automatic price-based liquidations."
                </li>
                <li className="p-3 bg-white rounded-lg border border-success/20 text-sm text-neutral-700">
                  "Gold reserves verified through multi-party attestation including Wells Fargo Bank, Federal Judges, and Rektor Law"
                </li>
              </ul>
            </div>

            {/* Prohibited */}
            <div className="bg-error/5 rounded-xl p-6 border-2 border-error/30">
              <h3 className="font-semibold text-error mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Prohibited Marketing Language
              </h3>
              <ul className="space-y-3">
                <li className="p-3 bg-white rounded-lg border border-error/20 text-sm text-neutral-700">
                  "Guaranteed 9%" or "Risk-free staking returns"
                </li>
                <li className="p-3 bg-white rounded-lg border border-error/20 text-sm text-neutral-700">
                  "USDGB is backed by our bond program / Debentures" or "The yield comes from our Bloomberg-listed bonds"
                </li>
                <li className="p-3 bg-white rounded-lg border border-error/20 text-sm text-neutral-700">
                  "Your tokens can't be taken away unless you choose to sell"
                </li>
                <li className="p-3 bg-white rounded-lg border border-error/20 text-sm text-neutral-700">
                  "pUSDGB is a separate token you can buy"
                </li>
                <li className="p-3 bg-white rounded-lg border border-error/20 text-sm text-neutral-700">
                  "You can stake your USDGB and bypass KYC for privacy"
                </li>
                <li className="p-3 bg-white rounded-lg border border-error/20 text-sm text-neutral-700">
                  "USDGB is guaranteed to appreciate" or "risk-free 9%"
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Legal Consequences */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Gavel className="w-6 h-6 text-error" />
            Legal Consequences of Non-Compliance
          </h2>
          <div className="bg-error/5 border-2 border-error/30 rounded-xl overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Violation Type</th>
                  <th>Consequence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Federal Crimes</td>
                  <td>Selling securities without license (SEC violation)</td>
                </tr>
                <tr>
                  <td className="font-medium">Civil Penalties</td>
                  <td>Fines up to $500,000+ per violation</td>
                </tr>
                <tr>
                  <td className="font-medium">Reputational Damage</td>
                  <td>Loss of business relationships</td>
                </tr>
                <tr>
                  <td className="font-medium">Personal Liability</td>
                  <td>Contractor personally liable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Important Security Notice */}
        <section>
          <div className="bg-info/10 border-2 border-info/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-info flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Critical: USDGB is NOT a Security</h3>
                <p className="text-neutral-700">
                  USDGB is a digital utility token (non-security). It does not represent ownership in Goldbackbond,
                  does not pay dividends or passive yield from Goldbackbond, and does not meet the Howey Test 
                  criteria for securities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Banner */}
        <section>
          <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Remember</h3>
                <p className="text-neutral-700">
                  When in doubt, DO NOT proceed. Contact your supervisor or the compliance team
                  before making any claims you are unsure about. Compliance protects you and
                  the company.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Universal Disclaimer */}
        <section>
          <div className="bg-neutral-100 border border-neutral-300 rounded-xl p-5 text-xs text-neutral-500">
            <p><strong>Disclosure:</strong> USDGB and sUSDGB are digital utility tokens and are not securities. The 9% annualized growth reward on sUSDGB is a current program target funded by treasury-management activities; it is not a guaranteed return, does not constitute interest income from a fixed-income instrument, and may be modified for future staking programs. sUSDGB is locked while staked and is subject to reassignment to a participating lender in the event of borrower default. Goldbackbond Secured Debentures are entirely separate instruments issued by Goldbackbond Ltd and are not referenced by or linked to USDGB token values. This document does not constitute an offer of securities. Consult your financial, legal, and tax advisors before participating.</p>
          </div>
        </section>
      </div>
    </ModuleLayout>
  );
}
