import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);
const TEST_WALLET_ADDRESS = "0x6fAeFE907d887348b70636B57AEDF2BF99fbA032";

async function main() {
    try {
        const accounts = await provider.listAccounts();
        console.log(`Found ${accounts.length} accounts on Ganache.`);
        
        if (accounts.length === 0) throw new Error("No accounts found!");

        // In ethers v6, listAccounts() returns an array of JsonRpcSigner objects!
        const whale = accounts[0];
        console.log(`Whale Address: ${whale.address}`);
        const whaleBal = await provider.getBalance(whale.address);
        console.log(`Whale Balance: ${ethers.formatEther(whaleBal)} ETH`);

        console.log(`Sending ETH to ${TEST_WALLET_ADDRESS}...`);
        const tx = await whale.sendTransaction({
            to: TEST_WALLET_ADDRESS,
            value: ethers.parseEther("1.0")
        });
        await tx.wait();
        
        const newBal = await provider.getBalance(TEST_WALLET_ADDRESS);
        console.log(`Success! Test wallet balance is now: ${ethers.formatEther(newBal)} ETH`);
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

main();
