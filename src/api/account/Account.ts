import { Signer } from "ethers";
import { Network } from "../../types/Networks";

export type Account = {
    walletAddress: string;
    network: Network;
    signer: Signer;
}