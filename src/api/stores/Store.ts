export type StoreType = (
    'WHITELIST'
);

export type Store = {
    projectContractAddressOrName: string;
    targetWalletAddress: string;
    saleEndsOn: Date;

    type: StoreType;
    priceTokenContractAddress: string;
    priceWei: string;
}