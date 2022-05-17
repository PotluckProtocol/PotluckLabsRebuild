import { BigNumber, ethers } from "ethers";
import EventEmitter from "events";
import { Wei } from "../../types/Wei";

export class ERC20TokenWrapper extends EventEmitter {

    constructor(
        public contract: ethers.Contract
    ) {
        super();
    }

    public async approve(amountWei: BigNumber, spenderAddress: string): Promise<void> {
        const tx = await this.contract.approve(spenderAddress, amountWei);
        await tx.wait();
    }

    public async getAllowance(walletAddress: string, spenderAddress: string): Promise<BigNumber> {
        return this.contract.allowance(walletAddress, spenderAddress);
    }

    public async getSymbol(): Promise<string> {
        try {
            const symbol = await this.contract.symbol();
            return symbol;
        } catch (e) {
            console.log('Error on fetching symbol', e);
            throw e;
        }
    }

    public async getDecimals(): Promise<number> {
        const res = await this.contract.decimals();
        return Number(res);
    }

    public async getBalance(walletAddress: string): Promise<BigNumber> {
        return this.contract.balanceOf(walletAddress);
    }

    public async transfer(to: string, amountWei: string): Promise<void> {
        try {
            const tx = await this.contract.transfer(to, amountWei);
            await tx.wait();
        } catch (e) {
            console.log('Tranfer failed', e);
            throw e;
        }
    }

}