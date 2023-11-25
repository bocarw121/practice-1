import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  META_MASK_PRIVATE_KEY: process.env.META_MASK_PRIVATE_KEY,
  SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL,
  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  GOERLI_RPC_URL: process.env.GOERLI_RPC_URL,
  APEX_PRIVATE_KEY: process.env.APEX_PRIVATE_KEY,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
};
