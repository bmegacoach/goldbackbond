# Goldbackbond Architecture

## Overview
Goldbackbond (GBB) is a premium gold-backed stablecoin platform. The ecosystem comprises several smart contracts on the Base Mainnet, designed for secure minting, staking, and liquidity management.

**Documentation Standard**: v4.1 (March 2026) — mandated for all public doc-room assets and AI assistant knowledge base.

## Network Strategy
- **Primary Network**: Base Mainnet (Chain ID 8453)
- **Status**: Production Live
- **DApp Connectivity**: Configured via `wagmi` and `ethers.js` pointing to `https://mainnet.base.org`.

## Core Components
### Smart Contracts
1. **USDGB Token (`0x1b1...`)**: The primary asset, backed by gold certificates.
2. **USDGBMinting (`0x899...`)**: Handles token issuance and purchases.
3. **LpRewardPool (`0xbfb...`)**: Manages rewards for liquidity providers.
4. **CertificateStaking (`0xfe5...`)**: Enables long-term staking of USDGB for leverage/lending.
5. **Guardian (CCA) (`0x4cb...`)**: Acts as a capital conservation and governance layer.
6. **GBBAllocationInscription**: (Pending Deployment) Smart contract interface to mint allocations wrapped as on-chain JSON Ethscriptions.
7. **Uniswap V4 Suite**: `PoolManager`, `LiquidityLauncher`, `Permit2`.

### Technical Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Web3**: Wagmi + Viem + Ethers.js
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Documentation**: Markdown-based content files in `/src/content/docs/` rendered via custom React components.
- **AI Knowledge**: Synchronized `api/aiContext.js` generated from doc source via `api/buildAiContext.mjs`.

## Uniswap V4 CCA Launch Architecture
- **Pool Management**: Uses Uniswap V4 `PoolManager` (`0x498...`).
- **Auction Engine**: Leverages the Uniswap `LiquidityLauncher` and `LBPStrategy` hooks.
- **Approvals**: Uses `Permit2` for gas-efficient, signature-based token authorizations.
- **Liquidity Seeding**: Post-auction proceeds (USDC) are paired with USDGB and migrated into a canonical V4 pool with 0.05% fee and tick spacing 10.
- **CCA Info Page**: A dedicated educational route (`/uniswap-cca`) explaining mechanics, pre-sale value, and timelines.
- **Launch Dates**: March 15 to April 31, 2026.
- **Rewards**: $2M rewards program integrated with V4 positions to incentivize tight liquidity ±0.5-1%. Current target: 9% APR via sUSDGB staking.

## Token Allocation Architecture (Eth-Inscriptions)
- **Methodology**: Rather than raw transaction data URIs holding off-chain validity, GBB issues "Eth-Inscriptions" via a secure smart contract (`GBBAllocationInscription`).
- **Data Standard**: allocations are emitted as an `AllocationInscribed` event containing standard JSON: `data:application/json,{"p":"gbb-allocation","op":"mint","buyer":"0x...","amount":"...","terms":"...","agentInfo":"...","commissionInfo":"..."}`. Phase 15 updates mandate an `"openSignDocumentId"` appending the OpenSign digital contract to the blockchain payload.
- **Access Control**: Strict `onlyMinter` constraint. The contract owner securely reviews all agency requests via the frontend (`/app/allocations`) and executes transactions.

## CRM & Mentorship Architecture
- **AI Mentorship Engine**: Driven by Gemini 1.5 Pro via specialized Serverless API endpoints mapping structured JSON logic. The AI holds dual-role capacities (Skeptical Buyer, Elite Mentor). 
- **Performance Feed**: The overarching Goldbackbond Sales Agency relies natively on `firebase/app` implementations allowing the frontend CRM dashboard to instantly stream live call and close metrics back into the LLM system prompt for active coaching context.
- **Interactive Deal Sequencing**: A Phase 17 Guided Closing Wizard bridges independent agency funnels to the central OpenSign and Ethscription allocation desk, explicitly locking prices mapping standard Web2 KYC into Web3 allocations.
