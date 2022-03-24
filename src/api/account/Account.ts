import Web3 from "web3";

export type Account = {
    web3Instance: Web3;
    walletAddress: string;
    network: {
        id: number;
        // name: string;
        // symbol: string;
    }
}