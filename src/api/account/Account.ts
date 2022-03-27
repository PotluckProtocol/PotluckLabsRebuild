import Web3 from "web3";

export type Account = {
    walletAddress: string;
    network: {
        id: number;
        // name: string;
        // symbol: string;
    }
}