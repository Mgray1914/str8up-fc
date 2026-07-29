require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

module.exports = {
  solidity: { version: "0.8.20", settings: { optimizer: { enabled: true, runs: 200 } } },
  networks: {
    hardhat: {},
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      accounts: process.env.PROMO_DEPLOYER_KEY ? [process.env.PROMO_DEPLOYER_KEY] : [],
      chainId: 84532,
    },
    base: {
      url: process.env.BASE_RPC || "https://mainnet.base.org",
      accounts: process.env.PROMO_DEPLOYER_KEY ? [process.env.PROMO_DEPLOYER_KEY] : [],
      chainId: 8453,
    },
  },
};
