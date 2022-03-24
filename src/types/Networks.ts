export type Network = {
    name: string;
    symbol: string;
    networkId: number;
    decimals: number;
}

export const NETWORKS: Network[] = [{
    name: 'Fantom Opera',
    symbol: 'FTM',
    networkId: 250,
    decimals: 18
}]