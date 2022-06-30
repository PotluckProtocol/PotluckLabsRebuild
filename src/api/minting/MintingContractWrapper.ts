import { ethers } from "ethers";
import EventEmitter from "events";
import { assureIpfsUrl } from "../../utils/assure-ipfs-url";
import { ProjectBaseInformation, SingletonProjectBaseInformation } from "../project-base-information/ProjectBaseInformation";

export class InsufficientMintingBalanceError extends Error {
    constructor(msg?: string) {
        super(msg);
    }
}

const LIVE_MINT_STATE_INTERVAL_MS = 4000;
const LIVE_MINTING_COUNT_INTERVAL_MS = 4000;

export const WHITELIST_COUNT_CHANGED_EVENT = 'whitelistCountChanged';
export const MINTED_COUNT_CHANGED_EVENT = 'mintedCountChanged';
export const MINT_STATE_CHANGED_EVENT = 'mintStateChanged';

export type MintState = 'NotStarted' | 'WhitelistOpen' | 'Open' | 'Ended';

export type MintingContractWrapperOpts = {
    liveMintingCount?: boolean;
    liveMintStateRefresh?: boolean;
    hasWhitelist?: boolean;
}

export class MintingContractWrapper extends EventEmitter {

    private lastMintedSupply: number = 0;
    private liveMintingInterval: any = null;
    private liveStateInterval: any = null;

    constructor(
        private contract: ethers.Contract,
        private singletonBaseInfo: SingletonProjectBaseInformation,
        private opts: MintingContractWrapperOpts
    ) {
        super();
        this.init();
    }

    public async mint(amount: number, fromWallet: string, fastMint: boolean = false): Promise<{ succeed: boolean, tokenIds?: number[] }> {

        const { mint } = this.singletonBaseInfo;
        if (!mint) {
            return { succeed: false };
        }

        const bigNumber = ethers.BigNumber.from(mint.weiCost);
        const totalGasLimit = String(amount * mint.gasLimit);
        const totalCostWei = String(bigNumber.mul(amount));

        try {

            const preMintWalletBalance = await this.getBalanceCount(fromWallet);

            /**
             * @info
             * Ugly hack for enabling SuperSerum mint on AVAX.
             * This contract has mint method without amount.
             * @todo remove me after AVAX SuperSerum is sold out.
             */
            if (this.singletonBaseInfo.contractAddress === '0x246CBfEfd5B70D74335F0aD25E660Ba1e2259858') {
                await this.waitTx(this.contract.mint({ value: totalCostWei, gasLimit: totalGasLimit }));
            } else {
                // If erc20 mint no need for sending value as it is not payable method
                const value = (this.singletonBaseInfo.mint?.priceErc20Token) ? undefined : totalCostWei;
                await this.waitTx(this.contract.mint(amount, { value, gasLimit: totalGasLimit }));
            }

            let tokenIds: number[] | undefined;

            // If fast mint then do not fetch image data
            if (!fastMint) {
                tokenIds = [];

                let afterMintWalletBalance;
                while (afterMintWalletBalance !== preMintWalletBalance + amount) {
                    await this.sleep(1000);
                    afterMintWalletBalance = await this.getBalanceCount(fromWallet);
                }

                for (let i = preMintWalletBalance; i < afterMintWalletBalance; i++) {
                    const id = await this.getTokenId(fromWallet, i);
                    tokenIds.push(id);
                }
            }

            // Emit change to minted count and whitelist count
            try {
                const promises: Promise<any>[] = [];
                promises.push(this.getMintedCount());
                if (this.opts.hasWhitelist) {
                    promises.push(this.getWhitelistCount(fromWallet));
                }
                await Promise.all(promises);
            } catch (e) {
                console.log('Failed to read minted count or whitelist count after mint');
                // Noop, not so important
            }

            return { succeed: true, tokenIds }
        } catch (e: any) {
            if (e.data?.code === -32000 && e.data?.message.includes('insufficient balance')) {
                throw new InsufficientMintingBalanceError();
            } else {
                console.log('Mint failed', e)
                return { succeed: false };
            }
        }
    }

