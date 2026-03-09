# CCA Post-Auction Migration Guide

This document outlines the steps the GBB Treasury Multisig (`0xbef...`) must take to conclude the Capital Conservation Account (CCA) auction and seed the primary Uniswap V4 USDGB/USDC liquidity pool.

## Overview
Once the 7-14 day CCA Auction concludes on the Uniswap V4 Liquidity Launcher, the `LBPStrategy` hook will halt trading. The Treasury must then call `migrate` to extract the raised USDC and distribute the corresponding USDGB to participants.

## Migration Steps

### 1. Verify Auction Conclusion
Ensure the auction time has expired and the final clearing price is established. You can verify this on the Base Basescan or via the Uniswap V4 LBP interface.

### 2. Execute Migration Call
The Treasury Multisig must execute the `migrate` function on the `LBPStrategy` hook.

**Contract Interface:**
```solidity
function migrate(
    PoolKey calldata key,
    uint160 sqrtPriceX96,
    uint24 fee
) external returns (uint256 amountUSDC, uint256 amountUSDGB);
```

**Parameters:**
- `key`: The internal PoolKey for the LBP.
- `sqrtPriceX96`: The final clearing price formatted as a sqrt ratio.
- `fee`: The target fee tier for the new permanent pool (e.g., `500` for 0.05%).

### 3. Allocation to Treasury vs. Liquidity
Upon successful migration:
- **60%** of the raised USDC goes to the `Guardian` contract to acquire physical gold certificates.
- **40%** of the raised USDC is paired with an equivalent matching value of newly minted USDGB to seed the permanent Uniswap V4 liquidity pool.

### 4. Seed Permanent V4 Pool
Once the `migrate` function successfully returns the capital, the `LiquidityLauncher` handles the creation of the permanent V4 pool automatically based on the parameters provided in the earlier `distributeToken` call.

## Developer Script Example

If utilizing a Hardhat script or Defender Autotask to trigger this via multisig proposal:

```javascript
const ethers = require('ethers');

async function migrateCCA(signer) {
    const LBP_HOOK_ADDRESS = "0x..."; // Target LBP Strategy Hook
    
    // Minimal ABI for the call
    const abi = ["function migrate((address,address,uint24,int24,address),uint160,uint24) external"];
    const lbpHook = new ethers.Contract(LBP_HOOK_ADDRESS, abi, signer);
    
    // Example PoolKey values
    const poolKey = {
        currency0: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
        currency1: "0x1b12fdbda1d6709e189fe16e1a76469e05ce8a5e", // USDGB on Base
        fee: 3000, 
        tickSpacing: 60,
        hooks: LBP_HOOK_ADDRESS
    };
    
    // Set for permanent pool to be 0.05%
    const targetFee = 500; 
    const currentSqrtPrice = "..."; // Fetch from Hook State
    
    console.log("Proposing migration...");
    const tx = await lbpHook.migrate(poolKey, currentSqrtPrice, targetFee);
    await tx.wait();
    console.log("Migration successful!");
}
```
