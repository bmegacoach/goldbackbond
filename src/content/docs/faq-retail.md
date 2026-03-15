# USDGB / Goldbackbond FAQ – Retail Version  
Version 4.1 – March 2026

This FAQ explains USDGB in plain language for everyday users, based on the official whitepaper, users manual, and compliance docs.

---

## A. Basics

**Q1. What is USDGB in simple terms?**  
USDGB is a digital utility token issued by Goldbackbond Inc. that directly tokenizes **Trust Certificate Units** held by the USDGB Trust Fund. Each token represents **$1.00 worth of gold at spot price** — stable NAV, not volatile like a full-ounce gold token. You can buy it, hold it in your wallet, use it as collateral for loans, and trade it on exchanges 24/7.

**Q2. Who runs USDGB?**  
USDGB is issued and operated by **Goldbackbond Inc.** (Delaware). It is led by **Troy Joyner, CEO & Founder** (PMP, 26 years experience in real estate, technology, and finance), with a management and advisory network including securities attorney Gila Lee Adato (Trust trustee), Henry Amado (Ebisu Securities), and Shannon Steel (Steel Private Bank).

**Q3. Is USDGB a stock or security?**  
No. USDGB is structured as a **utility token (non-security)**. It does not give you ownership of the company, dividends, voting rights, or any claim on the Trust's assets. Goldbackbond Secured Debentures are a completely separate fixed-income securities product offered only to accredited investors.

**Q4. Can I redeem USDGB for physical gold?**  
No. There is **no physical gold redemption** — this is by design to avoid banking and securities distribution risks. You access value by trading on DEXs or borrowing against your staked position.

**Q5. What are the two token states?**  
There are exactly **two token states** in the Goldbackbond ecosystem:

- **USDGB** — the freely transferable base token. Hold, trade on DEXs, or stake.
- **sUSDGB** — USDGB that has been staked and locked in Goldbackbond smart contracts. While staked, it is locked and non-transferable. sUSDGB earns 9% APR growth rewards and can be used as lending collateral. These are two use cases of the same token state — not separate instruments.

"pUSDGB" is **not a third token** — it is a UX label for USDGB used within a Railgun privacy environment (coming Q3 2026).

---

## B. Backing and Safety

**Q6. What backs USDGB?**  
USDGB tokenizes **Trust Certificate Units** held by the USDGB Trust Fund. Those units are backed by approximately **108 Series 1934 U.S. Federal Reserve Gold Certificate Bearer Instruments**, each with a face value of $1 billion (~$2.32B conservative trade value), totaling ~$250.56B in collateral face value. The Trust also holds associated intellectual property and 100% of Goldbackbond Inc.'s equity. Token holders own tokens, not the underlying Trust assets.

**Q7. Has the code been audited?**  
Yes. All core USDGB smart contracts completed an independent third-party security audit by **InterFi Security**. The full audit report is publicly accessible in the **Goldbackbond online Whitepaper documentation repository**.

**Q8. Has the gold collateral been independently verified?**  
Yes. Multi-party attestation has been completed by Wells Fargo Bank, Federal judges, certified appraisers from Pennsylvania and Washington DC, and an ex-Federal Reserve Board member. Attestation reports are published in the online Whitepaper repository.

---

## C. Buying and Selling

**Q9. How do I buy in the presale (CCA Auction)?**  
The **Uniswap CCA Auction** runs **March 15 – April 31, 2026**. Qualified buyers purchase USDGB at **$0.80 per token** (20% discount to $1.00 NAV), with a **$10,000 minimum**. Process: complete Tier 1 KYC → sign allocation agreement → wire funds → receive tokens within **2 hours** of funds clearing.

⚠️ Pre-sale tokens are delivered in a staked state and cannot be sold during the CCA Auction period. Free trading resumes once the Auction concludes.

**Q10. What does "KYC tier" mean?**  
Goldbackbond operates a **three-tier KYC framework**:

- **Tier 1** — Valid government photo ID + OFAC screening → Purchase USDGB, trade on DEXs, participate in CCA Auction. Min: $10,000. No accredited-investor status required.
- **Tier 2** — Tier 1 + proof of address + source of funds → Stake as sUSDGB, earn 9% APR, access 70% LTV institutional lending
- **Tier 3** — Tier 2 completed (automatic) → Access Railgun privacy environment (Q3 2026)

**Q11. Where will USDGB trade after the CCA Auction?**

