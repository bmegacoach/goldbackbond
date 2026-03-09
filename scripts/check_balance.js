import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const USDGB_TOKEN = "0xfe57d42b4e32c62f69b22b459d53b9dd9021facf";
const MINTER_CONTRACT = "0x4cbce2b39d4974269c7b8b1341dbc7db0352945a";
const TEST_WALLET_ADDRESS = "0x6fAeFE907d887348b70636B57AEDF2BF99fbA032";

const minterAbi = [
    "function mint(address to, uint256 amount) external",
    "function paused() view returns (bool)",
    "function MINTER_ROLE() view returns (bytes32)",
    "function hasRole(bytes32 role, address account) view returns (bool)",
    "function grantRole(bytes32 role, address account) external"
];

async function main() {
    console.log("Testing USDGBMinting proxy...");
    const mintingContract = new ethers.Contract(MINTER_CONTRACT, minterAbi, provider);

    const impersonateAccount = async (address) => {
        try {
            await provider.send("hardhat_impersonateAccount", [address]);
        } catch (e) {
            await provider.send("evm_addAccount", [address, ""]);
            await provider.send("personal_unlockAccount", [address, "", 0]);
        }
        return await provider.getSigner(address);
    };

    // 1. Give the owner of the minting contract gas money
    const ownerAddr = "0xE9Eb8E7B94C1Ebb02Ac44975435e3d2bCa8E6a33";
    try {
        const accounts = await provider.listAccounts();
        const whale = accounts[0];
        const tx = await whale.sendTransaction({ to: ownerAddr, value: ethers.parseEther("1.0") });
        await tx.wait();
    } catch(e) {}

    const ownerSigner = await impersonateAccount(ownerAddr);

    try {
        const isPaused = await mintingContract.paused();
        console.log(`Minting Contract Paused: ${isPaused}`);
        
        // 2. Grant MINTER_ROLE on the proxy contract to the owner
        const MINTER_ROLE = await mintingContract.MINTER_ROLE();
        const hasRole = await mintingContract.hasRole(MINTER_ROLE, ownerAddr);
        if (!hasRole) {
            console.log("Granting MINTER_ROLE on proxy to Owner...");
            const txGrant = await mintingContract.connect(ownerSigner).grantRole(MINTER_ROLE, ownerAddr);
            await txGrant.wait();
        }

        // 3. Try minting via proxy
        console.log("Minting via proxy...");
        const txMint = await mintingContract.connect(ownerSigner).mint(TEST_WALLET_ADDRESS, ethers.parseUnits("1000", 18));
        await txMint.wait();
        console.log("Success! Proxy minting worked.");
    } catch(e) {
        console.error("Proxy mint failed:", e.message);
    }
    process.exit(0);
}
main();
