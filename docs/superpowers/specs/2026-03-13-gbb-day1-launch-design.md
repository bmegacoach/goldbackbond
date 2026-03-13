# GBB Day-1 Launch Design Spec
**Date:** 2026-03-13
**Author:** Claude Code / Troy Joyner
**Status:** v2 — Post Spec-Review Fixes Applied
**Launch Target:** 2026-03-15 (48 hours)
**Network:** Base Mainnet (chainId: 8453)

---

## 1. Context & Objectives

Goldbackbond (GBB) is a gold-backed stablecoin ecosystem (USDGB token) launching its CCA (Contributor Capital Auction) in 48 hours. The ecosystem is **separate** from CAMP (synthetic stablecoin) but has a capital relationship:

- **GBB → CAMP**: GBB supplies a $100M Insurance Fund to the CAMP protocol via token allocation deposited in CAMP's `CampInsuranceFund` smart contract.
- **CAMP → GBB**: CAMP treasury management provides yield performance on GBB's treasury reserves.

**Launch goals:**
1. Deploy all missing production contracts to Base Mainnet
2. Surface Genesis Bank and Trust as a registered institutional lender (investor confidence)
3. Frontend fully wired to live mainnet contract addresses
4. Build verified and all routes functional

**Revenue targets:**
- Organic launch: onboard first 100 users
- Phase 2 (ads): $10M in sold token allocation
- Ultimate goal: $25M by April 31, 2026

---

## 2. Current Contract State

| Contract | Address | Status |
|---|---|---|
| USDGB Token | `0x1b12fdbda1d6709e189fe16e1a76469e05ce8a5e` | ✅ Live Mainnet |
| Minting | `0x899a399a783494bec8ff8c2ab5ec1fc29efe3a63` | ✅ Live Mainnet |
| LP Reward Pool | `0xbfb2a2d959819590b72815d637e50c16be9cad3f` | ✅ Live Mainnet |
| Gold Bonus Vault | `0x3a3d2a95e29e93b9406f15e4543044a93d495a69` | ✅ Live Mainnet |
| Certificate Staking | `0xfe57d42b4e32c62f69b22b459d53b9dd9021facf` | ✅ Live Mainnet |
| Guardian | `0x4cbce2b39d4974269c7b8b1341dbc7db0352945a` | ✅ Live Mainnet |
| GBBAllocationInscription | `0x0000000000000000000000000000000000000001` | ❌ MISSING — must deploy |
| LenderRegistry | `0x0000000000000000000000000000000000000000` | ❌ MISSING — must write + deploy |

**Gnosis Safe Multisig:** `0xbef82e4eaecba3e50c6ec8539d02fb4a75c452d0` (Base Mainnet)

---

## 3. Workstream 1 — Contract Suite

### 3.1 LenderRegistry.sol (new file)

Write `contracts/LenderRegistry.sol` following the same pattern as `GBBAllocationInscription.sol`.

**ABI CONTRACT — The deployed contract must expose EXACTLY these 5 functions and no others as public/external. Do NOT add constructor events, `transferOwnership`, or any additional public/external functions not in this list. The existing `src/lib/abis/LenderRegistry.json` is the source of truth — do not regenerate or overwrite it.**

```
Storage:
  - owner: address (set in constructor to msg.sender)
  - approvedLenders: mapping(address => bool) (private is fine — not in ABI)

Events:
  - LenderApproved(address indexed lender)
  - LenderRevoked(address indexed lender)

Modifiers:
  - onlyOwner: require(msg.sender == owner)

Functions (all parameter names must use "lender" / "lenders" to match ABI):
  - isApprovedLender(address lender) external view returns (bool)
  - approveLender(address lender) external onlyOwner
  - revokeLender(address lender) external onlyOwner
  - batchApproveLenders(address[] calldata lenders) external onlyOwner
  - batchRevokeLenders(address[] calldata lenders) external onlyOwner
```

### 3.2 Hardhat Config Upgrade

Update `hardhat.config.cjs` with the following — **do NOT add a standalone `require('@nomicfoundation/hardhat-verify')` since `@nomicfoundation/hardhat-toolbox` (already in package.json) bundles it. Also do NOT use `@nomiclabs/hardhat-etherscan` (legacy, incompatible with Hardhat 3).**

Add to config object:

