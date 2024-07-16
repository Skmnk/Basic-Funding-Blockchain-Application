require("@nomicfoundation/hardhat-toolbox");

require("hardhat-deploy");

require("@nomiclabs/hardhat-ethers");

require("dotenv").config();

require("@nomicfoundation/hardhat-verify");


require("hardhat-gas-reporter");

require("solidity-coverage");


require("@nomiclabs/hardhat-ethers");




/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //solidity: "0.8.8",
  solidity: {
    compilers: [
      {version: "0.8.8"},
      {version: "0.6.0"},
      {version: "0.8.4"},
      {version: "0.8.0"}

    ]
  },
  defaultnetwork : "hardhat",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    localhost:{
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    },
    hardhat: {
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  },
  namedAccounts: {
    deployer: {
        default: 0,
        1: 0
    },
},
paths: {
  deploy: "./deploy",
},

gasReporter: {
  enabled : false,
  outputFile : "gas-report.txt",
  noColors : true,
  currency : "USD",
  // coinmarketcap : process.env.COINKARKETCAP_KEY
},
sourcify: {
  enabled: true
}
};
