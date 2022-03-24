export type ProjectBaseInformation = {
    name: string;
    symbol: string;
    contractAddress: string;
    network: 'Fantom' | 'Avalanche' | 'Polygon';
    maxSupply: number;
    mint?: {
        weiCost: number;
        gasLimit: number;
        mintImage: string;
        noWhitelist?: boolean;
        forceEndedState?: boolean;
    }
}