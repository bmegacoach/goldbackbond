import { ethers } from "ethers";

const RPC_URL = "https://sepolia.base.org";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const USDGB_TOKEN = "0xfe57d42b4e32c62f69b22b459d53b9dd9021facf";
const abi = [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

async function main() {
    console.log("Querying Transfer events to find USDGB holders...");
    const usdgb = new ethers.Contract(USDGB_TOKEN, abi, provider);
    
    try {
        // Contract was likely deployed in the last few million blocks.
        // We query from block 20,000,000 to latest. Base Sepolia is around 38M.
        const currentBlock = await provider.getBlockNumber();
        const startBlock = currentBlock - 100000; // Search last 100k blocks (approx 2 days)
        // If it fails, we will expand
        
        console.log(`Scanning from block ${startBlock} to ${currentBlock}...`);
        
        let holders = {};
        
        // Query in chunks of 9000 to avoid RPC limits
        for(let i=startBlock; i<currentBlock; i+=9000) {
            let toBlock = i+8999;
            if(toBlock > currentBlock) toBlock = currentBlock;
            console.log(`Fetching ${i} to ${toBlock}...`);
            const filter = usdgb.filters.Transfer();
            const events = await usdgb.queryFilter(filter, i, toBlock);
            for(let e of events) {
                const to = e.args[1];
                const from = e.args[0];
                const val = e.args[2];
                holders[to] = (holders[to] || 0n) + val;
                if(holders[from]) {
                    holders[from] -= val;
                }
            }
        }
        
        // Sort
        let arr = Object.entries(holders).map(([addr, bal]) => ({ addr, bal }));
        arr.sort((a,b) => a.bal > b.bal ? -1 : 1);
        
        console.log(`\nTop Holders found:`);
        for(let i=0; i<Math.min(10, arr.length); i++) {
            console.log(`${i+1}. ${arr[i].addr}: ${ethers.formatUnits(arr[i].bal, 18)} USDGB`);
        }
        
    } catch(e) {
        console.error(`Query failed:`, e.message);
    }
    process.exit(0);
}
main();
