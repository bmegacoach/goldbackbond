require("@nomicfoundation/hardhat-toolbox");
// NOTE: Do NOT require("@nomicfoundation/hardhat-verify") — bundled in toolbox v6.
// NOTE: Do NOT require("@nomiclabs/hardhat-etherscan") — legacy, causes conflicts.

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
      url: "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY.replace(/^0x/, '')}`] : [],
      chainId: 8453
    }
  },
  etherscan: {
    apiKey: {
      basemainnet: process.env.ETHERSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "basemainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ]
  }
};
