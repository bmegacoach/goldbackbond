require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337,
      forking: {
        url: "https://sepolia.base.org"
      }
    }
  }
};
