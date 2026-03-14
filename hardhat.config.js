import hardhatEthersPlugin from "@nomicfoundation/hardhat-ethers";
import { defineConfig } from "hardhat/config";

// NOTE: Hardhat v3 ESM config — mirrors hardhat.config.cjs intent.
// hardhat.config.cjs is kept for toolbox v2 reference; Hardhat v3 loads this file.

export default defineConfig({
  plugins: [hardhatEthersPlugin],
  solidity: "0.8.20",
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337,
      forking: {
        url: "https://sepolia.base.org"
      }
    },
    basemainnet: {
      type: "http",
      url: "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY.replace(/^0x/, '')}`] : [],
      chainId: 8453
    }
  }
});
