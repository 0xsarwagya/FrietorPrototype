import { ethers } from "ethers";

export interface NetworkConfig {
  name:
    | "Polygon Mainnet"
    | "Ethereum Mainnet"
    | "Avalanche Mainnet"
    | "Polygon Mumbai"
    | "Ethereum Goerli"
    | "Avalanche Testnet"
    | "Ethereum Ropsten"
    | "Optimism"
    | "Optimism Goerli";
  id:
    | "polygon_main"
    | "eth_main"
    | "avax_main"
    | "polygon_mum"
    | "eth_goerli"
    | "avax_test"
    | "eth_ropsten"
    | "optimism"
    | "optimism_goerli";
  provider: ethers.providers.JsonRpcProvider;
  historyProvider:
    | "homestead"
    | "goerli"
    | "matic"
    | "maticmum"
    | "maticmum"
    | "optimism"
    | "optimism-goerli";
  native_token: "MATIC" | "ETH" | "AVAX";
  logo_url:
    | "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/matic.svg"
    | "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/eth.svg"
    | "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/avax.svg";
  blockScanner:
    | "https://optimistic.etherscan.io/"
    | "https://goerli-optimism.etherscan.io/"
    | "https://etherscan.io/"
    | "https://goerli.etherscan.io/"
    | "https://polygonscan.com/"
    | "https://mumbai.polygonscan.com/";
}

export type NetworkName =
  | "polygon_main"
  | "eth_main"
  | "avax_main"
  | "polygon_mum"
  | "eth_goerli"
  | "avax_test"
  | "eth_ropsten"
  | "optimism"
  | "optimism_goerli";

export type historyProvider =
  | "homestead"
  | "goerli"
  | "matic"
  | "maticmum"
  | "maticmum"
  | "optimism"
  | "optimism-goerli";
