import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Base Sepolia Addresses
const USDGB_TOKEN = "0xfe57d42b4e32c62f69b22b459d53b9dd9021facf";
const CERTIFICATE_STAKING = "0xc62083ee88a245a98b58707e868c030f3917c4fe";
const TEST_WALLET_ADDRESS = "0x6fAeFE907d887348b70636B57AEDF2BF99fbA032";

async function main() {
    console.log("--- Starting PURE ETHERS Stress Test (Ganache Fork) ---");

    const impersonateAccount = async (address) => {
        try {
            await provider.send("hardhat_impersonateAccount", [address]);
        } catch (e) {
            // Ganache fallback
            await provider.send("evm_addAccount", [address, ""]);
            await provider.send("personal_unlockAccount", [address, "", 0]);
        }
        return await provider.getSigner(address);
    };

    // Helpers for Cross-Node Compatibility (Ganache/Anvil/Hardhat)
    const setBalance = async (address, ethAmount) => {
        try {
            const accounts = await provider.listAccounts();
            if (accounts.length === 0) throw new Error("No unlocked accounts found on the node");
            
            const whale = accounts[0];
            const tx = await whale.sendTransaction({
                to: address,
                value: ethers.parseEther(ethAmount.toString())
            });
            await tx.wait(); // Crucial to prevent race conditions
            console.log(`Successfully funded ${address} with ${ethAmount} ETH (Tx: ${tx.hash})`);
        } catch (e) {
            console.log(`Fallback funding failed: ${e.message}`);
        }
    };

    // 1. Setup Contracts
    const usdgbAbi = [
        "function balanceOf(address) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function mint(address to, uint256 amount) external",
        "function owner() view returns (address)",
        "function grantRole(bytes32 role, address account) external",
        "function MINTER_ROLE() view returns (bytes32)"
    ];
    const usdgb = new ethers.Contract(USDGB_TOKEN, usdgbAbi, provider);

    const stakingAbi = [
        "function stakeForCertificate(uint256 amount)",
        "function userStakes(address) view returns (uint256, uint256)",
        "function paused() view returns (bool)",
        "function unpause() external",
        "function owner() view returns (address)"
    ];
    const staking = new ethers.Contract(CERTIFICATE_STAKING, stakingAbi, provider);

    // 2. Override Access Control & Mint
    try {
        const ownerAddress = await usdgb.owner();
        console.log(`Detected USDGB Admin/Owner: ${ownerAddress}`);
        await setBalance(ownerAddress, 2); // Give Admin gas money
        const adminSigner = await impersonateAccount(ownerAddress);
        
        await setBalance(TEST_WALLET_ADDRESS, 100); // Give Test Wallet gas money
        const testWalletSigner = await impersonateAccount(TEST_WALLET_ADDRESS);

        const MINTER_ROLE = await usdgb.MINTER_ROLE();
        console.log(`Granting MINTER_ROLE to Test Wallet...`);
        const txGrant = await usdgb.connect(adminSigner).grantRole(MINTER_ROLE, TEST_WALLET_ADDRESS);
        await txGrant.wait();
        
        console.log("Minting 1,000,000 USDGB to test wallet directly...");
        const txMint = await usdgb.connect(testWalletSigner).mint(TEST_WALLET_ADDRESS, ethers.parseUnits("1000000", 18));
        await txMint.wait();
        console.log("Mint successful.");
    } catch (e) {
        console.log(`Minting failed: ${e.message}`);
    }

    const testWalletSigner = await impersonateAccount(TEST_WALLET_ADDRESS);
    const balance = await usdgb.balanceOf(TEST_WALLET_ADDRESS);
    console.log(`USDGB Balance: ${ethers.formatUnits(balance, 18)}`);

    // 3. Unpause Staking if needed
    try {
        if (await staking.paused()) {
            const stakingOwner = await staking.owner();
            await setBalance(stakingOwner, 1);
            const sOwnerSigner = await impersonateAccount(stakingOwner);
            const txUnpause = await staking.connect(sOwnerSigner).unpause();
            await txUnpause.wait();
            console.log("Staking unpaused.");
        }
    } catch (e) { }

    // 4. Staking Loop
    const ITERATIONS = 50;
    const STAKE_AMOUNT = ethers.parseUnits("15000", 18);

    console.log(`\n--- Executing ${ITERATIONS} Transactions ---`);
    try {
        const txApprove = await usdgb.connect(testWalletSigner).approve(CERTIFICATE_STAKING, ethers.MaxUint256);
        await txApprove.wait();
        console.log("Staking approved.");
    } catch (e) {
        console.log(`Approval failed: ${e.message}`);
    }

    let successCount = 0;
    for (let i = 1; i <= ITERATIONS; i++) {
        try {
            const tx = await staking.connect(testWalletSigner).stakeForCertificate(STAKE_AMOUNT);
            process.stdout.write(`Tx #${i} success [${tx.hash.substring(0, 10)}...]\n`);
            await tx.wait();
            successCount++;
        } catch (error) {
            process.stdout.write(`Tx #${i} failed: ${error.message.substring(0, 80)}...\n`);
        }
    }

    const finalStake = await staking.userStakes(TEST_WALLET_ADDRESS);
    console.log(`\nSuccess: ${successCount}/${ITERATIONS}`);
    console.log(`Total Staked: ${ethers.formatUnits(finalStake[0], 18)} USDGB`);

    process.exit(0);
}

main().catch(console.error);
