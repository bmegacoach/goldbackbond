import { useState } from 'react';
import { ModuleLayout } from '../ModuleLayout';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What is USDGB?',
    answer:
      'USDGB is a digital utility token pegged to $1.00 worth of gold at spot price (NAV peg). It is issued and managed by Goldbackbond Inc. (Texas) — one of three entities in the Goldbackbond structure. Reserves are attested by the USDGB Trust Fund, which holds Federal Reserve gold certificates, 100% of Goldbackbond Inc. corporate shares, and intellectual property. You can trade USDGB on DEXs, use it as collateral with participating lenders for up to 70% LTV, or hold it as gold-linked stable exposure.',
  },
  {
    question: 'How is USDGB backed by gold?',
    answer:
      'The USDGB Trust Fund holds Series 1934 US Federal Reserve Gold Certificate Bearer Instruments. The Colburn Valuation Report (July 9, 2025) values each bond at ~$11.98B on a gold-linked basis. This is further verified through a 10-year Monetization Memorandum with multi-party attestation including Wells Fargo Bank, Federal Judges, Rektor Law, Senn Law, an ex-Federal Reserve Board Member, and State of Pennsylvania notarization.',
  },
  {
    question: 'Can I redeem USDGB for physical gold?',
    answer:
      "No. USDGB doesn't offer direct physical gold redemption. You have two exit options: (1) Sell on DEXs at market price — available 24/7. (2) Use as collateral with participating lenders for up to 70% LTV, keeping your gold exposure while accessing fiat liquidity.",
  },
  {
    question: 'Is USDGB a security?',
    answer:
      "No. USDGB is a digital utility token (non-security). It doesn't represent ownership in Goldbackbond Inc., LTD, or the USDGB Trust Fund. It doesn't pay dividends or passive yield from Goldbackbond, and it doesn't meet the Howey Test criteria for securities. Class A Debentures issued by Goldbackbond LTD ARE securities — those are sold only through licensed broker-dealers to accredited investors.",
  },
  {
    question: 'What happens if I miss a loan payment?',
    answer:
      'A guardian-controlled 30-day grace period begins. There are NO automated price-triggered liquidation bots. You receive daily risk notifications and have the full 30 days to cure the default, refinance, or reduce exposure. If uncured after 30 days, the GUARDIAN multisig may reassign your staking certificate to the lender — tokens are reassigned (not immediately sold). When a loan is fully repaid, the lender releases the lien on the certificate.',
  },
];

const rebuttals = [
  {
    objection: 'This sounds too good to be true.',
    rebuttal:
      'The $0.80 presale price is a deliberate early-mover discount — the Uniswap CCA public launch starts at $0.85 per USDGB and tranches up to $1.00. That 20–25% pricing gap exists because you\'re getting in before open market price discovery. The reserve documentation includes a Colburn Valuation Report (July 2025), multi-party Federal attestation including Wells Fargo, and a smart contract audit by InterFi Network (Feb 2026) with zero unresolved findings. Start smaller if uncertain.',
  },
  {
    objection: "I don't trust stablecoins after UST/Luna.",
    rebuttal:
      'UST was algorithmic with zero real backing — it relied on circular demand between two tokens. USDGB is asset-backed: Federal Reserve gold certificates, independently valued by Colburn Appraisal, with multi-party attestation by Wells Fargo Bank, Federal Judges, and licensed attorneys. There is no algorithmic peg and no circular dependency. Smart contracts were audited (InterFi Network, Feb 2026). This is categorically different.',
  },
  {
    objection: 'Why not just buy physical gold?',
    rebuttal:
      'Physical gold: $1,000-$3,500/year storage costs. Sells in 1-3 days. 30-50% LTV at pawn shops. USDGB: $0 storage. Sells in seconds on DEXs 24/7. 70% LTV with institutional lenders who treat it as 3x risk-adjusted collateral. Plus you earn base staking APY. Physical gold is illiquid and expensive to leverage.',
  },
  {
    objection: "I'm worried about regulatory crackdown.",
    rebuttal:
      'USDGB is structured as a utility token (non-security). Federal Reserve Bank custody provides institutional-grade compliance. Smart contract audited. DEX trading is permissionless. Class A Debentures — the securities product — are sold separately, only through licensed broker-dealers. The two products are deliberately separated for exactly this reason.',
  },
  {
    objection: "What's the difference between the presale and the CCA auction?",
    rebuttal:
      'The private presale is $0.80 minimum $10,000, requires KYC and a signed allocation agreement — it\'s a direct allocation. The Uniswap CCA is a public self-service auction on Base chain, starting at $0.85 per tranche and clearing up to $1.00. Both run through April 2026. Private allocation buyers have a 12-month lockup; CCA buyers don\'t. If your client wants the best price and is accredited, presale is the play.',
  },
  {
    objection: 'Who actually runs Goldbackbond?',
    rebuttal:
      'Three separate entities: (1) USDGB Trust Fund — holds the Federal Reserve gold certs, 100% of Goldbackbond Inc. equity, and IP. (2) Goldbackbond LTD (Delaware) — institutional capital markets arm, issues Class A Debentures through licensed broker-dealers. (3) Goldbackbond Inc. (Texas) — the operating company that issues USDGB tokens, runs the staking contract, and coordinates lenders and exchanges. Technical lead is Troy Joyner, PMP, heading the CoachAI Development Fund.',
  },
];

