import { Token } from "./Token";

export type Network = Token & {
    name: string;
    networkId: number;
    primaryColor: string;
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
        primaryColor: '#25b6ea',
        blockchainExplorer: {
            name: 'FTMScan',
            url: 'https://ftmscan.com/'
        }
    }, {
        name: 'Avalanche Mainnet',
        symbol: 'AVAX',
        networkId: 43114,
        decimals: 18,
        primaryColor: '#e84142',
        blockchainExplorer: {
            name: 'Snowtrace',
            url: 'https://snowtrace.io/'
        }
    }, {
        name: 'Polygon Mainnet',
        symbol: 'MATIC',
        networkId: 137,
        decimals: 18,
        primaryColor: '#000',
        blockchainExplorer: {
            name: 'Polygonscan',
            url: 'https://polygonscan.com/'
        }
    }, {
        name: 'Fantom Testnet',
        symbol: 'FTM',
        networkId: 4002,
        decimals: 18,
        primaryColor: '#25b6ea',
        blockchainExplorer: {
            name: 'FTMScan',
            url: 'https://testnet.ftmscan.com/'
        }
    }
]