- **Now through April 31, 2026:** Uniswap CCA Auction (presale + live DEX on Base)
- **May 1 – Oct 31, 2026:** Hyperliquid, Aster, Aerodrome, Jupiter DEXs
- **Nov 1, 2026+:** Centralized exchange listings — MEXC first, then BTCC/KuCoin/Binance

---

## D. Staking and Earning (sUSDGB)

**Q12. How does staking work?**  
You stake USDGB (it becomes sUSDGB) by locking it in the Goldbackbond staking smart contract. While staked, you earn a **9% annualized growth reward** (current program target) paid in USDGB. Rewards come from Goldbackbond's treasury-management activities — DeFi strategies, secured lending, and yield farming — **not** from Debenture coupons or any securities product.

**Q13. Is the 9% APR guaranteed?**  
No. The 9% is the **current program target**. Goldbackbond reserves the right to adjust this rate for future staking programs based on regulatory, market, or treasury conditions. Any adjustments are disclosed prospectively. Rewards already accrued are not retroactively affected.

**Q14. Can I earn 9% APR even if I take a loan against my staked position?**  
Yes. sUSDGB earns 9% APR **regardless** of whether you are borrowing against it or simply staking without a loan. The rewards do not stop or pause upon adding a loan.

**Q15. How long is my USDGB locked when staked?**  
Every stake starts with a **1-year (365-day) lock**. You can extend to 3, 5, or 10 years. Lenders may require term extensions at loan origination. You cannot shorten a term once extended.

**Q16. Can I unstake early?**  
No. You cannot withdraw staked USDGB before the unlock date unless the certificate is reassigned to a lender after a loan default.

---

## E. Borrowing Against USDGB

**Q17. How do I borrow using my USDGB?**  
Stake USDGB as sUSDGB, then work with a participating institutional lender such as **Genesis Bank & Trust**. If approved, borrow up to **70% LTV** of your base USDGB value. Your sUSDGB remains locked and continues earning 9% APR throughout the loan term.

Example:
- Stake $1,000,000 → sUSDGB locked
- Borrow: $700,000 cash (70% LTV)
- sUSDGB continues earning: $90,000/year (9% APR)

**Q18. What happens if I miss a loan payment?**  
There are **no automatic price-based liquidations** or margin calls. If you default on your contractual loan obligations (miss payments or breach loan covenants), a **30-day cure period** begins. Daily risk notifications are sent. If uncured after 30 days, a guardian-controlled contract may transfer your certificate to the lender. You lose the staked collateral — you bear full credit and default risk.

**Q19. What happens when I fully pay off the loan?**  
The lender releases its lien in the contract. Your certificate remains locked until its unlock date, then you can unstake and withdraw USDGB.

---

## F. Risks

**Q20. Can I lose money with USDGB?**  
Yes. You can lose money via:

- Smart contract exploits (mitigated by InterFi Security audit; residual risk remains)
- Default on your loan — staked collateral is reassigned to lender
- Counterparty risk (Goldbackbond, Trust structure, Genesis Bank & Trust, or lenders defaulting)
- Regulatory changes affecting token utility
- Market/liquidity risk — DEX depth and pricing during early launch phase

There are **no guarantees** of principal, peg, or yield, and USDGB does not offer direct capital redemption.

**Q21. Is this investment advice?**  
No. All information is educational only. Consult your own legal, tax, and financial advisors before making decisions.

---

## G. Compliance and KYC

**Q22. Do I need KYC?**  
Yes, for presale, staking programs, and bank off-ramps, you must complete KYC per the Tier model above. You may trade USDGB on non-custodial DEXs permissionlessly at the protocol level, but you remain responsible for your local legal compliance.

**Q23. Who cannot buy USDGB?**  
Goldbackbond does not sell USDGB to individuals or entities on the OFAC/UN/EU sanctions list, in OFAC-designated sanctioned jurisdictions, or otherwise prohibited by applicable U.S. law.

---

## H. Universal Risk Disclosure

USDGB and sUSDGB are digital utility tokens and are not securities. The 9% annualized growth reward on sUSDGB is a current program target funded by treasury-management activities; it is not a guaranteed return, does not constitute interest income from a fixed-income instrument, and may be modified for future staking programs. sUSDGB is locked while staked and is subject to reassignment to a participating lender in the event of a borrower default. Goldbackbond Secured Debentures are entirely separate instruments issued by Goldbackbond Ltd. and are not referenced by or linked to USDGB token values. This document does not constitute an offer of securities. Consult your financial, legal, and tax advisors before participating.

_Version 4.1 | March 2026_