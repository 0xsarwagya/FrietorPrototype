import { ethers } from "ethers";
import { NetworkConfig } from "./types";

export const networks: Array<NetworkConfig> = [
  {
    name: "Polygon Mainnet",
    id: "polygon_main",
    logo_url:
      "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/matic.svg",
    native_token: "MATIC",
    provider: new ethers.providers.JsonRpcProvider("https://polygon-rpc.com"),
    historyProvider: "matic",
    blockScanner: "https://polygonscan.com/",
  },
  {
    name: "Polygon Mumbai",
    id: "polygon_mum",
    logo_url:
      "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/matic.svg",
    native_token: "MATIC",
    provider: new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.maticvigil.com"
    ),
    historyProvider: "maticmum",
    blockScanner: "https://mumbai.polygonscan.com/",
  },
  {
    name: "Optimism",
    id: "optimism",
    logo_url:
      "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/eth.svg",
    native_token: "ETH",
    provider: new ethers.providers.JsonRpcProvider(
      "https://rpc.ankr.com/optimism"
    ),
    historyProvider: "optimism",
    blockScanner: "https://optimistic.etherscan.io/",
  },
  {
    name: "Optimism Goerli",
    id: "optimism_goerli",
    logo_url:
      "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/eth.svg",
    native_token: "ETH",
    provider: new ethers.providers.JsonRpcProvider(
      "https://optimism-goerli.public.blastapi.io"
    ),
    historyProvider: "optimism-goerli",
    blockScanner: "https://goerli-optimism.etherscan.io/",
  },
  {
    name: "Ethereum Goerli",
    id: "eth_goerli",
    logo_url:
      "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/eth.svg",
    native_token: "ETH",
    provider: new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.public.blastapi.io"
    ),
    historyProvider: "goerli",
    blockScanner: "https://goerli.etherscan.io/",
  },
  {
    name: "Ethereum Mainnet",
    id: "eth_main",
    logo_url:
      "https://raw.githubusercontent.com/Pymmdrza/Cryptocurrency_Logos/5f1b6a0588adeca87fb3259df2b65b0047dafc54/SVG/eth.svg",
    native_token: "ETH",
    provider: new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com"),
    historyProvider: "homestead",
    blockScanner: "https://etherscan.io/",
  },
];
