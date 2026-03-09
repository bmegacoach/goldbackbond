import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Base Sepolia Addresses
const USDGB_TOKEN = "0xfe57d42b4e32c62f69b22b459d53b9dd9021facf";
const CERTIFICATE_STAKING = "0xc62083ee88a245a98b58707e868c030f3917c4fe";

async function main() {
    console.log("Checking contract bytecode on local fork...");

    const blockNumber = await provider.getBlockNumber();
    console.log(`Synced Block Number: ${blockNumber}`);

    const tokenCode = await provider.getCode(USDGB_TOKEN);
    console.log(`USDGB Token Code Length: ${tokenCode.length} (Expected > 2)`);
    if (tokenCode === "0x") console.log("=> WARNING: USDGB token address is EMPTY on this network fork!");

    const stakingCode = await provider.getCode(CERTIFICATE_STAKING);
    console.log(`Staking Code Length: ${stakingCode.length} (Expected > 2)`);
    if (stakingCode === "0x") console.log("=> WARNING: Staking address is EMPTY on this network fork!");

    process.exit(0);
}

main().catch(console.error);
