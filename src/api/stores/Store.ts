import { Network } from "../../types/Networks";

export type StoreType = (
    'WHITELIST'
);

export type RawStore = {
    projectContractAddressOrName: string;
    targetWalletAddress: string;
    saleEndsOn: Date;
    network: string;
    type: StoreType;
    priceTokenContractAddress: string;
    priceWei: string;
}

export type Store = Omit<RawStore, 'network'> & {
    network: Network;
}