    public async getMaxSupply(): Promise<number> {
        if (typeof this.singletonBaseInfo.initialSupply === 'number') {
            return this.singletonBaseInfo.initialSupply;
        } else {
            return Number(this.contract.maxSupply());
        }
    }

    public async getMintedCount(): Promise<number> {
        let mintedCount: number;
        try {
            mintedCount = Number(await this.contract.totalSupply());
        } catch (e) {
            console.log('Failed to get mint count', e);
            throw e;
        }

        this.lastMintedSupply = mintedCount;

        this.emit(MINTED_COUNT_CHANGED_EVENT, mintedCount);
        return mintedCount;
    }

    public async getWhitelistCount(walletAddress: string): Promise<number> {
        let wlCount: number = 0;
        if (this.opts.hasWhitelist) {
            wlCount = Number(await this.contract.whiteListed(walletAddress));
        }

        this.emit(WHITELIST_COUNT_CHANGED_EVENT, wlCount);

        return wlCount;
    }

    public async getMintState(): Promise<MintState> {
        const emit = (state: MintState) => {
            this.emit(MINT_STATE_CHANGED_EVENT, state);
        }

        const maxSupply = this.singletonBaseInfo.initialSupply;
        const endedState = (
            this.singletonBaseInfo.mint?.forceEndedState ||
            this.lastMintedSupply >= maxSupply
        );

        if (endedState) {
            emit('Ended');
            return 'Ended';
        }

        const paused: boolean = await this.contract.paused();
        let whitelistedOnly = false;
        try {
            whitelistedOnly = await this.contract.whitelistedOnly();
        } catch (e) {
            whitelistedOnly = false;
        }

        // Escape hatch for marking those projects NotStarted which has have 
        // unpaused state false but have no whitelist existing.
        const notStartedEscapeHatch = !this.opts.hasWhitelist && whitelistedOnly;

        let state: MintState;
        if (paused || notStartedEscapeHatch) {
            state = 'NotStarted';
        } else if (whitelistedOnly) {
            state = 'WhitelistOpen';
        } else {
            state = 'Open';
        }

        emit(state);
        return state;
    }

    public async getImageUrls(tokenIds: number[]): Promise<string[]> {
        const imageUrls: string[] = [];

        for (const tokenId of tokenIds) {
            let tokenUri = await this.getTokenUri(tokenId);
            tokenUri = assureIpfsUrl(tokenUri, this.singletonBaseInfo.overrideIpfsGateway || undefined);
            const metadataResponse = await fetch(tokenUri);
            const metadata = await metadataResponse.json();

            const imageUrl = assureIpfsUrl(metadata.image, tokenUri.split('/ipfs/')[0] + '/ipfs/')
            imageUrls.push(imageUrl);
        }

        return imageUrls;
    }

    public clearListeners(): void {
        this.removeAllListeners();

        if (this.liveMintingInterval) {
            clearInterval(this.liveMintingInterval);
        }

        if (this.liveStateInterval) {
            clearInterval(this.liveStateInterval);
        }
    }

    private async getBalanceCount(walletAddress: string): Promise<number> {
        const res = await this.contract.balanceOf(walletAddress);
        return Number(res);
    }

    private async getTokenId(walletAddress: string, index: number): Promise<number> {
        const res = await this.contract.tokenOfOwnerByIndex(walletAddress, index);
        return Number(res);
    }

    private async getTokenUri(tokenId: number): Promise<string> {
        const res = await this.contract.tokenURI(tokenId);
        return res;
    }

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private init() {
        if (this.opts.liveMintingCount) {
            this.liveMintingInterval = setInterval(() => {
                this.getMintedCount();
            }, LIVE_MINTING_COUNT_INTERVAL_MS);
        }

        if (!this.singletonBaseInfo.mint?.forceEndedState && this.opts.liveMintStateRefresh) {
            this.liveStateInterval = setInterval(() => {
                this.getMintState();
            }, LIVE_MINT_STATE_INTERVAL_MS);
        }
    }

    private async waitTx(promise: Promise<any>) {
        const tx = await promise;
        await tx.wait();
    }

}