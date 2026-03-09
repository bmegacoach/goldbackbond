# USDGB / Goldbackbond FAQ – Institutional Version  
Version 1.0 – March 2026

This FAQ is written for institutional allocators, lenders, and counterparties familiar with digital assets and structured products. It summarizes the institutional mechanics of USDGB based on the whitepaper, users manual, and compliance framework.[file:7][file:8][file:11]

---

## A. Product Structure

**Q1. How is USDGB defined at the asset level?**  
USDGB is a gold‑backed **utility token** designed to track **$1.00 worth of gold at spot** rather than a full ounce, with no physical redemption right.[file:2][file:4][file:7][file:11] It is intended to function as a gold‑linked stable unit for trading, collateralization, and structured products rather than as a direct metal entitlement.[file:7][file:11]

**Q2. What is the legal and corporate structure behind USDGB?**  
The ecosystem comprises three distinct layers:[file:2][file:4][file:7][file:11]  

- **USDGB Trust Fund** – holds a portfolio of Federal Reserve gold certificates, 100% of Goldbackbond Inc.’s equity, and Goldbackbond’s core intellectual property plus associated valuations.  
- **Goldbackbond LTD (Delaware)** – issues Class A debentures to accredited and institutional investors via licensed broker‑dealers.  
- **Goldbackbond Inc. (Texas)** – issues and operates the USDGB token and staking contracts, and runs distribution, integrations, and operations.  

USDGB holders own tokens only; they do not acquire any interest in the Trust, debentures, or corporate equity.[file:7][file:8][file:11]

**Q3. Is USDGB a security in any jurisdiction?**  
USDGB is structured and marketed as a **non‑security utility token**: no equity, dividends, or profit‑sharing and no direct claims on Trust assets.[file:7][file:8][file:11] Debentures are securities of Goldbackbond LTD and are offered separately via broker‑dealers to accredited investors only.[file:11][file:12]

---

## B. Backing, Valuation, and Attestation

**Q4. What assets sit in the Trust and how are they valued?**  
The Trust holds:[file:2][file:4][file:11]  

- A portfolio of Series 1934 Federal Reserve Gold Certificate Bearer Instruments with attached coupons.  
- 100% of the issued and outstanding shares of Goldbackbond Inc.  
- Goldbackbond’s core intellectual property portfolio and a third‑party IP valuation.  

The gold certificates are documented in a 10‑year Monetization Memorandum and a **Colburn Valuation Report** (9 July 2025) that estimates each bond’s gold‑backed value at roughly **USD 11.979B** (gold + interest components) using prevailing gold prices.[file:4] Internally, Goldbackbond applies more conservative assumptions and does not treat the Colburn valuation as a guaranteed redemption value.[file:2][file:4]

**Q5. How is the $1.00 NAV peg to gold maintained?**  
USDGB’s target NAV is $1.00 worth of gold at spot; as gold prices move, the amount of gold notionally represented per token adjusts while the USD unit remains at $1.[file:7][file:8] Market‑level enforcement relies on:[file:7][web:16][web:19][web:24]  

- CCA‑driven price discovery at launch.  
- Liquidity provision across multiple DEX and CEX venues.  
- Arbitrage by professional traders when USDGB deviates from its intended NAV.  

There is no hard on‑chain redemption arbitrage because there is no physical gold redemption; the peg is economic and market‑driven, not redeemability‑driven.[file:7][file:11]

---

## C. Smart Contracts, Audit, and Governance

**Q6. What are the core contracts and who controls them?**  
Key contracts include:[file:7][file:11]  

- **USDGB ERC‑20 token** (max supply 250.56B).  
- **CertificateStaking** contract for staking and certificate issuance.  
- **Guardian‑controlled certificate collateral logic** for default handling.  
- **Private allocation lockup** contracts for 12‑month strategic allocations.  

Administrative roles (including GUARDIAN_ROLE) are held by Gnosis Safe multisigs rather than EOAs.[file:7][file:8]

