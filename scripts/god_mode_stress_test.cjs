const { ethers } = require("hardhat");
require("dotenv").config();

const USDGB_TOKEN = "0xfe57d42b4e32c62f69b22b459d53b9dd9021facf";
const CERTIFICATE_STAKING = "0xc62083ee88a245a98b58707e868c030f3917c4fe";
const TEST_WALLET_ADDRESS = "0x6fAeFE907d887348b70636B57AEDF2BF99fbA032";

async function main() {
    console.log("--- Starting GOD-MODE Stress Test (Hardhat CJS Native) ---");
    
    const provider = ethers.provider;
    
    // 1. Setup Contracts
    const usdgbAbi = [
        "function balanceOf(address) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function mint(address to, uint256 amount) external",
        "function owner() view returns (address)"
    ];
    const usdgb = await ethers.getContractAt(usdgbAbi, USDGB_TOKEN);

    const stakingAbi = [
        "function stakeForCertificate(uint256 amount)",
        "function userStakes(address) view returns (uint256, uint256)",
        "function paused() view returns (bool)",
        "function unpause() external",
        "function owner() view returns (address)"
    ];
    const staking = await ethers.getContractAt(stakingAbi, CERTIFICATE_STAKING);

    // 2. God-Mode Balance Overwrite (Direct EVM Storage Manipulation)
    console.log("Directly manipulating EVM Storage to force 1,000,000 USDGB...");
    
    let addressValue = TEST_WALLET_ADDRESS.toLowerCase();
    let addressPadded = ethers.zeroPadValue(addressValue, 32);

    for (let slot = 0; slot <= 5; slot++) {
        let slotPadded = ethers.zeroPadValue(ethers.toBeHex(slot), 32);
        let mappingSlot = ethers.keccak256(ethers.concat([addressPadded, slotPadded]));
        
        let targetBalance = ethers.toBeHex(ethers.parseUnits("1000000", 18));
        targetBalance = ethers.zeroPadValue(targetBalance, 32);
        
        await provider.send("hardhat_setStorageAt", [
            USDGB_TOKEN,
            mappingSlot,
            targetBalance
        ]);
    }
    
    console.log("Storage slots overwritten successfully.");
    const balance = await usdgb.balanceOf(TEST_WALLET_ADDRESS);
    console.log(`USDGB Balance: ${ethers.formatUnits(balance, 18)}`);

    if (balance === 0n) {
         console.log("CRITICAL WARN: Storage slot mapping failed. Contract layout differs from standard OpenZeppelin.");
    }

    // Give some ETH
    await provider.send("hardhat_setBalance", [
        TEST_WALLET_ADDRESS,
        ethers.toBeHex(ethers.parseEther("100"))
    ]);

    await provider.send("hardhat_impersonateAccount", [TEST_WALLET_ADDRESS]);
    const testWalletSigner = await ethers.getSigner(TEST_WALLET_ADDRESS);

    // 3. Unpause Staking if needed
    try {
        if (await staking.paused()) {
            const stakingOwner = await staking.owner();
            await provider.send("hardhat_impersonateAccount", [stakingOwner]);
            await provider.send("hardhat_setBalance", [stakingOwner, ethers.toBeHex(ethers.parseEther("10.0"))]);
            const sOwnerSigner = await ethers.getSigner(stakingOwner);
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
            if(i === 1) break; // If first fails, break
        }
    }

    const finalStake = await staking.userStakes(TEST_WALLET_ADDRESS);
    console.log(`\nSuccess: ${successCount}/${ITERATIONS}`);
    console.log(`Total Staked: ${ethers.formatUnits(finalStake[0], 18)} USDGB`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
