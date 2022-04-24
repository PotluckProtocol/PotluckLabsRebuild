import { Token } from "./Token";

export type Network = Token & {
    name: string;
    networkId: number;
    blockchainExplorer: {
        name: string;
        url: string;
    }
}

export const NETWORKS: Network[] = [
    {
        name: 'Fantom Opera',
        symbol: 'FTM',
        networkId: 250,
        decimals: 18,
        blockchainExplorer: {
            name: 'FTMScan',
            url: 'https://ftmscan.com/'
        }
    }, {
        name: 'Avalanche Mainnet',
        symbol: 'AVAX',
        networkId: 43114,
        decimals: 18,
        blockchainExplorer: {
            name: 'Snowtrace',
            url: 'https://snowtrace.io/'
        }
    }, {
        name: 'Polygon Mainnet',
        symbol: 'MATIC',
        networkId: 137,
        decimals: 18,
        blockchainExplorer: {
            name: 'Polygonscan',
            url: 'https://polygonscan.com/'
        }
    }
]