**Q7. Have the contracts been audited?**  
Yes. **InterFi Network** audited the token, staking, and admin‑role configuration on **February 2, 2026**; all identified issues (including centralization and typical Solidity risks) were remediated prior to mainnet deployment.[file:7]

---

## D. Staking, Term Structure, and Rewards

**Q8. How does the staking term structure work?**  
Staking produces an on‑chain certificate characterized by:[file:7][file:11]  

- **Base term:** 365‑day (1‑year) lock for all new stakes.  
- **Extension options:** holders may extend to **3, 5, or 10 years** at any time after initial staking; in practice, lenders may require extensions at loan origination.  
- **Clock reset:** any extension resets the unlock timestamp based on the extension date plus the chosen term (e.g., extend to 5 years on a given date → new unlock = date + 5 years).  
- **No reversion:** terms cannot be shortened; there is no facility to reduce a 5‑year lock back to 1 year.[file:7][file:11]  

This produces a term structure more akin to secured funding or term repo than typical DeFi staking.

**Q9. What is the reward model on staked USDGB?**  
Rewards come from treasury operations and program reserves, not directly from new buyers.[file:7][file:11] The staking program offers:[file:7]  

- A fixed base APY (e.g., 9%) configured in the contract.  
- Continuous accrual with rewards **calculated daily and paid weekly** in USDGB.  
- Optional gold‑price‑linked bonus pools capped at an additional 15% APY, calibrated as 3% APY per 5% increase in gold relative to a baseline over rolling 30‑day windows.[file:7]  

Parameters are transparently published and may be adjusted for new program vintages.

---

## E. Collateralization, LTV, and Default Mechanics

**Q10. How is USDGB used as collateral and what LTVs are expected?**  
Participating institutional lenders recognize staking certificates as collateral and may extend credit up to **70% LTV** of the USD value of staked USDGB.[file:7][file:11] In their internal models, some lenders may treat the underlying Trust‑backed collateral as up to **3x risk‑adjusted collateral**, enhancing their safety buffer while maintaining borrower LTV at 70% of nominal value.[file:7]

**Q11. How are liens and re‑hypothecation handled?**  
When a certificate is pledged, the staking contract marks it as **encumbered by a lien** in favor of the lender.[file:7][file:11] While encumbered, the borrower cannot transfer or re‑pledge the certificate; the only allowed operations are:  

- Lender‑initiated lien release on payoff.  
- GUARDIAN_ROLE‑initiated reassignment to the lender in default scenarios.  

There is no embedded re‑hypothecation of certificates within the protocol; any such activity is governed by lender agreements off‑chain.[file:7][file:11]

**Q12. How is default handled compared to typical DeFi liquidations?**  
Instead of automated price‑triggered liquidations, USDGB uses a **guardian‑controlled, time‑based default process**:[file:7][file:8][web:38][web:46]  

- A **first missed‑payment timestamp** is recorded when a borrower misses a loan payment.  
- A **30‑day late period** begins, during which the borrower receives daily risk notifications and has the right to cure by paying, refinancing, or restructuring.  
- Only if the default is still uncured at **30 days** (or other material default events occur) may the GUARDIAN multisig reassign the certificate to the lender, transferring the right to the locked USDGB at maturity.[file:7][file:8]  

There is no price‑based margin call logic at the contract level; risk is contractual and time‑based, not strictly mark‑to‑market.

**Q13. What happens on payoff?**  
Upon full payoff of principal and interest, the lender (or servicing agent) issues an on‑chain instruction to **release the lien**.[file:7][file:11] The certificate becomes unencumbered but remains locked until its scheduled unlock date; the holder may then use it as collateral for a new facility or simply wait to unstake and withdraw the underlying USDGB at maturity.[file:7][file:11]

---

## F. Launch, Liquidity, and Counterparty Considerations