function Accordion({
  items,
  type,
}: {
  items: { question?: string; objection?: string; answer?: string; rebuttal?: string }[];
  type: 'faq' | 'rebuttal';
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const title = type === 'faq' ? item.question : item.objection;
        const content = type === 'faq' ? item.answer : item.rebuttal;

        return (
          <div
            key={index}
            className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
              isOpen ? 'border-gold-300 bg-gold-50/30' : 'border-neutral-200 bg-white'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-medium text-neutral-900 pr-4">{title}</span>
              <ChevronDown
                className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 animate-fade-in">
                <div
                  className={`p-4 rounded-lg ${
                    type === 'rebuttal' ? 'bg-success/10 border border-success/20' : 'bg-neutral-50'
                  }`}
                >
                  {type === 'rebuttal' && (
                    <p className="text-xs font-semibold text-success uppercase tracking-wide mb-2">
                      Recommended Response
                    </p>
                  )}
                  <p className="text-neutral-700 leading-relaxed">{content}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Module3() {
  return (
    <ModuleLayout
      moduleId="module-3"
      moduleNumber={3}
      title="FAQ & Rebuttals"
      description="Common questions and objection handling scripts to help you address prospect concerns."
    >
      <div className="space-y-8">
        {/* Product FAQs */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-gold-600" />
            Product FAQs (USDGB Tokens)
          </h2>
          <p className="text-neutral-600 mb-4">
            Common questions prospects ask about USDGB tokens and how to answer them.
          </p>
          <Accordion items={faqs} type="faq" />
        </section>

        {/* Common Objections & Rebuttals */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-gold-600" />
            Common Objections & Rebuttals
          </h2>
          <p className="text-neutral-600 mb-4">
            How to handle common objections from prospects. Use these scripts as a guide.
          </p>
          <Accordion items={rebuttals} type="rebuttal" />
        </section>

        {/* Quick Reference */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Reference Card</h2>
          <div className="bg-gradient-to-br from-gold-50 to-gold-100/50 rounded-xl p-6 border border-gold-200">
            <h3 className="font-semibold text-neutral-900 mb-4">Key Talking Points</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                <span className="text-neutral-700">
                  <strong>Gold-backed:</strong> Reserves held at Federal Reserve Bank
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                <span className="text-neutral-700">
                  <strong>NAV Peg:</strong> 1 USDGB = $1.00 worth of gold at spot
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                <span className="text-neutral-700">
                  <strong>Pre-List Pricing:</strong> $0.80 per token (20% discount)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </span>
                <span className="text-neutral-700">
                  <strong>Liquidity:</strong> Trade on DEXs or use as 70% LTV collateral
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  5
                </span>
                <span className="text-neutral-700">
                  <strong>Verification:</strong> Multi-party attestation including Wells Fargo
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </ModuleLayout>
  );
}
