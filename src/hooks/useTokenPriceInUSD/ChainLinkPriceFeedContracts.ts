export type PriceFeedToken = (
    'FTM' |
    'AVAX' |
    'MATIC'
);

export type PriceFeedItem = {
    contractAddress: string;
    decimals: number;
    networkId: number;
}

export const CHAINLINK_PRICE_FEED_CONTRACTS: Record<PriceFeedToken, PriceFeedItem> = {
    AVAX: {
        contractAddress: '0x0A77230d17318075983913bC2145DB16C7366156',
        decimals: 8,
        networkId: 43114
    },
    FTM: {
        contractAddress: '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc',
        decimals: 8,
        networkId: 250
    },
    MATIC: {
        contractAddress: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
        decimals: 8,
        networkId: 137
    }
}