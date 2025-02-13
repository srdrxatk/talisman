import { Chain } from "viem"
import {
  arbitrum,
  astar,
  avalanche,
  base,
  baseGoerli,
  bsc,
  bscTestnet,
  gnosis,
  goerli,
  hardhat,
  mainnet,
  manta,
  mantaTestnet,
  moonbaseAlpha,
  moonbeam,
  moonriver,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
} from "wagmi/chains"

const shibuya: Chain = {
  id: 81,
  name: "Shibuya",
  nativeCurrency: {
    name: "SBY",
    symbol: "SBY",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://evm.shibuya.astar.network"] },
    public: { http: ["https://evm.shibuya.astar.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Moonriverscan", url: "https://blockscout.com/shibuya/" },
    default: { name: "Moonriverscan", url: "https://blockscout.com/shibuya/" },
  },
}

const shiden: Chain = {
  id: 336,
  name: "Shiden",
  nativeCurrency: {
    name: "SDN",
    symbol: "SDN",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://evm.shiden.astar.network"] },
    public: { http: ["https://evm.shiden.astar.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Moonriverscan", url: "https://blockscout.com/shiden/" },
    default: { name: "Moonriverscan", url: "https://blockscout.com/shiden/" },
  },
}

const mandalaTestnet: Chain = {
  id: 595,
  name: "Mandala Testnet",
  nativeCurrency: {
    name: "ACA",
    symbol: "ACA",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://mandala-rpc.aca-staging.network"] },
    public: { http: ["https://mandala-rpc.aca-staging.network"] },
  },
}

const acala: Chain = {
  id: 787,
  name: "Acala EVM+",
  nativeCurrency: {
    name: "ACA",
    symbol: "ACA",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.evm.acala.network"] },
    public: { http: ["https://rpc.evm.acala.network"] },
  },
}

const karura: Chain = {
  id: 686,
  name: "Karura EVM+",
  nativeCurrency: {
    name: "KAR",
    symbol: "KAR",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://eth-rpc-karura.aca-api.network"] },
    public: { http: ["https://eth-rpc-karura.aca-api.network"] },
  },
}

export const talismanChains = [
  moonbeam,
  moonbaseAlpha,
  moonriver,
  hardhat,
  astar,
  shibuya,
  shiden,
  avalanche,
  bsc,
  mainnet,
  arbitrum,
  bscTestnet,
  gnosis,
  goerli,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  mandalaTestnet,
  karura,
  acala,
  base,
  baseGoerli,
  manta,
  mantaTestnet,
] as const
