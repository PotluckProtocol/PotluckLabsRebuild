import EventEmitter from "events";
import { Contract } from "../../types/Contracts";
import { ProjectBaseInformation } from "../project-base-information/ProjectBaseInformation";

const DEFAULT_IPFS_GATEWAY = 'https://cloudflare-ipfs.com/ipfs';

export class MutateContractWrapper extends EventEmitter {

    constructor(
        private serumContract: Contract,
        private targetContract: Contract,
        private projectBaseInformation: ProjectBaseInformation
    ) {
        super();
        this.init();
    }

    public async isApproved(account: string): Promise<boolean> {
        const res = await this.serumContract.methods
            .isApprovedForAll(account, this.targetContract.options.address)
            .call();
        return res as boolean;
    }

    public async approveAll(account: string) {
        const gasLimit = String(this.projectBaseInformation.mutate?.approveGasLimit);
        try {
            await this.serumContract.methods
                .setApprovalForAll(this.targetContract.options.address, true)
                .send({
                    gasLimit,
                    from: account,
                    to: this.serumContract.options.address
                });

            return true;
        } catch (e) {
            console.log(`Error on approving contract ${this.targetContract.options.address}`, e);
            return false;
        }
    }

    public async mutate(account: string, serumTokenId: number): Promise<{ succeed: boolean, imageUrl?: string }> {
        try {
            const latestIdBeforeMutation = await this.getLatestTargetTokenId(account);

            await this.targetContract.methods
                .mutate(Number(serumTokenId))
                .send({
                    gasLimit: String(this.projectBaseInformation.mutate?.mutetaGasLimit),
                    from: account,
                    to: this.targetContract.options.address
                });

            let latestId: number | null = null;
            let runCount: number = 0;
            while (true) {
                runCount++;
                console.log(`Trying to fetch the latest id (${runCount})`);

                latestId = await this.getLatestTargetTokenId(account);
                const stillMatches = latestId === latestIdBeforeMutation;

                // We found a new one!
                if (!stillMatches) {
                    break;
                }

                // Wait 3 seconds before trying again
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            let imageUrl: string | undefined = undefined;
            if (typeof latestId === 'number') {
                imageUrl = await this.getTargetTokenImageUrl(latestId);
            }

            return {
                succeed: true,
                imageUrl
            }
        } catch (e) {
            console.error(`Failed to mutate ${serumTokenId}`)
            return {
                succeed: false
            };
        }
    }

    public async getSerumIds(account: string): Promise<number[]> {
        const serumBalance = await this.serumContract.methods
            .balanceOf(account)
            .call();

        const ids: number[] = [];

        for (let i = 0; i < Number(serumBalance); i++) {
            const tokenId = await this.serumContract.methods
                .tokenOfOwnerByIndex(account, i)
                .call();

            ids.push(Number(tokenId));
        }

        return ids;
    }

    public clearListeners(): void {
        this.removeAllListeners();
    }

    private async getLatestTargetTokenId(account: string): Promise<number | null> {
        const targetBalance = await this.targetContract.methods
            .balanceOf(account)
            .call();

        const latestIndex = (Number(targetBalance) || 0) - 1;
        if (latestIndex === -1) {
            return null;
        }

        const tokenId = await this.targetContract.methods
            .tokenOfOwnerByIndex(account, latestIndex)
            .call();

        const tokenIdNum = Number(tokenId);
        return (typeof tokenIdNum === 'number' && !isNaN(tokenIdNum))
            ? tokenIdNum
            : null;
    }

    private async getTargetTokenImageUrl(tokenId: number): Promise<string> {
        const ipfsLink = await this.targetContract.methods
            .tokenURI(tokenId)
            .call() as string;

        const ipfsUrl = this.assureIpfsUri(ipfsLink);
        if (!ipfsUrl) {
            console.log('IPFS URI could not be resolved');
            return '';
        }

        let imageUrl: string;
        try {
            const response = await fetch(ipfsUrl);
            const metadata = await response.json();
            imageUrl = metadata.image;
        } catch (e) {
            console.log('Fetching metadata failed', e);
            return '';
        }

        console.log('Image url found', this.assureIpfsUri(imageUrl))

        return this.assureIpfsUri(imageUrl);
    }

    private assureIpfsUri(uri: string): string {
        const override: string = this.projectBaseInformation.overrideIpfsGateway
            ? this.fixLeadingSlash(this.projectBaseInformation.overrideIpfsGateway as string)
            : '';

        if (uri.startsWith('https://')) {
            if (override) {
                const ipfs = uri.split('/ipfs/')[1];
                return override + ipfs;
            } else {
                return uri;
            }
        } else if (uri.startsWith('ipfs://')) {
            const ipfs = uri.split('://')[1];
            if (override) {
                return override + ipfs;
            } else {
                return this.fixLeadingSlash(DEFAULT_IPFS_GATEWAY) + ipfs;
            }
        }

        return '';
    }

    private init() {
        if (!this.projectBaseInformation.mutate) {
            throw new Error('Mutate project baseInformation must contain mutate specification');
        }
    }

    private fixLeadingSlash(uri: string): string {
        return uri.endsWith('/') ? uri : `${uri}/`;
    }

}