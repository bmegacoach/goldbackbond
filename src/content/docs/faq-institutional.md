# USDGB / Goldbackbond FAQ – Institutional Version  
Version 4.1 – March 2026

This FAQ is written for institutional allocators, lenders, and counterparties familiar with digital assets and structured products. It summarizes the institutional mechanics of USDGB per the v4.1 architecture update (March 2026).

---

## A. Product Structure

**Q1. How is USDGB defined at the asset level?**  
USDGB is a gold-backed **digital utility token (non-security)** issued by Goldbackbond Inc. It directly tokenizes **Trust Certificate Units** held by the USDGB Trust Fund. Each token represents **$1.00 worth of gold at spot price** — stable NAV, not a full-ounce gold token. It is intended to function as a gold-linked stable unit for trading, collateralization, and structured products rather than a direct metal entitlement. No accredited-investor status is required for primary allocation (minimum $10,000, Tier 1 KYC).

**Q2. What is the legal and corporate structure behind USDGB?**  
The ecosystem comprises three distinct layers:

- **USDGB Trust Fund** — holds ~108 Series 1934 U.S. Federal Reserve Gold Certificate Bearer Instruments (~$250.56B face value), 100% of Goldbackbond Inc.'s equity, and associated intellectual property. Issues Trust Certificate Units evidencing economic rights.
- **Goldbackbond Ltd. (Delaware)** — issues Secured Debentures (fixed-income securities, 8–10% annual yield) to accredited investors via licensed broker-dealers under SEC Regulation D. Minimum investment: $100,000.
- **Goldbackbond Inc. (Delaware)** — issues and manages the USDGB token, staking certificate contracts, user interfaces, and lender/exchange integrations.

USDGB holders own tokens only. They do not acquire any interest in the Trust, debentures, or corporate equity. **USDGB tokens have no legal, economic, or contractual relationship to Goldbackbond Secured Debentures.** These are entirely separate instruments.

**Q3. Is USDGB a security in any jurisdiction?**  
USDGB is structured and legally positioned as a **non-security utility token**. It does not represent equity ownership, does not pay dividends or passive yield from Goldbackbond corporate earnings, and does not meet Howey Test criteria. Goldbackbond complies with KYC/AML requirements, OFAC sanctions screening, FinCEN, and applicable state money transmitter regulations. Secured Debentures are the separate securities product governed by SEC Regulation D, sold only through a licensed broker-dealer.

---

## B. Backing, Valuation, and Attestation

**Q4. What assets sit in the Trust and how are they valued?**  
The Trust holds:

- ~108 Series 1934 Federal Reserve Gold Certificate Bearer Instruments with face values of $1B each (~$2.32B conservative trade/market value each) — totaling ~$250.56B in collateral face value
- 100% of the issued and outstanding shares of Goldbackbond Inc.
- Goldbackbond's core intellectual property portfolio

Multi-party attestation has been completed by Wells Fargo Bank, Federal judges, certified appraisers from Pennsylvania and Washington DC, and an ex-Federal Reserve Board member. Goldbackbond applies conservative assumptions internally and does not treat any single valuation as a guaranteed redemption value.

**Q5. How is the $1.00 NAV peg to gold maintained?**  
USDGB's target NAV is $1.00 worth of gold at spot. As gold prices move, the amount of gold notionally represented per token adjusts while the USD unit remains $1.00. Market-level enforcement relies on:

- CCA-driven price discovery at launch (Uniswap CCA Auction, March 15 – April 31, 2026)
- Liquidity provision across DEX and CEX venues (Hyperliquid Q2 2026, CEX listings from Q4 2026)
- Arbitrage by professional traders when USDGB deviates from intended NAV

There is no hard on-chain redemption arbitrage because there is no physical gold redemption; the peg is economic and market-driven.

---

## C. Smart Contracts, Audit, and Governance

**Q6. What are the core contracts and who controls them?**  
Key contracts include:

- **USDGB ERC-20 token** (max supply 250.56B) — deployed on Base (LayerZero OFT compatible)
- **CertificateStaking** contract for staking and certificate issuance
- **Guardian-controlled certificate collateral logic** for default handling
- **LP Reward Pool** and **Gold Bonus Vault** contracts
- **GBBAllocationInscription** contract for private allocation tracking

