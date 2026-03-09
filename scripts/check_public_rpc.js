import { ethers } from "ethers";

const RPC_URL = "https://sepolia.base.org";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const USDGB_TOKEN = "0xfe57d42b4e32c62f69b22b459d53b9dd9021facf";
const CERTIFICATE_STAKING = "0xc62083ee88a245a98b58707e868c030f3917c4fe";

async function main() {
    console.log("Checking contract bytecode on public Base Sepolia RPC...");

    const blockNumber = await provider.getBlockNumber();
    console.log(`Current Block Number: ${blockNumber}`);

    const tokenCode = await provider.getCode(USDGB_TOKEN);
    console.log(`USDGB Token Code: ${tokenCode.length > 2 ? 'DEPLOYED' : 'EMPTY'} (${tokenCode.length} bytes)`);

    const stakingCode = await provider.getCode(CERTIFICATE_STAKING);
    console.log(`Staking Code:     ${stakingCode.length > 2 ? 'DEPLOYED' : 'EMPTY'} (${stakingCode.length} bytes)`);

    process.exit(0);
}

main().catch(console.error);
