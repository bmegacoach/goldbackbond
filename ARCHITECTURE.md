# Goldbackbond Architecture

## Overview
Goldbackbond (GBB) is a premium gold-backed stablecoin platform. The ecosystem comprises several smart contracts on the Base Mainnet, designed for secure minting, staking, and liquidity management.

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

## Uniswap V4 CCA Launch Architecture
- **Pool Management**: Uses Uniswap V4 `PoolManager` (`0x498...`).
- **Auction Engine**: Leverages the Uniswap `LiquidityLauncher` and `LBPStrategy` hooks.
- **Approvals**: Uses `Permit2` for gas-efficient, signature-based token authorizations.
- **Liquidity Seeding**: Post-auction proceeds (USDC) are paired with USDGB and migrated into a canonical V4 pool with 0.05% fee and tick spacing 10.
- **Rewards**: $2M rewards program integrated with V4 positions to incentivize tight liquidity ±0.5-1%.

## Token Allocation Architecture (Eth-Inscriptions)
- **Methodology**: Rather than raw transaction data URIs holding off-chain validity, GBB issues "Eth-Inscriptions" via a secure smart contract (`GBBAllocationInscription`).
- **Data Standard**: allocations are emitted as an `AllocationInscribed` event containing standard JSON: `data:application/json,{"p":"gbb-allocation","op":"mint","buyer":"0x...","amount":"...","terms":"...","agentInfo":"...","commissionInfo":"..."}`.
- **Access Control**: Strict `onlyMinter` constraint. The contract owner securely reviews all agency requests via the frontend (`/app/allocations`) and executes transactions.