Administrative roles (including GUARDIAN_ROLE) are held by Gnosis Safe multisigs rather than EOAs.

**Q7. Have the contracts been audited?**  
Yes. All core USDGB smart contracts completed an independent third-party security audit by **InterFi Security**. The full audit report and executive summary are publicly accessible in the **Goldbackbond online Whitepaper documentation repository**. All identified issues were remediated prior to mainnet deployment.

---

## D. Token Architecture (Two States Only)

**Q8. What are the two token states?**  
The Goldbackbond ecosystem recognizes exactly **two token states**. No third token class exists.

- **USDGB** — the freely transferable base token. Represents a pro-rata beneficial interest in Trust Certificate Units. Can be held, traded on DEXs (Uniswap, Hyperliquid, Curve), or staked.
- **sUSDGB** — USDGB that has been staked and locked in Goldbackbond smart contracts. Non-transferable while staked. Two use cases: (A) staking to earn 9% APR growth rewards, (B) pledging as collateral for institutional lending. These are use cases of the **same token state**, not separate instruments.

"pUSDGB" is a UX label for USDGB operating within a Railgun-shielded privacy environment (Tier 3 KYC, Q3 2026). It is not a third token.

**Q9. What is the sUSDGB reward model?**  
sUSDGB earns **9% annualized growth rewards** in every use case — whether staked without borrowing or pledged as collateral for a loan. The reward does not stop, pause, or reduce upon the addition of a loan against the position.

Rewards are funded exclusively from Goldbackbond's **treasury-management activities** — DeFi strategies, secured lending, yield farming, and corporate acquisitions of cashflowing assets. Rewards are **NOT** funded from:
- Debenture coupon payments
- Borrower interest collected by lenders
- Any securities product

The 9% is the current program target. Goldbackbond reserves the right to adjust for future staking cycles. Rewards already accrued are not retroactively affected.

---

## E. Collateralization, LTV, and Default Mechanics

**Q10. How is sUSDGB used as collateral and what LTVs are expected?**  
Participating institutional lenders (including **Genesis Bank & Trust**) recognize staking certificates as collateral and may extend credit at up to **70% LTV** of the USD value of staked USDGB. In their internal risk models, lenders may recognize up to **3× the collateral value** of the underlying Trust Certificate Units — providing an institutional safety buffer while maintaining borrower LTV at 70% of nominal value. This is a lender-side asset recognition multiplier based on asset quality — not a synthetic on-chain leverage mechanism.

**Q11. How are default mechanics structured vs. DeFi liquidations?**  
Instead of automated price-triggered liquidations, USDGB uses a **guardian-controlled, contractual default process**:

- There are **no price-based margin calls** or automatic liquidations from gold price movements or USDGB price fluctuations
- A **30-day cure period** begins upon first missed payment; daily risk notifications are sent
- If default is uncured after 30 days (or material covenant breach occurs), the GUARDIAN multisig may reassign the staking certificate to the lender
- The lender becomes the new beneficiary of the Trust Certificate Units

Borrowers bear full credit and default risk on their staked collateral position.

**Q12. What happens on payoff?**  
Upon full payoff of principal and interest, the lender issues an on-chain instruction to **release the lien**. The certificate remains locked until its scheduled unlock date but becomes unencumbered for new borrowing or eventual unstaking.

---

## F. Launch, Liquidity, and Counterparty Considerations

**Q13. What is the launch and liquidity roadmap?**

| Phase | Timeline | Venue | Target |
|:--|:--|:--|:--|
| CCA Auction (presale) | March 15 – April 31, 2026 | Uniswap (Base) | $25M–$35M liquidity |
| DEX Phase | May 1 – Oct 31, 2026 | Hyperliquid, Aster, Aerodrome, Jupiter | $50M+ |
| CEX Phase 1 | Nov 1, 2026 | MEXC | Initial CEX depth |
| CEX Phase 2 | Jan 1, 2027 | BTCC, KuCoin, or Binance | Expanded retail access |

