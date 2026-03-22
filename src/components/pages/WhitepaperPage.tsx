import React from 'react';
import DocsLayout from '../layouts/DocsLayout';
import { HeadingItem } from '../../types/docs';
import whitepaperContent from '../../content/docs/whitepaper.md?raw';
import PortfolioValuation from '../sections/PortfolioValuation';

const headings: HeadingItem[] = [
  { id: "1-executive-summary", text: "1. Executive Summary", level: 2 },
  { id: "2-problem-market-context", text: "2. Problem & Market Context", level: 2 },
  { id: "3-entities-ownership-governance", text: "3. Entities, Ownership & Governance", level: 2 },
  { id: "4-asset-backing-monetization-memorandum", text: "4. Asset Backing & Monetization Memorandum", level: 2 },
  { id: "5-token-design-smart-contract-architecture", text: "5. Token Design & Smart Contract Architecture", level: 2 },
  { id: "6-staking-yield-leverage", text: "6. Staking, Yield & Leverage", level: 2 },
  { id: "7-launch-liquidity-year-1-roadmap", text: "7. Launch, Liquidity & Year‑1 Roadmap", level: 2 },
  { id: "8-use-cases", text: "8. Use Cases", level: 2 },
  { id: "9-risk-factors", text: "9. Risk Factors", level: 2 },
  { id: "10-compliance-kyc-legal-positioning", text: "10. Compliance, KYC & Legal Positioning", level: 2 },
  { id: "11-community-culture-ownership-mindset", text: "11. Community, Culture & \"Ownership Mindset\"", level: 2 },
  { id: "12-appendices-references", text: "12. Appendices & References", level: 2 },
];

export default function WhitepaperPage() {
  return (
    <DocsLayout
      title="USDGB / Goldbackbond Whitepaper"
      version="1.0 – March 2026"
      note="Informational only; not a securities offering document."
      headings={headings}
      markdownContent={whitepaperContent}
      beforeContent={<PortfolioValuation />}
    />
  );
}
