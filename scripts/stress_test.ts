import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Contract Addresses (from src/lib/contractAddresses.ts)
const CONTRACTS = {
    USDGB_TOKEN: '0xfe57d42b4e32c62f69b22b459d53b9dd9021facf',
    CERTIFICATE_STAKING: '0xc62083ee88a245a98b58707e868c030f3917c4fe',
};

const NETWORK = {
    RPC_URL: 'https://sepolia.base.org',
    CHAIN_ID: 84532,
};

// Colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

async function main() {
    const args = process.argv.slice(2);
    const FORCE_DRY_RUN = args.includes('--dry-run');

    console.log(`${colors.cyan}Starting Goldbackbond Stress Test Simulation...${colors.reset}`);

    // 1. Setup Provider and Wallet
    if (!process.env.PRIVATE_KEY) {
        console.error(`${colors.red}Error: PRIVATE_KEY not found in .env file${colors.reset}`);
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(NETWORK.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`Wallet Address: ${colors.yellow}${wallet.address}${colors.reset}`);

    // 2. Check Network Connection
    try {
        const network = await provider.getNetwork();
        console.log(`Connected to: ${network.name} (Chain ID: ${network.chainId})`);
    } catch (error) {
        console.error(`${colors.red}RPC Connection Failed${colors.reset}`, error);
        process.exit(1);
    }

    // 3. Balance Check & Mode Selection
    const ethBalance = await provider.getBalance(wallet.address);
    console.log(`ETH Balance: ${ethers.formatEther(ethBalance)} ETH`);

    let isDryRun = FORCE_DRY_RUN;

    if (ethBalance < ethers.parseEther('0.001')) {
        if (!FORCE_DRY_RUN) {
            console.warn(`${colors.yellow}Warning: Low ETH balance. Switching to DRY RUN mode (Simulation only).${colors.reset}`);
            isDryRun = true;
        }
    }

    if (isDryRun) {
        console.log(`${colors.cyan}--- DRY RUN MODE ENABLED ---${colors.reset}`);
        console.log(`${colors.gray}Transactions will be simulated via staticCall. No gas will be spent.${colors.reset}`);
    }

    // 4. Load Contracts
    const usdgbAbi = [
        'function balanceOf(address) view returns (uint256)',
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)'
    ];
    const stakingAbi = [
        'function stakeForCertificate(uint256 amount)',
        'function userStakes(address) view returns (uint256, uint256)',
        'function paused() view returns (bool)'
    ];

    const usdgbContract = new ethers.Contract(CONTRACTS.USDGB_TOKEN, usdgbAbi, wallet);
    const stakingContract = new ethers.Contract(CONTRACTS.CERTIFICATE_STAKING, stakingAbi, wallet);

    // 5. Check Contract State (Read-only)
    const isPaused = await stakingContract.paused();
    console.log(`Contract Paused: ${isPaused ? colors.red + 'YES' : colors.green + 'NO'}${colors.reset}`);

    const usdgbBalance = await usdgbContract.balanceOf(wallet.address);
    console.log(`USDGB Balance: ${ethers.formatUnits(usdgbBalance, 18)} USDGB`);

    // 6. Run Simulation loop
    const ITERATIONS = 5;
    const STAKE_AMOUNT = ethers.parseUnits('10', 18);

    console.log(`\n${colors.cyan}--- Starting ${isDryRun ? 'Simulated ' : ''}Staking Sequence ---${colors.reset}`);

    for (let i = 1; i <= ITERATIONS; i++) {
        process.stdout.write(`Tx #${i}: `);

        if (isDryRun) {
            // Simulation Logic
            try {
                // We mock the state change by checking if the call REVERTS
                // Note: simulate stake execution. If user has no USDGB, this staticCall MIGHT fail 
                // depending on contract logic (SafeTransferFrom would revert).
                // But we want to test if the "Function exists and accepts input".

                await stakingContract.stakeForCertificate.staticCall(STAKE_AMOUNT);
                // If it doesn't throw, it "succeeded" logic-wise (or at least reached the transfer step)
                process.stdout.write(`${colors.green}Simulation OK${colors.reset} (StaticCall success)\n`);
            } catch (error: any) {
                // If it reverts due to balance, that's expected but confirms connectivity
                if (error.message.includes('insufficient allowance') || error.message.includes('transfer amount exceeds balance')) {
                    process.stdout.write(`${colors.yellow}Simulated (Reverted as expected: Low Balance/Allowance)${colors.reset}\n`);
                } else {
                    process.stdout.write(`${colors.red}Simulation Error: ${error.reason || error.code}${colors.reset}\n`);
                }
            }
            // Add fake delay to simulate network
            await new Promise(r => setTimeout(r, 500));

        } else {
            // Real Transaction Logic
            try {
                // Check allowance per iteration? No, generally approve once.
                // WE skipped approval logic in loop for verify. logic similar to before...
                // (Approval logic should be outside loop, handled before).

                const tx = await stakingContract.stakeForCertificate(STAKE_AMOUNT);
                process.stdout.write(`Info: Sent ${tx.hash.substring(0, 10)}... `);
                await tx.wait();
                process.stdout.write(`${colors.green}Confirmed${colors.reset}\n`);
            } catch (error: any) {
                process.stdout.write(`${colors.red}Failed: ${error.reason || 'Unknown'}${colors.reset}\n`);
            }
        }
    }

    console.log(`\n${colors.cyan}Test Complete.${colors.reset}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