```js
networks: {
  // keep existing hardhat local network...
  basemainnet: {
    url: "https://mainnet.base.org",
    accounts: [process.env.PRIVATE_KEY],
    chainId: 8453,
  },
},
etherscan: {
  apiKey: {
    base: process.env.BASESCAN_API_KEY,
  },
  customChains: [
    {
      network: "base",
      chainId: 8453,
      urls: {
        apiURL: "https://api.basescan.org/api",
        browserURL: "https://basescan.org",
      },
    },
  ],
},
```

> ⚠️ Without the `customChains` entry pointing to `https://api.basescan.org/api`, verification will throw an "unknown network" error.

**Required `.env` keys (Troy adds locally — never committed, verify `.gitignore` covers `.env`):**
```
PRIVATE_KEY=0x<new_deployer_wallet_private_key>
BASESCAN_API_KEY=KMHTI9GSEJZ9NT8Z8A29BPP58VJV7D6GTK
GENESIS_BANK_ADDRESS=0x<genesis_bank_and_trust_wallet>
```

### 3.3 Deploy Script

Write `scripts/deploy.js`. **Deployment and verification are separated into two phases so that a Basescan API delay cannot prevent addresses from being logged.**

**Phase 1 — Deploy + Register + Log (must complete atomically before Phase 2):**
```
1. Guard: if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY not set')
          if (!process.env.GENESIS_BANK_ADDRESS) throw new Error('GENESIS_BANK_ADDRESS not set')
2. Deploy GBBAllocationInscription — no constructor args
3. Deploy LenderRegistry — no constructor args
4. Call lenderRegistry.approveLender(process.env.GENESIS_BANK_ADDRESS) — registers Genesis Bank on-chain
5. Write addresses to deployments/mainnet.json:
   { "GBBAllocationInscription": "<addr>", "LenderRegistry": "<addr>", "timestamp": "<ISO>" }
6. Log all addresses to console
```

**Phase 2 — Verify (non-blocking, can be re-run independently if it fails):**
```
7. npx hardhat verify --network basemainnet <GBBAllocationInscription_addr>
8. npx hardhat verify --network basemainnet <LenderRegistry_addr>
```

> ⚠️ If Phase 2 fails (Basescan timeout or rate limit), re-run independently:
> `npx hardhat verify --network basemainnet <contract_address>`
> Deployed addresses are already safe in `deployments/mainnet.json`.

**Gas cost:** Both contracts together cost ~0.001 ETH on Base Mainnet. Fund deployer wallet with **0.01 ETH** minimum (not "$10 ETH" — 0.01 ETH is approximately $30 at current prices and provides 10x buffer).

**Run command (Troy executes from terminal after setting .env):**
```bash
npx hardhat run scripts/deploy.js --network basemainnet
```

### 3.4 contractAddresses.ts Update (post-deploy)

After deploy, update `src/lib/contractAddresses.ts`:

1. **Fix the stale file header comment on line 5** — change from `NETWORK: Base Sepolia (Testnet) — deployed and audited by InterFi` to `NETWORK: Base Mainnet — production deployment`
2. Replace placeholder addresses:
```ts
ALLOCATION_INSCRIPTION: '<address from deployments/mainnet.json>',
LENDER_REGISTRY: '<address from deployments/mainnet.json>',
```

---

## 4. Workstream 2 — Genesis Bank Plugin Module (Frontend)

### 4.1 New Route + Page

**Insert inside the nested `<Routes>` block within `<AppLayout>` in `App.tsx` — specifically after the `allocations` route and before the closing `</Routes>` tag. Do NOT add at the top-level Routes block (that would break AppLayout context and wallet connection).**

```tsx
{/* Inside <AppLayout> nested Routes, after allocations route */}
<Route path="genesis-bank" element={<GenesisBankPage />} />
```

Also add the import at the top of App.tsx:
```tsx
import GenesisBankPage from './components/pages/GenesisBankPage'
```

This produces the URL `/app/genesis-bank`.

### 4.2 GenesisBankPage.tsx

Location: `src/components/pages/GenesisBankPage.tsx`

**Sections:**
1. **Institution Header** — Genesis Bank and Trust logo area, registered lender badge, on-chain verification link to Basescan LenderRegistry
2. **Live Registry Status** — reads `isApprovedLender(GENESIS_BANK_ADDRESS)` from LenderRegistry using wagmi `useReadContract` — shows ✅ "Verified Institutional Partner" when on-chain read returns `true`
3. **Institution Profile** — charter summary, regulatory standing, capabilities overview (custody, wire origination, institutional lending, asset-backed facilities)
4. **Coming Soon Feature Cards** (4 locked cards):
   - Business Account Origination
   - Institutional Wire Portal
   - Asset-Backed Loan Desk
   - USDGB Custody & Settlement
