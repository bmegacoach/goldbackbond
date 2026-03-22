import { ModuleLayout } from '../ModuleLayout';
import { GitCompare, Zap, CheckCircle2 } from 'lucide-react';

export function Module4() {
  return (
    <ModuleLayout
      moduleId="module-4"
      moduleNumber={4}
      title="Product Comparison Matrix"
      description="Understanding how USDGB and sUSDGB compare to each other, Secured Debentures, and competitors."
    >
      <div className="space-y-8">
        {/* Three-Column Advisory Table */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-gold-600" />
            USDGB vs. sUSDGB vs. Secured Debentures
          </h2>
          <p className="text-sm text-neutral-500 mb-4">
            The ecosystem has exactly two token states (USDGB and sUSDGB) and one separate fixed-income product (Secured Debentures). These are distinct instruments with no cross-relationship.
          </p>
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="data-table min-w-[700px]">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight">USDGB</th>
                  <th style={{background:'#ecfdf5', color:'#065f46'}}>sUSDGB</th>
                  <th>Secured Debentures</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Legal Classification</td>
                  <td className="highlight">Digital utility token (non-security)</td>
                  <td>Staked digital utility token (non-security)</td>
                  <td>Fixed-income security (Reg D)</td>
                </tr>
                <tr>
                  <td className="font-medium">Freely Transferable</td>
                  <td className="highlight">Yes</td>
                  <td>No (locked while staked)</td>
                  <td>No (restricted securities)</td>
                </tr>
                <tr>
                  <td className="font-medium">Backed By</td>
                  <td className="highlight">Trust Certificate Units (Gold Certs, IP, equity)</td>
                  <td>Same as USDGB</td>
                  <td>Goldbackbond Ltd corporate assets (collateralized by Trust Units)</td>
                </tr>
                <tr>
                  <td className="font-medium">Rewards / Yield</td>
                  <td className="highlight">None (hold/trade only)</td>
                  <td className="font-semibold text-emerald-700">9% APR (current target, subject to change)</td>
                  <td>8–10% annual yield (fixed-income coupon)</td>
                </tr>
                <tr>
                  <td className="font-medium">Yield Source</td>
                  <td className="highlight">N/A</td>
                  <td>Treasury management (DeFi, secured investments) — NOT Debenture income</td>
                  <td>Debenture coupon (completely separate instrument)</td>
                </tr>
                <tr>
                  <td className="font-medium">Minimum</td>
                  <td className="highlight">$10,000</td>
                  <td>$10,000 (to stake)</td>
                  <td>$100,000</td>
                </tr>
                <tr>
                  <td className="font-medium">KYC Required</td>
                  <td className="highlight">Baseline (ID + address + sanctions screening)</td>
                  <td>Baseline (ID + address + sanctions screening)</td>
                  <td>Enhanced (accredited investor verification)</td>
                </tr>
                <tr>
                  <td className="font-medium">Investor Restriction</td>
                  <td className="highlight">None beyond KYC + $10k min</td>
                  <td>None beyond KYC + $10k min</td>
                  <td>Accredited investors only (SEC Reg D)</td>
                </tr>
                <tr>
                  <td className="font-medium">Collateral Use</td>
                  <td className="highlight">Via staking → converts to sUSDGB</td>
                  <td>Up to 3x value, 70% LTV with participating lenders</td>
                  <td>Depends on brokerage policies</td>
                </tr>
                <tr>
                  <td className="font-medium">Liquidation Risk</td>
                  <td className="highlight">None</td>
                  <td>No price-based liquidation; default triggers reassignment to lender</td>
                  <td>Credit risk / default risk per indenture</td>
                </tr>
                <tr>
                  <td className="font-medium">Privacy Option</td>
                  <td className="highlight">Railgun integration (shielded UX — not a new token)</td>
                  <td>Railgun integration (shielded UX)</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td className="font-medium">Security Audit</td>
                  <td className="highlight">InterFi Security — complete, zero unresolved findings</td>
                  <td>InterFi Security — complete, zero unresolved findings</td>
                  <td>Broker-dealer oversight</td>
                </tr>
                <tr>
                  <td className="font-medium">Sales Channel</td>
                  <td className="highlight">Contractor direct</td>
                  <td>Contractor direct</td>
                  <td>Licensed Broker/Dealer ONLY</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* USDGB vs Competitors */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">USDGB vs. Competitors</h2>
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="data-table min-w-[700px]">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight">USDGB / sUSDGB</th>
                  <th>USDT</th>
                  <th>USDC</th>
                  <th>PAXG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Backing</td>
                  <td className="highlight font-semibold text-gold-700">Trust Certificate Units — Fed Reserve Gold Certs, IP, equity</td>
                  <td>Treasuries</td>
                  <td>Treasuries</td>
                  <td>Physical gold (oz-denominated)</td>
                </tr>
                <tr>
                  <td className="font-medium">Peg</td>
                  <td className="highlight">$1.00 gold NAV</td>
                  <td>$1.00 USD</td>
                  <td>$1.00 USD</td>
                  <td>1 oz gold (~$3,000+)</td>
                </tr>
                <tr>
                  <td className="font-medium">Collateral (Staked)</td>
                  <td className="highlight font-semibold text-gold-700">3x value, 70% LTV via sUSDGB</td>
                  <td>Limited 1:1</td>
                  <td>Limited 1:1</td>
                  <td>Limited</td>
                </tr>
                <tr>
                  <td className="font-medium">Staking Rewards</td>
                  <td className="highlight font-semibold text-gold-700">9% APR on sUSDGB (treasury-funded)</td>
                  <td>None</td>
                  <td>None</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td className="font-medium">Pre-List Pricing</td>
                  <td className="highlight font-semibold text-gold-700">$0.80 (20% discount to $1 NAV)</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td className="font-medium">Liquidation on Loans</td>
                  <td className="highlight font-semibold text-gold-700">No price-based liquidations — reassignment only</td>
                  <td>Protocol-dependent</td>
                  <td>Protocol-dependent</td>
                  <td>Protocol-dependent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Differentiators */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-gold-600" />
            Key Differentiators
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                number: 1,
                title: 'Federal Reserve Gold Certificates',
                description: 'Trust Certificate Units backed by Series 1934 U.S. Federal Reserve Gold Certificates — not third-party vaults or ETFs',
              },
              {
                number: 2,
                title: 'Multi-Party Attestation',
                description: 'Wells Fargo Bank, Federal Judges, Rektor Law, Senn Law, ex-Federal Reserve Board Member, State of Pennsylvania',
              },
              {
                number: 3,
                title: 'InterFi Security Audit — Complete',
                description: 'All core USDGB smart contracts independently audited. Zero unresolved findings at deployment. Full report in the Transparency portal.',
              },
              {
                number: 4,
                title: '9% APR on sUSDGB',
                description: 'Earn 9% annualized growth rewards (current program target) whether staking only or pledged as collateral. Funded by treasury management, NOT Debenture income.',
              },
              {
                number: 5,
                title: 'No Price-Based Liquidations',
                description: 'Default = contractual reassignment to lender after 30-day cure period. No bots, no margin calls, no forced market sales.',
              },
              {
                number: 6,
                title: 'Genesis Bank & Trust — Named Lender',
                description: 'Participating lenders include Genesis Bank & Trust. Up to 70% LTV, with some lenders treating sUSDGB as 3x risk-adjusted collateral.',
              },
            ].map((item) => (
              <div
                key={item.number}
                className="flex items-start gap-4 p-4 bg-gold-50 rounded-xl border border-gold-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.number}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary Card */}
        <section>
          <div className="bg-gradient-to-br from-gold-500 to-gold-400 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Why USDGB &amp; sUSDGB Win</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <CheckCircle2 className="w-6 h-6 mb-2" />
                <p className="font-semibold">9% APR Staking</p>
                <p className="text-sm text-gold-100">sUSDGB — from treasury operations</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <CheckCircle2 className="w-6 h-6 mb-2" />
                <p className="font-semibold">3x Collateral / 70% LTV</p>
                <p className="text-sm text-gold-100">No price-based liquidation</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <CheckCircle2 className="w-6 h-6 mb-2" />
                <p className="font-semibold">$0.80 Early Price</p>
                <p className="text-sm text-gold-100">20% below $1.00 NAV target</p>
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
