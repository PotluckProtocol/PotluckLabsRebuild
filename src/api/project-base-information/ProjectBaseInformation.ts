export type ProjectBaseInformation = {
    name: string;
    symbol: string;
    contractAddress: string;
    coverImage: string;
    network: 'Fantom' | 'Avalanche' | 'Polygon';
    maxSupply: number;
    hideInProjects?: boolean;
    mint?: {
        weiCost: number;
        gasLimit: number;
        maxPerTx: number;
        mintImage: string;
        noWhitelist?: boolean;
        forceEndedState?: boolean;
    }
}