Pre-sale pricing: **$0.80/token** (20% discount to $1.00 NAV). Post-list pricing: $1.00 NAV.

**Q14. Who are the participating lenders?**  
Participating lenders currently include **Genesis Bank & Trust** and other institutional lending partners specializing in secured credit lines and digital-asset collateralization. Each lender sets their own underwriting criteria, interest rates, and loan terms. Goldbackbond's role is limited to providing staking infrastructure and facilitating introductions.

**Q15. How should institutions think about custody and integration?**  
USDGB is an EVM-based ERC-20 on Base (LayerZero OFT compatible), supporting:

- Standard institutional MPC and multi-sig custody platforms
- Exchange and OTC desk infrastructure for ERC-20 tokens
- On-chain reporting and monitoring tools for exposure analysis

Goldbackbond offers a **lender onboarding wizard** that walks institutions through KYC/AML checks, documentation, and technical integration steps for participation as an approved lending partner.

---

## G. Risk, Regulatory, and Compliance

**Q16. What are the primary risk categories?**

- **Smart contract risk:** residual exploit risk despite InterFi Security audit
- **Counterparty/custodial risk:** Trust, Goldbackbond entities, Genesis Bank & Trust, and other lenders could default or be impaired
- **Regulatory risk:** evolving treatment of utility tokens, stablecoins, and gold-linked products
- **Market/liquidity risk:** spreads and depth across DEX/CEX venues, especially in early months
- **Credit risk:** borrower defaults with insufficient remediation during the 30-day grace period
- **Treasury concentration risk:** DeFi protocol exposure and secured lending counterparty defaults could affect reward funding capacity
- **Key personnel risk:** dependence on core team for strategic and operational execution

**Q17. What KYC/AML framework applies?**  
Goldbackbond operates a **three-tier KYC framework**:

- **Tier 1:** Valid government-issued photo ID + OFAC sanctions screening → Purchase USDGB, participate in CCA Auction. Min: $10,000. No accredited investor status required.
- **Tier 2:** Tier 1 + proof of address + source of funds → Stake as sUSDGB, earn 9% APR, access 70% LTV lending
- **Tier 3:** Full Tier 2 verification (auto-activates) → Railgun shielded privacy environment (Q3 2026)

KYC is maintained at all on- and off-ramps at every tier. The shielded environment provides in-transit privacy only — it does not remove identity verification obligations.

---

## H. Interactions with Debentures and Other Instruments

**Q18. How do USDGB tokens relate to Goldbackbond Ltd. Secured Debentures?**  
They are **entirely separate instruments** with no legal, economic, or contractual link:

- USDGB: digital utility token (non-security), gold-linked $1.00 NAV, used in DeFi/crypto contexts. Revenue from treasury-management activities.
- Secured Debentures: fixed-income securities of Goldbackbond Ltd., 8–10% annual yield, sold via licensed broker-dealers to accredited investors only (minimum $100,000). Revenue from Debenture coupon payments.

The USDGB token program does **not** receive interest, fees, or any revenue from Goldbackbond Secured Debentures.

**Q19. Are there planned integrations with other DeFi protocols?**  
Goldbackbond's immediate focus is Uniswap CCA (Base), Hyperliquid, Aster, Aerodrome, and Jupiter. Railgun privacy integration is targeted Q3 2026. Additional DeFi integrations (lending pools, structured-product wrappers) may be pursued once sufficient track record, liquidity, and compliance comfort are established.

---

## I. Universal Risk Disclosure

USDGB and sUSDGB are digital utility tokens and are not securities. The 9% annualized growth reward on sUSDGB is a current program target funded by treasury-management activities; it is not a guaranteed return, does not constitute interest income from a fixed-income instrument, and may be modified for future staking programs. sUSDGB is locked while staked and is subject to reassignment to a participating lender in the event of a borrower default. Goldbackbond Secured Debentures are entirely separate instruments issued by Goldbackbond Ltd. and are not referenced by or linked to USDGB token values. This document does not constitute an offer of securities. Consult your financial, legal, and tax advisors before participating.

_Version 4.1 | March 2026_