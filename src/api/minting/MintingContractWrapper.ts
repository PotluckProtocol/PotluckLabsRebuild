import EventEmitter from "events";
import { Contract } from "../../types/Contracts";
import { ProjectBaseInformation } from "../project-base-information/ProjectBaseInformation";

const LIVE_MINTING_COUNT_INTERVAL_MS = 7500;

export const WHITELIST_COUNT_CHANGED_EVENT = 'whitelistCountChanged';
export const MINTED_COUNT_CHANGED_EVENT = 'mintedCountChanged';
export const MINT_STATE_CHANGED_EVENT = 'mintStateChanged';

export type MintState = 'NotStarted' | 'WhitelistOpen' | 'Open' | 'Ended';

export type MintingContractWrapperOpts = {
    liveMintingCount?: boolean;
    hasWhitelist?: boolean;
}

export class MintingContractWrapper extends EventEmitter {

    private lastMintedSupply: number = 0;
    private liveMintingInterval: any = null;

    constructor(
        private contract: Contract,
        private projectBaseInformation: ProjectBaseInformation,
        private opts: MintingContractWrapperOpts
    ) {
        super();
        this.init();
    }

    public async mint(amount: number, fromWallet: string) {


        const { mint } = this.projectBaseInformation;
        if (!mint) {
            return false;
        }

        const totalGasLimit = String(amount * mint.gasLimit);
        const totalCostWei = String(amount * mint.weiCost);

        try {
            await this.contract.methods
                .mint(amount)
                .send({
                    gasLimit: totalGasLimit,
                    from: fromWallet,
                    to: this.contract.options.address,
                    value: totalCostWei
                });

            // Emit change to minted count
            this.getMintedCount();

            return true;
        } catch (e) {
            return false;
        }
    }

    public async getMaxSupply(): Promise<number> {
        if (typeof this.projectBaseInformation.maxSupply === 'number') {
            return this.projectBaseInformation.maxSupply;
        } else {
            return this.contract.methods.maxSupply().call();
        }
    }

    public async getMintedCount(): Promise<number> {
        let mintedCount;
        try {
            console.log(this.contract.options.address);

            mintedCount = await this.contract.methods
                .totalSupply()
                .call();

        } catch (e) {
            console.log(e);
        }
        console.log(mintedCount);

        this.lastMintedSupply = mintedCount;

        this.emit(MINTED_COUNT_CHANGED_EVENT, mintedCount);
        return mintedCount;
    }

    public async getWhitelistCount(walletAddress: string): Promise<number> {
        let wlCount: number = 0;
        if (!this.opts.hasWhitelist) {
            wlCount = await this.contract?.methods
                .whiteListed(walletAddress)
                .call();
        }

        this.emit(WHITELIST_COUNT_CHANGED_EVENT, wlCount);

        return wlCount;
    }

    public async getMintState(): Promise<MintState> {
        const emit = (state: MintState) => {
            this.emit(MINT_STATE_CHANGED_EVENT, state);
        }

        const maxSupply = this.projectBaseInformation.maxSupply;
        const endedState = (
            this.projectBaseInformation.mint?.forceEndedState ||
            this.lastMintedSupply >= maxSupply
        );

        if (endedState) {
            emit('Ended');
            return 'Ended';
        }

        const methods: string[] = ['paused'];
        if (this.opts.hasWhitelist) {
            methods.push('whitelistedOnly');
        }

        const results = await Promise.all(
            methods.map(method => this.contract.methods[method].call())
        );

        const paused: boolean = results[0];
        const whitelistedOnly: boolean = results[1] || false;

        let state: MintState;
        if (paused) {
            state = 'NotStarted';
        } else if (whitelistedOnly) {
            state = 'WhitelistOpen';
        } else {
            state = 'Open';
        }

        emit(state);
        return state;
    }


    public clearListeners(): void {
        this.removeAllListeners();

        if (this.liveMintingInterval) {
            clearInterval(this.liveMintingInterval);
        }
    }

    private init() {

        if (!this.projectBaseInformation.mint) {
            throw new Error('Minting project base information must contain mint specification');
        }

        if (this.opts.liveMintingCount) {
            this.liveMintingInterval = setInterval(() => {
                this.getMintedCount();
            }, LIVE_MINTING_COUNT_INTERVAL_MS);
        }
    }

}