import { Network } from "../../types/Networks";

export type Chain = {
    network: Network;
    contractAddress: string;
}

export type Traversing = {
    id: string;
    projectName: string;
    chains: Chain[];
}