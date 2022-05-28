import { ethers } from "ethers";
import EventEmitter from "events";
import { assureIpfsUrl } from "../../utils/assure-ipfs-url";

export class MetadataContractWrapper extends EventEmitter {

    constructor(
        private contract: ethers.Contract
    ) {
        super();
    }

    public async getTokenImageSrc(tokenId: number): Promise<string> {
        let tokenUri = await this.getTokenUri(tokenId);
        tokenUri = assureIpfsUrl(tokenUri, undefined);
        const metadataResponse = await fetch(tokenUri);
        const metadata = await metadataResponse.json();

        return assureIpfsUrl(metadata.image, tokenUri.split('/ipfs/')[0] + '/ipfs/')
    }

    private async getTokenUri(tokenId: number): Promise<string> {
        const res = await this.contract.tokenURI(tokenId);
        return res;
    }

}