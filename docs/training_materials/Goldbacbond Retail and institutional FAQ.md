<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>
```
# <q>- Markets move against you.</q> If its pegged to the dollar, markets moving against you is not a risk. The point of holding a stablecoin is to protect you from markets moving against you. lets remove this line. 
```

The website also has a lender onboarding wizard, allowing banks to safely onboard to become an approved participating lender. include that in the institutional FAQ.

Other than that, everything looks good.

Below are the two FAQs with your requested edits applied:

- Retail: removed the “Markets move against you” bullet.
- Institutional: added the lender onboarding wizard language.

***

## 1. Retail FAQ (updated `faq-retail.md`)

```md
# USDGB / Goldbackbond FAQ – Retail Version  
Version 1.0 – March 2026

This FAQ explains USDGB in plain language for everyday users, based on the official whitepaper, users manual, and compliance docs.[file:7][file:8][file:11]

---

## A. Basics

**Q1. What is USDGB in simple terms?**  
USDGB is a digital token that tracks **$1.00 worth of gold at spot price**.[file:2][file:4][file:7][file:11] You can buy it, hold it in your wallet, use it as collateral for loans, and trade it on exchanges.[file:7][file:11]

**Q2. Who runs USDGB?**  
USDGB is issued and operated by **Goldbackbond Inc.**, a Texas company.[file:7][file:11] A separate USDGB Trust Fund holds gold‑related assets, corporate shares, and intellectual property that support the ecosystem’s value and credibility.[file:2][file:4][file:11]

**Q3. Is USDGB a stock or security?**  
No. USDGB is structured as a **utility token**, not a stock or bond.[file:7][file:8][file:11] It does not give you ownership of the company, dividends, or a claim on the Trust’s assets or debentures.[file:7][file:8][file:11]

**Q4. Can I redeem USDGB for physical gold?**  
No. There is **no physical gold redemption**.[file:7][file:8][file:11] You get value from USDGB by trading it, using it in DeFi, or borrowing against it—not by swapping it for gold bars or coins.[file:7][file:11]

---

## B. Backing and Safety

**Q5. What backs USDGB?**  
The USDGB Trust Fund holds a portfolio of Federal Reserve gold certificates, plus 100% of Goldbackbond Inc.’s shares and its core intellectual property, documented in a long‑form Monetization Memorandum and valuation reports.[file:2][file:4][file:11] This structure supports the gold‑linked $1.00 NAV, but token holders only own tokens, not the underlying assets.[file:7][file:8][file:11]

**Q6. Has the code been audited?**  
Yes. InterFi Network audited the USDGB token and staking contracts on **February 2, 2026**, and all identified issues were fixed before deployment.[file:7]

---

## C. Buying and Selling

**Q7. How do I buy in the presale?**  
Until **April 31, 2026**, qualified buyers can purchase USDGB in the presale at **$0.80 per token**, with a **$10,000 minimum**.[file:7][file:8][file:11] You complete KYC, sign an allocation agreement, fund by bank wire or crypto (USDC, USDT, BTC, ETH, SOL), and receive tokens in your wallet **within 2 hours** after funds clear.[file:7][file:8][file:11]

**Q8. What is the “locked private allocation”?**  
Goldbackbond offers up to **$25M** of USDGB at $0.80 to professional buyers in a special **12‑month lock contract**.[file:11] Those tokens cannot be traded, used in Uniswap CCA, or used for arbitrage during the lock period.[file:11]

**Q9. Where will USDGB trade after launch?**  
USDGB follows a staged rollout:[file:7][file:11][web:19][web:52][web:59]  

- Until April 31, 2026: presale + **Uniswap CCA auctions** on Base.  
- May 1 – Oct 31, 2026: trading on DEXs including **Hyperliquid, Aster, Aerodrome, and Jupiter**.  
- From Nov 1, 2026: centralized exchange listings starting with **MEXC**, then a second mid‑tier CEX (BTCC, KuCoin, or similar) on **Jan 1, 2027**.[web:47][web:51][web:54]

---

## D. Staking and Earning

**Q10. How does staking work?**  
You lock USDGB in the official staking contract and receive a **staking certificate** that shows how much you locked and when it unlocks.[file:7][file:11] You earn a fixed APY (for example, 9%) paid weekly in USDGB, plus possible bonus rewards from special programs.[file:7]

**Q11. How long is my money locked?**  
Every stake starts with a **1‑year (365‑day) lock**.[file:7][file:11] You can later extend your certificate to **3, 5, or 10 years**, especially if a lender requires it; when you extend, the unlock date is reset based on the new term and the date you extend.[file:7][file:11] You cannot shorten the term once extended.[file:7][file:11]

**Q12. Can I unstake early?**  
No. You cannot withdraw staked USDGB before the unlock date, unless the certificate is reassigned to a lender after a loan default.[file:7][file:8][file:11]

---

## E. Borrowing Against USDGB

**Q13. How do I borrow using my USDGB?**  
You stake USDGB, get a certificate, and then work with a participating institutional lender.[file:7][file:11] If approved, you can borrow up to **70% of the USD value** of your staked USDGB, usually in cash or stablecoins.[file:7]

**Q14. What happens if I miss a loan payment?**  
If you miss a payment:[file:7][file:8][file:11]  

- A **30‑day late period** starts from the date of the first missed payment.  
- You receive **daily risk notifications** during those 30 days.  
- You can catch up the payment, refinance, or otherwise fix the issue.  
- If you still have not cured the default after 30 days, a guardian‑controlled contract can **transfer your staking certificate to the lender**, and you lose that staked principal.[file:7][file:8][file:11]  

There are **no automatic price‑based liquidations** like on many DeFi platforms.[web:38][web:46]

**Q15. What happens when I fully pay off the loan?**  
When your loan is fully paid, the lender releases its **lien** on your certificate in the contract.[file:7][file:11] Your certificate is still locked until its unlock date, but you are free to use it for a **new loan** or to unstake and withdraw USDGB once it unlocks.[file:7][file:11]

---

## F. Risks

**Q16. Can I lose money with USDGB?**  
Yes. You can lose money if:[file:7][file:8][file:11]  

- Smart contracts fail or are exploited.  
- Lenders or partners default.  
- You take a loan and fail to pay it back, causing loss of your staked USDGB.  

There are no guarantees of principal, peg, or yield.[file:7][file:8][file:11]

**Q17. Is this investment advice?**  
No. All information here is educational only.[file:8][file:11] You should consult your own legal, tax, and financial advisors before making decisions.

---

## G. Compliance and KYC

**Q18. Do I need KYC?**  
Yes, for presale, private allocations, staking programs, and any bank off‑ramps, you must complete KYC and sanctions screening.[file:7][file:8][file:11] You can trade on public DEXs without KYC at the protocol level, but you are still responsible for complying with your local laws.[file:7][file:8]

**Q19. Who cannot buy USDGB?**  
Goldbackbond does not sell USDGB to people or entities in OFAC/UN/EU‑sanctioned countries or in jurisdictions where such tokens are not allowed.[file:7][file:8]

```


***

## 2. Institutional FAQ (updated `faq-institutional.md`)

```md
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
```

If you’re ready, I can now give you the **smart‑contract change list** that precisely implements the 1/3/5/10‑year terms, 30‑day grace logic, lien handling, and private‑allocation lock behavior you’ve documented.

