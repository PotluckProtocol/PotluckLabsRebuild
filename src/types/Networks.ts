export type Network = {
    name: string;
    symbol: string;
    networkId: number;
    decimals: number;
}

export const NETWORKS: Network[] = [
    {
        name: 'Fantom Opera',
        symbol: 'FTM',
        networkId: 250,
        decimals: 18
    }, {
        name: 'Avalanche Mainnet',
        symbol: 'AVAX',
        networkId: 43114,
        decimals: 18
    }, {
        name: 'Polygon Mainnet',
        symbol: 'MATIC',
        networkId: 137,
        decimals: 18
    }
]