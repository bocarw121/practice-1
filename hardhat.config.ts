import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

import 'hardhat-deploy';
import { envConfig } from './config';

const { SEPOLIA_RPC_URL, META_MASK_PRIVATE_KEY, ETHERSCAN_API_KEY } = envConfig;

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [META_MASK_PRIVATE_KEY!],
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
