require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const TEST_PRIVATE_KEY = process.env.TEST_ACCOUNT_PK;  //Public key = 0xabc7ba74A3ECBDC71f6f39dA58cDD52650a3Fb54


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6",
        settings: { } 
      },
      {
        version: "0.6.12",
        settings: { } 
      }
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
        blockNumber: 11095000
      }
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${TEST_PRIVATE_KEY}`]
    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${TEST_PRIVATE_KEY}`]
    }
  }

};