5. **Waitlist CTA** — "Register Your Institution" — email/institution name capture form
6. **Compliance Footer** — regulatory disclosure, FDIC note, contact info

**Design tokens:** Gold (`#f59e0b`), Slate-900 background — consistent with existing GBB theme.

### 4.3 AppNavbar Entry

Append a new entry to the `navigation` array in `AppNavbar.tsx`:
```tsx
{ name: 'Genesis Bank', href: '/app/genesis-bank', icon: Building2 }
```
- Import `Building2` from `lucide-react`
- Add an amber `Coming Soon` badge as a secondary `<span>` alongside the nav label — requires minor layout adjustment to the map render for that nav item

### 4.4 AppDashboard Institutional Partners Card

Add a new "Institutional Partners" card to `AppDashboard.tsx`:
- Shows Genesis Bank and Trust with green "Registered" pill
- Links to `/app/genesis-bank`
- Increases investor confidence on the main dApp landing screen

---

## 5. Workstream 3 — Build Verification

After contract deploy + address update + all frontend changes:
```bash
cd /c/Users/Troy/Goldbackbond/goldbackbond
npm run build
```

Verify:
- Build succeeds with zero TypeScript errors
- All routes render correctly (spot-check: `/`, `/app`, `/app/genesis-bank`, `/app/allocations`, `/app/lender-dashboard`)
- LenderRegistry `isApprovedLender` on-chain read functions on GenesisBankPage
- AllocationInscription contract callable from AllocationApprovalPage

---

## 6. Workstream 4 — MEMORY.md + Git

- Update `MEMORY.md` with deployed contract addresses
- Commit: `feat: deploy GBBAllocationInscription + LenderRegistry to Base Mainnet, add Genesis Bank module`
- Push to remote

---

## 7. Deployment Sequence (ordered)

```
Day 0 (Now — while I write code):
  1. Troy creates Genesis Bank wallet in MetaMask → "Create Account" → name "Genesis Bank and Trust" → paste address here
  2. Troy creates fresh deployer wallet in MetaMask → fund with 0.01 ETH on Base Mainnet
  3. Troy adds to goldbackbond/.env (locally):
       PRIVATE_KEY=0x<deployer_private_key>
       BASESCAN_API_KEY=KMHTI9GSEJZ9NT8Z8A29BPP58VJV7D6GTK
       GENESIS_BANK_ADDRESS=0x<genesis_bank_address>
  4. Code written: LenderRegistry.sol, hardhat.config.cjs, scripts/deploy.js,
     GenesisBankPage.tsx, App.tsx route, AppNavbar.tsx, AppDashboard.tsx

Day 1 (Troy runs from terminal after .env is set):
  5. npx hardhat run scripts/deploy.js --network basemainnet
  6. Copy addresses from deployments/mainnet.json → contractAddresses.ts (fix header comment too)
  7. npm run build → verify clean
  8. Deploy frontend (Vercel / existing host)

Day 2 (Launch Day):
  9. Smoke test all routes on production URL
  10. CCA goes live
```

---

## 8. Out of Scope for Day 1

- CAMP mainnet deployment (post-CCA, days 3–7)
- GBB → CAMP Insurance Fund deposit (requires CAMP to be on mainnet first)
- CAMP treasury management integration
- Genesis Bank functional features (loan desk, wire portal) — UI shows "Coming Soon"
- LenderRegistry admin UI
- Onboarding/sales/marketing systems (separate workstream, parallel)

---

## 9. Success Criteria

- [ ] `GBBAllocationInscription` verified on Basescan, real address in `contractAddresses.ts`
- [ ] `LenderRegistry` verified on Basescan, Genesis Bank wallet registered on-chain
- [ ] `/app/genesis-bank` renders with live `isApprovedLender` on-chain check showing ✅
- [ ] Genesis Bank visible in AppNavbar (with Coming Soon badge) + AppDashboard (Institutional Partners card)
- [ ] `contractAddresses.ts` header comment corrected (no stale "Base Sepolia" reference)
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] All existing routes unbroken