**Q14. What is the launch and liquidity roadmap?**  
Goldbackbond targets **$100M Year‑1 liquidity** across:[file:11][web:47][web:51][web:60][web:64]  

- **$25M locked strategic allocation** – $0.80 tokens in a 12‑month lock contract.  
- **$25M presale + Uniswap CCA** – at $0.80 presale plus CCA tranches ($0.85–$1.00) on Base through April 31, 2026.[web:19][web:52][web:59]  
- **$50M DEX liquidity** – across Hyperliquid, Aster, Aerodrome, and Jupiter from May 1 to Oct 31, 2026.[file:7][file:11]  

CEX rollout begins Nov 1, 2026 with MEXC, followed by a second mid‑tier CEX on Jan 1, 2027.[web:47][web:51][web:54]

**Q15. How should institutions think about custody, integration, and onboarding as lenders?**  
Because USDGB is an EVM‑based ERC‑20, it can be supported by:[file:7][file:11]  

- Standard institutional MPC and multi‑sig custody platforms.  
- Exchange and OTC desk infrastructure that already supports ERC‑20 tokens.  
- On‑chain reporting and monitoring tools for exposure, flows, and counterparty analysis, similar to other stablecoins and RWAs.[web:73][web:76]  

Goldbackbond also offers a **lender onboarding wizard** on its website that walks banks and credit institutions through KYC/AML checks, documentation, and technical integration steps before they are listed as approved participating lenders in the ecosystem.

---

## G. Risk, Regulatory, and Compliance

**Q16. What are the primary risk categories for institutional allocators?**  

- **Smart contract risk:** residual exploit risk despite audit.[file:7]  
- **Counterparty/custodial risk:** Trust, Goldbackbond entities, banks, and lenders could default or be impaired.[file:7][file:11]  
- **Regulatory risk:** evolving treatment of utility tokens, stablecoins, and gold‑linked products.[file:8][file:11][web:71][web:73]  
- **Market/liquidity risk:** spreads, depth, and volatility across DEX/CEX venues, especially in early months.[web:47][web:51][web:78]  
- **Credit risk:** borrower defaults with insufficient remediation during the 30‑day grace period.[file:7][file:8]

**Q17. How is KYC/AML handled?**  
Goldbackbond operates a **full KYC/AML stack** for primary issuance, private allocations, staking programs, lender onboarding, and fiat off‑ramps:[file:7][file:8][file:11]  

- Identity verification, sanctions screening, and risk scoring at onboarding.  
- Documentation retention consistent with financial‑institution expectations.  
- Ongoing monitoring and escalation for suspicious activity.[web:73][web:76]  

DEX trading is non‑custodial and permissionless at the protocol level, but Goldbackbond’s direct relationships are limited to non‑sanctioned, KYC‑cleared participants.[file:7][file:8]

---

## H. Interactions with Debentures and Other Instruments

**Q18. How do USDGB tokens relate to Goldbackbond LTD debentures?**  
They are **separate products** with distinct documentation, investor bases, and regulatory treatments:[file:11][file:12]  

- USDGB: utility token, gold‑linked NAV, used primarily in crypto and DeFi contexts.  
- Class A debentures: fixed‑income securities of Goldbackbond LTD, listed on Bloomberg and sold via broker‑dealers to accredited investors.  

There is no direct on‑chain linkage where one instrument auto‑converts to or redeems the other; any cross‑exposure is via balance‑sheet strategy and capital allocation at the corporate level.[file:11]

**Q19. Are there planned integrations with other DeFi protocols?**  
Goldbackbond’s immediate focus is on Uniswap CCA, Hyperliquid, Aster, Aerodrome, and Jupiter.[file:7][file:11][web:19][web:52][web:59] Additional DeFi integrations (e.g., lending pools, structured‑product wrappers) may be pursued once sufficient track record, liquidity, and compliance comfort are established.

---

_End of USDGB / Goldbackbond FAQ – Institutional Version_