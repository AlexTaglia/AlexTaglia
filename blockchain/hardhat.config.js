require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();


const { API_URL_RINKEBY, API_URL_GOERLI, API_URL_MAINNET, PRIVATE_KEY, ETHERSCAN_API } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.16",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: API_URL_RINKEBY,
      accounts: [PRIVATE_KEY]
    },
    goerli: {
      url: API_URL_GOERLI,
      accounts: [PRIVATE_KEY]
    },
    mainnet: {
      url: API_URL_MAINNET,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API
  }
};
