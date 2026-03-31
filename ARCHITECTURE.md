# Goldbackbond Architecture

## Overview
Goldbackbond (GBB) is a premium gold-backed stablecoin platform. The ecosystem comprises several smart contracts on the Base Mainnet, designed for secure minting, staking, and liquidity management.

**Documentation Standard**: v4.5 (March 2026) — Optimized for repository hygiene and AI efficiency.

## Repository Structure (Compliance v2.1)
- **Root**: Cleaned to <10 files (package.json, tsconfig.json, ARCHITECTURE.md, etc.)
- **`/.antigravity`**: Meta-folder housing configurations (`tailwind.config.js`, `eslint.config.js`), deployment settings, and decision/error logs.
- **`/docs`**: Consolidated documentation and historical implementation summaries.
- **`/training`**: (Unified) The GBB Sales Agency training portal and AI Coaching simulators.
- **`/src`**: Core dApp source code.
- **`/api`**: Vercel Serverless functions for AI interaction (Gemini 1.5 Pro).

## Network Strategy
- **Primary Network**: Base Mainnet (Chain ID 8453)
- **DApp Connectivity**: Configured via `wagmi` and `ethers.js`.

## Core Components
### Smart Contracts
1. **USDGB Token (`0x1b12FDBDa1D6709e189Fe16E1A76469E05CE8A5e`)**: The primary asset.
2. **Guardian (CCA) (`0x4cb...`)**: Capital conservation and governance layer.
3. **Uniswap V4 Suite**: `PoolManager`, `LiquidityLauncher`.

### Technical Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **AI Knowledge**: Synchronized `api/aiContext.js` generated from doc source via `scripts/build_ai_context.mjs`.

## CRM & Mentorship Architecture
- **AI Mentorship Engine**: Driven by Gemini 1.5 Pro via specialized Serverless API endpoints mapping structured JSON logic.
- **Stability Layer**: Unified state management in `TrainingContext.tsx` with a dual-load/write ref protection to prevent UI flickering.
- **Production Build**: Native `npm run build` support restored without manual `dist` pushes.
